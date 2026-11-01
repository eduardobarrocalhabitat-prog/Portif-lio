import type { Metadata } from "next";
import Link from "next/link";

import { Logo } from "@/components/ml/Hero";
import { WhatsAppIcone } from "@/components/ml/WhatsApp";
import { whatsapp } from "@/data/margem";
import styles from "./algs.module.css";

/* ---------------------------------------------------------------------------
   Proposta comercial para a ALGS (brinquedos de controle remoto).

   Página solta do portfólio: não aparece no menu nem no Google (noindex), só
   abre para quem recebe o link. Usa a mesma paleta, as mesmas fontes e os
   mesmos botões do site, sem a rolagem animada da home.
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

type Plano = {
  numero: string;
  nome: string;
  resumo: string;
  inclui?: string;
  itens: string[];
  cobranca: string;
};

const PLANOS: Plano[] = [
  {
    numero: "01",
    nome: "Conteúdo",
    resumo:
      "Produção de conteúdo para divulgação e comercialização dos produtos no TikTok.",
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
    numero: "02",
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
      "Valor fixo mensal ou composição de valor fixo com percentual sobre as vendas.",
  },
  {
    numero: "03",
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
      "Valor fixo mensal ou composição de valor fixo com percentual sobre as vendas, considerando a dedicação adicional das transmissões.",
  },
];

const CONDICOES = [
  "Durante os primeiros dois meses, o foco será a implantação da estrutura e a ativação do novo canal de vendas.",
  "O TikTok Shop oferece incentivo de comissão de 0% por até 60 dias para novos vendedores elegíveis, mediante cumprimento das condições e missões de ativação da plataforma.",
  "Após esse período inicial, será definido um modelo de remuneração recorrente, considerando o volume de vendas, a complexidade da operação e o nível de serviço contratado.",
  "Os investimentos em anúncios (TikTok Ads), eventuais comissões de afiliados, assinaturas de sistemas e demais custos operacionais serão de responsabilidade da empresa.",
  "O atendimento ao consumidor, a gestão de devoluções e os procedimentos de expedição terão responsabilidades e fluxos definidos em conjunto, conforme o plano contratado.",
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

function Secao({
  n,
  rotulo,
  titulo,
  children,
}: {
  n: string;
  rotulo: string;
  titulo: string;
  children: React.ReactNode;
}) {
  const id = `s${n}`;
  return (
    <section className={styles.secao} aria-labelledby={id}>
      <div className={styles.lado}>
        <span className={styles.num}>{n}</span>
        <p className="rotulo">[ {rotulo} ]</p>
      </div>
      <div className={styles.corpo}>
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
    <div className={styles.pagina}>
      <header className={styles.topo}>
        <Link href="/" aria-label="Eduardo Barrocal, ir para o portfólio">
          <Logo className={styles.logo} />
        </Link>
        <p className="rotulo">[ Proposta comercial ]</p>
      </header>

      <main>
        <section className={styles.abertura} aria-labelledby="titulo">
          <p className={styles.para}>
            Para <strong>ALGS</strong>
          </p>
          <h1 id="titulo" className={styles.titulo}>
            Estruturação e Gestão de E&#8209;commerce
          </h1>
          <p className={styles.sub}>
            Implantação de TikTok Shop, Mercado Livre e Bling
          </p>

          <ol className={styles.canais} aria-label="Canais e sistema">
            <li>
              <span>Sistema central</span>
              <strong>Bling</strong>
            </li>
            <li>
              <span>Canal atual</span>
              <strong>Mercado Livre</strong>
            </li>
            <li>
              <span>Novo canal</span>
              <strong>TikTok Shop</strong>
            </li>
            <li>
              <span>Opcional</span>
              <strong>Loja própria</strong>
            </li>
          </ol>
        </section>

        <Secao n="01" rotulo="Objetivo" titulo="Objetivo do projeto">
          <p className={styles.texto}>
            Estruturar uma operação de vendas integrada entre Mercado Livre e
            TikTok Shop, centralizando o controle de produtos, estoque, pedidos
            e informações comerciais em um único sistema.
          </p>
          <p className={styles.texto}>
            O objetivo é ampliar os canais de venda da empresa sem comprometer a
            organização operacional já existente, preparando a estrutura para
            crescer com segurança e eficiência.
          </p>
        </Secao>

        <Secao
          n="02"
          rotulo="Etapa 1 · Meses 1 e 2"
          titulo="Implantação e estruturação"
        >
          <p className={styles.texto}>
            O projeto terá dois meses de implantação, divididos entre
            organização operacional, configuração das plataformas e início da
            operação comercial.
          </p>

          <div className={styles.duas}>
            <div className={styles.bloco}>
              <h3 className={styles.h3}>Organização e integração com Bling</h3>
              <p className={styles.nota}>
                Utilização do plano Titânio como sistema central de gestão.
              </p>
              <Lista itens={BLING} />
            </div>
            <div className={styles.bloco}>
              <h3 className={styles.h3}>Implantação do TikTok Shop</h3>
              <p className={styles.nota}>
                Loja nova, já ligada ao estoque centralizado.
              </p>
              <Lista itens={TIKTOK} />
            </div>
          </div>

          <aside className={styles.destaque}>
            <p className="rotulo">[ Diferencial ]</p>
            <h3 className={styles.h3}>Loja Virtual própria</h3>
            <p className={styles.texto}>
              O plano Titânio também permite utilizar a Loja Virtual nativa do
              Bling, possibilitando a criação de um e&#8209;commerce próprio, com
              catálogo de produtos, domínio personalizado, checkout e gestão
              integrada ao ERP.
            </p>
            <p className={styles.texto}>
              Isso abre a possibilidade de desenvolver um terceiro canal de
              vendas, independente dos marketplaces.
            </p>
            <p className={styles.nota}>
              A Loja Virtual possui contratação e condições comerciais próprias,
              com plano de entrada gratuito para até 50 pedidos mensais,
              conforme as regras da plataforma.
            </p>
          </aside>

          <div className={styles.investimento}>
            <h3 className={styles.h3}>Investimento da implantação</h3>
            <table className={styles.tabela}>
              <thead>
                <tr>
                  <th scope="col">Descrição</th>
                  <th scope="col">Investimento</th>
                </tr>
              </thead>
              <tbody>
                <tr className={styles.total}>
                  <th scope="row">
                    Implantação e estruturação de toda a operação
                  </th>
                  <td>R$ 1.500</td>
                </tr>
                <tr>
                  <th scope="row">Primeiro mês</th>
                  <td>R$ 750</td>
                </tr>
                <tr>
                  <th scope="row">Segundo mês</th>
                  <td>R$ 750</td>
                </tr>
              </tbody>
            </table>
            <p className={styles.nota}>
              Valor total de R$ 1.500, dividido em duas parcelas de R$ 750. O
              valor contempla a implantação do TikTok Shop e a organização e
              configuração do Bling para a operação dos canais de venda.
            </p>
            <p className={styles.nota}>
              A assinatura do Bling e eventuais serviços adicionais são pagos
              diretamente pela empresa.
            </p>
          </div>
        </Secao>

        <Secao
          n="03"
          rotulo="Etapa 2 · Mês 2"
          titulo="Ativação e início da operação"
        >
          <p className={styles.texto}>
            Durante o segundo mês, com a estrutura preparada, iniciaremos a
            operação comercial do TikTok Shop.
          </p>
          <Lista itens={ATIVACAO} />
          <p className={styles.texto}>
            O objetivo é validar a operação, identificar possíveis gargalos e
            preparar a loja para um crescimento sustentável.
          </p>
        </Secao>

        <Secao
          n="04"
          rotulo="Gestão recorrente"
          titulo="Modelos de contratação"
        >
          <p className={styles.texto}>
            Após a implantação, a continuidade do trabalho poderá ser
            contratada de acordo com o nível de participação desejado pela
            empresa.
          </p>
          <ol className={styles.planos}>
            {PLANOS.map((p) => (
              <li key={p.numero} className={styles.plano}>
                <p className="rotulo">[ Plano {p.numero} ]</p>
                <h3 className={styles.planoNome}>{p.nome}</h3>
                <p className={styles.planoResumo}>{p.resumo}</p>
                {p.inclui && <p className={styles.inclui}>{p.inclui}</p>}
                <Lista itens={p.itens} />
                <div className={styles.cobranca}>
                  <span>Modelo de cobrança</span>
                  <p>{p.cobranca}</p>
                </div>
              </li>
            ))}
          </ol>
        </Secao>

        <Secao n="05" rotulo="Condições" titulo="Condições comerciais">
          <ul className={styles.condicoes}>
            {CONDICOES.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </Secao>

        <Secao n="06" rotulo="Resultado" titulo="Resultado esperado">
          <p className={styles.texto}>
            Ao final da implantação, a empresa terá uma estrutura integrada
            entre Mercado Livre e TikTok Shop, com controle centralizado de
            estoque, produtos e pedidos.
          </p>
          <p className={styles.texto}>
            Também terá a possibilidade de utilizar uma loja virtual própria,
            ampliando sua independência em relação aos marketplaces.
          </p>
          <p className={styles.texto}>
            A partir dessa estrutura, será possível desenvolver novos canais de
            venda, explorar oportunidades comerciais e ampliar a presença
            digital da marca sem perder o controle da operação existente.
          </p>
        </Secao>

        <section className={styles.chamada} aria-labelledby="chamada">
          <h2 id="chamada" className={styles.chamadaTitulo}>
            Vamos tirar do papel?
          </h2>
          <p className={styles.texto}>
            Qualquer dúvida sobre a proposta, é só me chamar.
          </p>
          <a
            className="btnCreme"
            href={APROVAR}
            target="_blank"
            rel="noreferrer"
          >
            <WhatsAppIcone />
            Conversar no WhatsApp
          </a>
        </section>
      </main>

      <footer className={styles.rodape}>
        <span>Eduardo Barrocal</span>
        <Link href="/">Ver portfólio</Link>
      </footer>
    </div>
  );
}
