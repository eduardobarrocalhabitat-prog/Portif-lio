import * as THREE from "three";

import fotos from "@/data/tunel.json";

/* ---------------------------------------------------------------------------
   A cena do túnel.

   Um corredor de fotos: 78 planos nas paredes de um túnel elíptico, e quatro
   destaques que saem da parede, cobrem a tela e viram a abertura do case.
   Quem manda é o scroll: a linha do tempo escreve em `estado` (onde a câmera
   deve estar, quanto cada destaque está puxado) e chama `invalidar()`. A cena
   só desenha quando algo muda, nunca num laço eterno.
--------------------------------------------------------------------------- */

export const DESTAQUE_Z = [-14, -33, -52, -71];
export const FIM_Z = -88;
/** Os destaques são 16:9, como as capas das marcas. */
const DW = 6;
const DH = (6 * 1080) / 1920;
const PAREDES = 78;
const BG = 0xf2f0eb;

/** `puxar` é um objeto por destaque: o GSAP trataria números soltos num array como alvos. */
export type Estado = { camZ: number; puxar: { v: number }[] };

export type Cena = {
  estado: Estado;
  invalidar: () => void;
  /** Onde a câmera fica para o destaque k cobrir a tela. */
  cobrir: (k: number) => number;
  destruir: () => void;
};

/* Sorteio com semente fixa: o túnel é sempre o mesmo. */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/*
  Profundidade de campo barata: o viés de mipmap de cada plano entra no
  `texture2D`. Foto longe ou rente à lente fica macia; a do meio, nítida.
*/
function material(map: THREE.Texture) {
  const m = new THREE.MeshBasicMaterial({
    map,
    transparent: true,
    depthWrite: false,
    opacity: 0,
  });
  const bias = { value: 0 };
  m.onBeforeCompile = (shader) => {
    shader.uniforms.uBias = bias;
    shader.fragmentShader =
      "uniform float uBias;\n" +
      shader.fragmentShader.replace(
        "#include <map_fragment>",
        "#ifdef USE_MAP\n  vec4 sampledDiffuseColor = texture2D( map, vMapUv, uBias );\n  diffuseColor *= sampledDiffuseColor;\n#endif",
      );
  };
  m.customProgramCacheKey = () => "tunel-bias";
  m.userData.bias = bias;
  return m;
}

type Plano = {
  mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>;
  ang: number;
  raio: number;
  z: number;
  /** Escala na parede (largura, altura). */
  w: number;
  h: number;
};

export function criarCena(
  canvas: HTMLCanvasElement,
  destaques: string[],
  opts: { reduzido: boolean },
): Cena {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(BG, 1);
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(BG, 9, 44);
  const camera = new THREE.PerspectiveCamera(50, 1, 0.05, 140);
  camera.position.set(0, 0, 6);

  const estado: Estado = { camZ: 6, puxar: destaques.map(() => ({ v: 0 })) };
  const rand = mulberry32(20261027);
  const loader = new THREE.TextureLoader();
  const geo = new THREE.PlaneGeometry(1, 1);
  const texturas: THREE.Texture[] = [];

  let raf = 0;
  const invalidar = () => {
    if (!raf) raf = requestAnimationFrame(quadro);
  };

  const carregar = (src: string) => {
    const t = loader.load(src, () => invalidar());
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
    texturas.push(t);
    return t;
  };

  /* ---- Paredes --------------------------------------------------------- */

  const texParede = fotos.map((f) => carregar(f.src));
  const paredes: Plano[] = [];
  for (let i = 0; i < PAREDES; i++) {
    const f = fotos[i % fotos.length];
    let ang = i * 2.39996 + (rand() - 0.5) * 0.5;
    // Os primeiros fogem do canto inferior esquerdo, onde está o nome.
    if (i < 10 && Math.cos(ang) < 0 && Math.sin(ang) < 0) ang += Math.PI * 0.55;
    const raio = 3.5 + rand() * 2.1;
    const z = 3.5 - (i / (PAREDES - 1)) * 99.5 + (rand() - 0.5) * 1.2;
    const h = 1.05 + rand() * 1.15;
    const w = h * (f.w / f.h);
    const mesh = new THREE.Mesh(geo, material(texParede[i % fotos.length]));
    mesh.rotation.x = Math.sin(ang) * 0.28;
    mesh.rotation.y = -Math.cos(ang) * 0.32;
    mesh.scale.set(w, h, 1);
    scene.add(mesh);
    paredes.push({ mesh, ang, raio, z, w, h });
  }

  /* ---- Destaques: começam na parede, como os outros -------------------- */

  const ANG_DESTAQUE = [0.55, 2.5, 3.95, 5.6];
  const dest: Plano[] = destaques.map((src, k) => {
    const mesh = new THREE.Mesh(geo, material(carregar(src)));
    scene.add(mesh);
    return {
      mesh,
      ang: ANG_DESTAQUE[k % 4],
      raio: 4.6,
      z: DESTAQUE_Z[k],
      w: DW,
      h: DH,
    };
  });

  /* ---- Encaixe na tela ------------------------------------------------- */

  let fx = 1.45;
  let fy = 1;
  let retrato = false;
  const tan = () => Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));

  const medir = () => {
    const w = canvas.clientWidth || window.innerWidth;
    const h = canvas.clientHeight || window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    retrato = camera.aspect < 0.8;
    camera.fov = retrato ? 62 : 50;
    camera.updateProjectionMatrix();
    fx = retrato ? 0.72 : 1.45;
    fy = retrato ? 1.55 : 1;
    for (const p of paredes) {
      p.mesh.position.set(
        Math.cos(p.ang) * p.raio * fx,
        Math.sin(p.ang) * p.raio * fy,
        p.z,
      );
    }
    invalidar();
  };

  const cobrir = (k: number) => {
    const t = tan();
    const dist = retrato
      ? DW / (0.9 * 2 * t * camera.aspect)
      : 0.94 * Math.min(DH / (2 * t), DW / (2 * t * camera.aspect));
    return DESTAQUE_Z[k] + dist;
  };

  /* ---- Cursor: desloca a câmera de leve, só com ponteiro fino ---------- */

  const alvo = { x: 0, y: 0 };
  const ptr = { x: 0, y: 0 };
  const fino = matchMedia("(pointer: fine)").matches && !opts.reduzido;
  const onPointer = (e: PointerEvent) => {
    alvo.x = (e.clientX / window.innerWidth - 0.5) * 2;
    alvo.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    invalidar();
  };
  if (fino)
    window.addEventListener("pointermove", onPointer, { passive: true });

  /* ---- Quadro ---------------------------------------------------------- */

  const k = opts.reduzido ? 1 : 0.14;

  function quadro() {
    raf = 0;
    const puxarMax = Math.max(...estado.puxar.map((p) => p.v));
    const forca = 1 - puxarMax * 0.92;

    camera.position.z += (estado.camZ - camera.position.z) * k;
    ptr.x += (alvo.x - ptr.x) * 0.06;
    ptr.y += (alvo.y - ptr.y) * 0.06;
    camera.position.x = ptr.x * 0.55 * forca;
    camera.position.y = ptr.y * 0.35 * forca;
    camera.lookAt(
      camera.position.x * 0.3,
      camera.position.y * 0.3,
      camera.position.z - 12,
    );

    const cam = camera.position;
    const recuo = 1 - puxarMax * 0.88;
    for (const p of paredes) {
      const d = cam.distanceTo(p.mesh.position);
      p.mesh.material.opacity =
        p.z > cam.z + 0.5 ? 0 : smooth(0.4, 2.2, d) * recuo;
      p.mesh.material.userData.bias.value =
        d < 6 ? (6 - d) * 0.45 : d > 22 ? Math.min(3, (d - 22) * 0.12) : 0;
    }

    dest.forEach((p, i) => {
      const s = smooth(0, 1, estado.puxar[i].v);
      const wx = Math.cos(p.ang) * p.raio * fx;
      const wy = Math.sin(p.ang) * p.raio * fy;
      p.mesh.position.set(lerp(wx, 0, s), lerp(wy, 0, s), p.z);
      const esc = lerp(0.36, 1, s);
      p.mesh.scale.set(p.w * esc, p.h * esc, 1);
      p.mesh.rotation.x = lerp(Math.sin(p.ang) * 0.28, 0, s);
      p.mesh.rotation.y = lerp(-Math.cos(p.ang) * 0.32, 0, s);
      // Some nos últimos centímetros, quando a câmera atravessa a foto.
      const dz = cam.z - p.z;
      const d = cam.distanceTo(p.mesh.position);
      p.mesh.material.opacity =
        dz <= 0 ? 0 : s > 0.02 ? smooth(0.05, 0.6, dz) : smooth(0.4, 2.2, d);
      p.mesh.material.userData.bias.value =
        s > 0.5 ? 0 : d > 22 ? Math.min(3, (d - 22) * 0.12) : 0;
    });

    renderer.render(scene, camera);

    const parado =
      Math.abs(estado.camZ - camera.position.z) < 0.0008 &&
      Math.abs(alvo.x - ptr.x) < 0.0008 &&
      Math.abs(alvo.y - ptr.y) < 0.0008;
    if (!parado) invalidar();
  }

  const ro = new ResizeObserver(medir);
  ro.observe(canvas);
  medir();

  return {
    estado,
    invalidar,
    cobrir,
    destruir: () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("pointermove", onPointer);
      geo.dispose();
      for (const t of texturas) t.dispose();
      for (const p of [...paredes, ...dest]) p.mesh.material.dispose();
      renderer.dispose();
    },
  };
}
