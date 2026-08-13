/**
 * As marcas dos canais de contato, em SVG inline.
 *
 * Desenhadas como emblema: a forma cheia leva a cor do botão e o glifo é
 * vazado nela. É o mesmo desenho dos PNGs que o Eduardo mandou, e em SVG por
 * dois motivos que respondem direto à preocupação dele com peso: os quatro
 * juntos não chegam a 2 KB, contra dezenas de KB em bitmap, e vetor não perde
 * nitidez em nenhuma tela nem em nenhum tamanho.
 *
 * O vazado é feito com `fill-rule="evenodd"` num caminho só, e não com um
 * retângulo branco por cima: assim o miolo é transparente de verdade, e o
 * emblema funciona sobre qualquer fundo.
 *
 * Todos vêm com `aria-hidden`: quem dá nome ao link é o `aria-label` do
 * elemento em volta. Um ícone sozinho não diz nada a quem não enxerga, e botão
 * de contato sem nome é botão perdido.
 */

export type ContactIconName = "whatsapp" | "email" | "linkedin" | "behance";

const MARCAS: Record<ContactIconName, React.ReactNode> = {
  /*
    Único que NÃO é emblema.

    Os outros três moram sozinhos e a forma cheia é o próprio botão. O WhatsApp
    mora dentro da pílula preta, e um emblema ali seria forma dentro de forma:
    um círculo desenhado em cima de uma pílula. Aqui vale o balão solto, que é
    como a marca se apresenta em qualquer lugar.
  */
  whatsapp: (
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.86 9.86 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 1.67c2.2 0 4.27.86 5.83 2.42a8.2 8.2 0 0 1 2.41 5.82c0 4.54-3.7 8.24-8.25 8.24a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24Zm-3.2 4.3c-.15 0-.4.06-.6.28-.21.22-.8.78-.8 1.9s.82 2.2.93 2.36c.12.15 1.6 2.44 3.88 3.42.54.24.96.38 1.29.48.54.17 1.04.15 1.43.09.43-.06 1.34-.55 1.53-1.08.19-.53.19-.98.13-1.08-.06-.09-.21-.15-.43-.26-.23-.11-1.35-.66-1.55-.74-.21-.08-.36-.11-.51.11-.15.23-.58.74-.72.89-.13.15-.26.17-.49.06-.22-.12-.95-.35-1.81-1.12a6.8 6.8 0 0 1-1.26-1.55c-.13-.23-.01-.35.1-.46.1-.1.23-.26.34-.4.11-.13.15-.22.22-.37.08-.15.04-.28-.02-.4-.06-.11-.5-1.24-.7-1.69-.18-.44-.37-.38-.5-.39h-.44Z" />
  ),

  /* Círculo cheio com o envelope vazado. */
  email: (
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0ZM6.3 6.9h11.4c.94 0 1.7.76 1.7 1.7v6.8c0 .94-.76 1.7-1.7 1.7H6.3a1.7 1.7 0 0 1-1.7-1.7V8.6c0-.94.76-1.7 1.7-1.7Zm.87 1.55L12 12.28l4.83-3.83H7.17ZM6.15 9.4v6c0 .08.07.15.15.15h11.4c.08 0 .15-.07.15-.15v-6l-5.37 4.26a.78.78 0 0 1-.96 0L6.15 9.4Z"
    />
  ),

  /* Círculo cheio com o "in" vazado. */
  linkedin: (
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0ZM7.06 5.6c.88 0 1.46.52 1.46 1.26 0 .72-.58 1.26-1.48 1.26h-.02c-.86 0-1.42-.54-1.42-1.26 0-.74.58-1.26 1.46-1.26ZM5.72 9.34h2.65v8.1H5.72v-8.1Zm4.16 0h2.65v1.13a2.9 2.9 0 0 1 2.52-1.32c1.84 0 3.22 1.2 3.22 3.79v4.5h-2.65v-4.19c0-1.05-.38-1.77-1.32-1.77-.72 0-1.15.48-1.34.95-.07.17-.09.4-.09.63v4.38H9.88s.04-7.11 0-7.85v-.25Z"
    />
  ),

  /* Quadrado de cantos arredondados com o "Bē" vazado. */
  behance: (
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6.6 0h10.8A6.6 6.6 0 0 1 24 6.6v10.8a6.6 6.6 0 0 1-6.6 6.6H6.6A6.6 6.6 0 0 1 0 17.4V6.6A6.6 6.6 0 0 1 6.6 0Zm-2.1 6.7h4.32c1.1 0 1.94.25 2.5.75.55.5.83 1.2.83 2.1 0 .62-.14 1.13-.42 1.53-.23.32-.55.58-.96.77.6.16 1.05.45 1.35.87.34.48.51 1.06.51 1.75 0 .98-.31 1.74-.93 2.28-.62.54-1.49.81-2.6.81H4.5V6.7Zm2.24 3.97h1.74c.41 0 .72-.09.93-.27.2-.18.3-.44.3-.79 0-.34-.1-.6-.3-.77-.2-.18-.5-.27-.9-.27H6.74v2.1Zm0 4.28h1.9c.47 0 .82-.1 1.05-.31.24-.21.36-.52.36-.92 0-.4-.12-.7-.35-.9-.23-.2-.58-.3-1.05-.3H6.74v2.43ZM14.9 7.3h4.6v1.3h-4.6V7.3Zm2.36 2.4c1.1 0 1.99.36 2.66 1.08.67.72 1 1.7 1 2.94v.6h-5.15c.05.5.21.88.48 1.13.28.26.65.39 1.11.39.37 0 .68-.08.92-.23.24-.16.4-.37.47-.63h2.13c-.17.85-.6 1.51-1.28 1.98-.68.47-1.51.7-2.5.7-1.19 0-2.15-.37-2.87-1.1-.72-.74-1.08-1.72-1.08-2.94 0-1.2.36-2.17 1.09-2.91.72-.74 1.7-1.11 2.92-1.11Zm-.03 1.72c-.42 0-.76.12-1.02.36-.26.24-.42.57-.48 1h2.94c-.04-.44-.18-.78-.42-1.02-.25-.23-.59-.34-1.02-.34Z"
    />
  ),
};

export function ContactIcon({ name }: { name: ContactIconName }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
      {MARCAS[name]}
    </svg>
  );
}
