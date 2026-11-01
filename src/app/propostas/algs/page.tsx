import type { Metadata } from "next";
import Link from "next/link";

import { Logo } from "@/components/ml/Hero";
import { WhatsAppIcone } from "@/components/ml/WhatsApp";
import { whatsapp } from "@/data/margem";
import styles from "./algs.module.css";

/* ---------------------------------------------------------------------------
   Proposta comercial para a ALGS (brinquedos de controle remoto).

   Página solta do portfólio: não aparece no menu nem no Google (noindex), só
   abre para quem recebe o link. Montada como apresentação: cada seção é um
   "slide" com um assunto só, o número dela e um título grande.
--------------------------------------------------------------------------- */

export const metadata: Metadata = {
  title: "Proposta ALGS · Estruturação e Gestão de E-commerce",
  description:
    "Implantação de TikTok Shop e integração com Mercado Livre e Bling para a ALGS.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Proposta ALGS · Estruturação e Gestão de E-commerce",
    description: "Implantação de TikTok Shop, Mercado Livre e Bling.",
    images: ["/media/og.jpg"],
  },
};

const APROVAR = whatsapp(
  "Oi, Eduardo! Li a proposta de e-commerce para a ALGS e quero conversar sobre os próximos passos.",
);

const BLING = [
  "Configuração e implantação do Bling.",
  "Organização do catálogo de produtos.",
  "Padronização dos cadastros e códigos SKU.",
  "Organização dos custos e valores dos produtos.",
  "Integração das contas do Mercado Livre.",
  "Integração com o TikTok Shop.",
  "Sincronização do estoque entre os canais.",
  "Centralização dos pedidos.",
  "Configuração dos processos de expedição.",
  "Testes de funcionamento das integrações.",
];

const TIKTOK = [
  "Criação e configuração da loja.",
  "Configuração das informações comerciais.",
  "Cadastro e organização inicial dos produtos.",
  "Adaptação dos títulos e descrições dos anúncios.",
  "Configuração das ferramentas comerciais.",
  "Preparação da estrutura para campanhas e divulgação.",
  "Integração com o estoque centralizado.",
];

const ATIVACAO = [
  "Ativação dos produtos e início das vendas.",
  "Acompanhamento dos primeiros pedidos.",
  "Monitoramento da sincronização do estoque.",
  "Ajustes nos anúncios e cadastros.",
  "Análise inicial de desempenho.",
  "Identificação de oportunidades comerciais.",
  "Ajustes operacionais conforme o comportamento da loja.",
];

const PLANOS = [
  {
    n: "Plano 1",
    nome: "Conteúdo",
    resumo:
      "Produção de conteúdo para divulgação e comercialização dos produtos no TikTok.",
    inclui: null,
    itens: [
      "Planejamento de conteúdos.",
      "Desenvolvimento de criativos e vídeos de produtos.",
      "Edição e adaptação de materiais.",
      "Organização de calendário de publicações.",
      "Pesquisa de referências e tendências de conteúdo.",
    ],
    cobranca: "Valor fixo mensal.",
  },
  {
    n: "Plano 2",
    nome: "Gestão de loja e crescimento",
    resumo: "Conteúdo aliado à gestão da operação comercial no TikTok Shop.",
    inclui: "Tudo do Plano 1, mais:",
    itens: [
      "Gerenciamento do catálogo e dos produtos.",
      "Organização e atualização de anúncios.",
      "Gestão de promoções e campanhas comerciais.",
      "Acompanhamento de pedidos e indicadores.",
      "Monitoramento de dúvidas, suporte e solicitações de clientes.",
      "Identificação de tendências e oportunidades de mercado.",
      "Benchmark de concorrentes e produtos semelhantes.",
      "Planejamento de estratégias comerciais.",
      "Gestão de campanhas de TikTok Ads.",
    ],
    cobranca:
      "Valor fixo mensal ou valor fixo + percentual sobre as vendas.",
  },
  {
    n: "Plano 3",
    nome: "Gestão completa + Lives",
    resumo:
      "Uma operação completa de conteúdo, gestão comercial e vendas por transmissões ao vivo.",
    inclui: "Tudo do Plano 2, mais:",
    itens: [
      "Planejamento e apresentação de lives comerciais.",
      "Demonstração dos produtos ao vivo.",
      "Apresentação de ofertas e condições especiais.",
      "Estratégias de interação e conversão durante as transmissões.",
      "Planejamento de calendário de lives.",
      "Análise de desempenho das transmissões.",
    ],
    cobranca:
      "Valor fixo mensal ou valor fixo + percentual sobre as vendas, considerando a dedicação adicional das transmissões.",
  },
];

const CONDICOES = [
  {
    t: "Foco dos dois primeiros meses",
    d: "Implantação da estrutura e ativação do novo canal de vendas.",
  },
  {
    t: "Comissão de 0% no TikTok Shop",
    d: "Incentivo por até 60 dias para novos vendedores elegíveis, mediante cumprimento das condições e missões de ativação da plataforma.",
  },
  {
    t: "Remuneração recorrente",
    d: "Definida após o período inicial, considerando o volume de vendas, a complexidade da operação e o nível de serviço contratado.",
  },
  {
    t: "Custos da empresa",
    d: "Anúncios (TikTok Ads), eventuais comissões de afiliados, assinaturas de sistemas e demais custos operacionais.",
  },
  {
    t: "Atendimento, devoluções e expedição",
    d: "Responsabilidades e fluxos definidos em conjunto, conforme o plano contratado.",
  },
];

function Lista({ itens }: { itens: string[] }) {
  return (
    <ul className={styles.lista}>
      {itens.map((t) => (
        <li key={t}>{t}</li>
      ))}
    </ul>
  );
}

function Slide({
  n,
  rotulo,
  titulo,
  tom,
  children,
}: {
  n: string;
  rotulo: string;
  titulo: React.ReactNode;
  tom?: "claro";
  children: React.ReactNode;
}) {
  const id = `slide-${n}`;
  return (
    <section
      className={`${styles.slide} ${tom === "claro" ? styles.alt : ""}`}
      aria-labelledby={id}
    >
      <div className={styles.miolo}>
        <p className={styles.marca}>
          <span>{n}</span>
          {rotulo}
        </p>
        <h2 id={id} className={styles.h2}>
          {titulo}
        </h2>
        {children}
      </div>
    </section>
  );
}

export default function PropostaALGS() {
  return (
    <main className={styles.pagina}>
      {/* ---- Capa ---- */}
      <section className={styles.capa} aria-labelledby="titulo">
        <header className={styles.topo}>
          <Link href="/" aria-label="Eduardo Barrocal, ir para o portfólio">
            <Logo className={styles.logo} />
          </Link>
          <span>Proposta comercial</span>
        </header>

        <div className={styles.capaMeio}>
          <p className={styles.para}>Proposta para ALGS</p>
          <h1 id="titulo" className={styles.titulo}>
            Estruturação e Gestão de E&#8209;commerce
          </h1>
          <p className={styles.sub}>
            Implantação de TikTok Shop, Mercado Livre e Bling
          </p>
        </div>

        <dl className={styles.fatos}>
          <div>
            <dt>Implantação</dt>
            <dd>2 meses</dd>
          </div>
          <div>
            <dt>Investimento</dt>
            <dd>R$ 1.500</dd>
          </div>
          <div>
            <dt>Canais integrados</dt>
            <dd>Mercado Livre + TikTok Shop</dd>
          </div>
        </dl>
      </section>

      {/* ---- 01 Objetivo ---- */}
      <Slide n="01" rotulo="Objetivo do projeto" titulo="Vender em mais canais, com tudo controlado em um lugar só.">
        <div className={styles.duasCol}>
          <div className={styles.texto}>
            <p>
              Estruturar uma operação de vendas integrada entre Mercado Livre e
              TikTok Shop, centralizando o controle de produtos, estoque,
              pedidos e informações comerciais em um único sistema.
            </p>
            <p>
              O objetivo é ampliar os canais de venda da empresa sem
              comprometer a organização operacional já existente, preparando a
              estrutura para crescer com segurança e eficiência.
            </p>
          </div>

          {/* Os canais ligados ao sistema central. */}
          <div className={styles.mapa} aria-label="Canais ligados ao Bling">
            <div className={styles.canais}>
              <span className={styles.canal}>
                <small>Canal atual</small>Mercado Livre
              </span>
              <span className={`${styles.canal} ${styles.novo}`}>
                <small>Novo canal</small>TikTok Shop
              </span>
              <span className={`${styles.canal} ${styles.opcional}`}>
                <small>Opcional</small>Loja própria
              </span>
            </div>
            <span className={styles.liga} aria-hidden />
            <span className={styles.central}>
              <small>Sistema central</small>Bling
              <em>Produtos · Estoque · Pedidos</em>
            </span>
          </div>
        </div>
      </Slide>

      {/* ---- 02 Cronograma ---- */}
      <Slide n="02" rotulo="Cronograma" titulo="Dois meses, duas etapas." tom="claro">
        <div className={styles.linha}>
          <div className={styles.meses} aria-hidden>
            <span>Mês 1</span>
            <span>Mês 2</span>
          </div>
          <div className={`${styles.barra} ${styles.barraLonga}`}>
            <strong>Etapa 1 · Implantação e estruturação</strong>
            <span>Bling, integrações e montagem do TikTok Shop</span>
          </div>
          <div className={`${styles.barra} ${styles.barraCurta}`}>
            <strong>Etapa 2 · Ativação</strong>
            <span>Início das vendas no TikTok Shop</span>
          </div>
        </div>
        <p className={styles.legenda}>
          O projeto terá dois meses de implantação, divididos entre organização
          operacional, configuração das plataformas e início da operação
          comercial.
        </p>
      </Slide>

      {/* ---- 03 Etapa 1 ---- */}
      <Slide n="03" rotulo="Etapa 1 · Meses 1 e 2" titulo="Implantação e estruturação">
        <div className={styles.cards2}>
          <article className={styles.card}>
            <p className={styles.tag}>Sistema central</p>
            <h3 className={styles.h3}>Organização e integração com Bling</h3>
            <p className={styles.nota}>
              Utilização do plano Titânio como sistema central de gestão.
            </p>
            <Lista itens={BLING} />
          </article>
          <article className={styles.card}>
            <p className={styles.tag}>Novo canal</p>
            <h3 className={styles.h3}>Implantação do TikTok Shop</h3>
            <p className={styles.nota}>
              Loja nova, já ligada ao estoque centralizado.
            </p>
            <Lista itens={TIKTOK} />
          </article>
        </div>

        <article className={`${styles.card} ${styles.destaque}`}>
          <div>
            <p className={styles.tag}>Diferencial</p>
            <h3 className={styles.h3}>Loja Virtual própria</h3>
          </div>
          <div className={styles.texto}>
            <p>
              O plano Titânio também permite utilizar a Loja Virtual nativa do
              Bling: um e&#8209;commerce próprio, com catálogo de produtos,
              domínio personalizado, checkout e gestão integrada ao ERP. Um
              terceiro canal de vendas, independente dos marketplaces.
            </p>
            <p className={styles.nota}>
              A Loja Virtual possui contratação e condições comerciais próprias,
              com plano de entrada gratuito para até 50 pedidos mensais,
              conforme as regras da plataforma.
            </p>
          </div>
        </article>
      </Slide>

      {/* ---- 04 Investimento ---- */}
      <Slide n="04" rotulo="Investimento da implantação" titulo="R$ 1.500 para estruturar toda a operação." tom="claro">
        <div className={styles.invest}>
          <div className={styles.total}>
            <small>Total da implantação</small>
            <strong>R$ 1.500</strong>
            <span>Implantação e estruturação de toda a operação</span>
          </div>
          <div className={styles.parcelas}>
            <div>
              <small>Primeiro mês</small>
              <strong>R$ 750</strong>
            </div>
            <div>
              <small>Segundo mês</small>
              <strong>R$ 750</strong>
            </div>
          </div>
        </div>
        <div className={styles.cards2}>
          <div className={styles.inclusoBox}>
            <p className={styles.tag}>Está incluso</p>
            <p>
              Implantação do TikTok Shop e a organização e configuração do
              Bling para a operação dos canais de venda.
            </p>
          </div>
          <div className={styles.inclusoBox}>
            <p className={styles.tag}>Pago pela empresa</p>
            <p>
              A assinatura do Bling e eventuais serviços adicionais, pagos
              diretamente pela empresa.
            </p>
          </div>
        </div>
      </Slide>

      {/* ---- 05 Etapa 2 ---- */}
      <Slide n="05" rotulo="Etapa 2 · Mês 2" titulo="Ativação e início da operação">
        <p className={styles.lead}>
          Durante o segundo mês, com a estrutura preparada, iniciaremos a
          operação comercial do TikTok Shop.
        </p>
        <ol className={styles.passos}>
          {ATIVACAO.map((t, i) => (
            <li key={t}>
              <span>{String(i + 1).padStart(2, "0")}</span>
              {t}
            </li>
          ))}
        </ol>
        <p className={styles.legenda}>
          O objetivo é validar a operação, identificar possíveis gargalos e
          preparar a loja para um crescimento sustentável.
        </p>
      </Slide>

      {/* ---- 06 Planos ---- */}
      <Slide n="06" rotulo="Gestão recorrente" titulo="Depois da implantação, três formas de continuar." tom="claro">
        <p className={styles.lead}>
          A continuidade do trabalho poderá ser contratada de acordo com o
          nível de participação desejado pela empresa.
        </p>
        <ol className={styles.planos}>
          {PLANOS.map((p, i) => (
            <li
              key={p.n}
              className={`${styles.card} ${styles.plano} ${i === 2 ? styles.planoTop : ""}`}
            >
              <p className={styles.tag}>{p.n}</p>
              <h3 className={styles.planoNome}>{p.nome}</h3>
              <p className={styles.nota}>{p.resumo}</p>
              {p.inclui && <p className={styles.inclui}>{p.inclui}</p>}
              <Lista itens={p.itens} />
              <div className={styles.cobranca}>
                <small>Modelo de cobrança</small>
                <p>{p.cobranca}</p>
              </div>
            </li>
          ))}
        </ol>
      </Slide>

      {/* ---- 07 Condições ---- */}
      <Slide n="07" rotulo="Condições comerciais" titulo="Como funciona a parceria">
        <ul className={styles.condicoes}>
          {CONDICOES.map((c) => (
            <li key={c.t} className={styles.cond}>
              <h3>{c.t}</h3>
              <p>{c.d}</p>
            </li>
          ))}
        </ul>
      </Slide>

      {/* ---- 08 Resultado ---- */}
      <section className={styles.final} aria-labelledby="slide-08">
        <div className={styles.miolo}>
          <p className={styles.marca}>
            <span>08</span>Resultado esperado
          </p>
          <h2 id="slide-08" className={styles.finalTitulo}>
            Uma operação integrada, pronta para crescer sem perder o controle.
          </h2>
          <ul className={styles.resultados}>
            <li>
              Estrutura integrada entre Mercado Livre e TikTok Shop, com
              controle centralizado de estoque, produtos e pedidos.
            </li>
            <li>
              Possibilidade de uma loja virtual própria, ampliando a
              independência em relação aos marketplaces.
            </li>
            <li>
              Base para desenvolver novos canais, explorar oportunidades
              comerciais e ampliar a presença digital da marca.
            </li>
          </ul>
          <a
            className="btnCreme"
            href={APROVAR}
            target="_blank"
            rel="noreferrer"
          >
            <WhatsAppIcone />
            Conversar no WhatsApp
          </a>
        </div>
      </section>
    </main>
  );
}
