import type { Metadata } from "next";
import Link from "next/link";

import { WhatsAppIcone } from "@/components/ml/WhatsApp";
import { whatsapp } from "@/data/margem";
import styles from "./algs.module.css";

/* ---------------------------------------------------------------------------
   Proposta comercial para a ALGS (brinquedos de controle remoto).

   Página solta do portfólio: não aparece no menu nem no Google (noindex), só
   abre para quem recebe o link. Formato de documento, uma coluna só: o que
   importa é ler rápido e sem dúvida.
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
    nome: "Plano 1 | Conteúdo",
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
    nome: "Plano 2 | Gestão de loja e crescimento",
    resumo: "Conteúdo aliado à gestão da operação comercial no TikTok Shop.",
    inclui: "Inclui tudo do Plano 1, mais:",
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
    nome: "Plano 3 | Gestão completa + Lives",
    resumo:
      "Uma operação completa de conteúdo, gestão comercial e vendas por transmissões ao vivo.",
    inclui: "Inclui tudo do Plano 2, mais:",
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

export default function PropostaALGS() {
  return (
    <div className={styles.pagina}>
      <header className={styles.topo}>
        <Link href="/">Eduardo Barrocal</Link>
        <span>Proposta comercial</span>
      </header>

      <main className={styles.doc}>
        <p className={styles.para}>Proposta para ALGS</p>
        <h1 className={styles.titulo}>
          Estruturação e Gestão de E&#8209;commerce
        </h1>
        <p className={styles.sub}>
          Implantação de TikTok Shop, Mercado Livre e Bling
        </p>

        {/* O essencial antes de qualquer detalhe. */}
        <dl className={styles.resumo}>
          <div>
            <dt>Prazo da implantação</dt>
            <dd>2 meses</dd>
          </div>
          <div>
            <dt>Investimento</dt>
            <dd>R$ 1.500</dd>
            <dd className={styles.resumoNota}>2 parcelas de R$ 750</dd>
          </div>
          <div>
            <dt>Pago pela empresa</dt>
            <dd className={styles.resumoNota}>
              Assinatura do Bling, TikTok Ads e custos operacionais
            </dd>
          </div>
        </dl>

        <section className={styles.secao}>
          <h2 className={styles.h2}>1. Objetivo do projeto</h2>
          <p>
            Estruturar uma operação de vendas integrada entre Mercado Livre e
            TikTok Shop, centralizando o controle de produtos, estoque, pedidos
            e informações comerciais em um único sistema.
          </p>
          <p>
            O objetivo é ampliar os canais de venda da empresa sem comprometer a
            organização operacional já existente, preparando a estrutura para
            crescer com segurança e eficiência.
          </p>
        </section>

        <section className={styles.secao}>
          <h2 className={styles.h2}>2. Etapa 1 | Implantação e estruturação</h2>
          <p className={styles.quando}>Primeiro e segundo mês</p>
          <p>
            O projeto terá dois meses de implantação, divididos entre
            organização operacional, configuração das plataformas e início da
            operação comercial.
          </p>

          <h3 className={styles.h3}>Organização e integração com Bling</h3>
          <p>Utilização do plano Titânio como sistema central de gestão.</p>
          <Lista itens={BLING} />

          <h3 className={styles.h3}>Implantação do TikTok Shop</h3>
          <Lista itens={TIKTOK} />

          <div className={styles.caixa}>
            <h3 className={styles.h3}>Diferencial: Loja Virtual própria</h3>
            <p>
              O plano Titânio também permite utilizar a Loja Virtual nativa do
              Bling, possibilitando a criação de um e&#8209;commerce próprio,
              com catálogo de produtos, domínio personalizado, checkout e gestão
              integrada ao ERP.
            </p>
            <p>
              Isso abre a possibilidade de desenvolver um terceiro canal de
              vendas, independente dos marketplaces.
            </p>
            <p className={styles.nota}>
              A Loja Virtual possui contratação e condições comerciais próprias,
              com plano de entrada gratuito para até 50 pedidos mensais,
              conforme as regras da plataforma.
            </p>
          </div>

          <h3 className={styles.h3}>Investimento da implantação</h3>
          <table className={styles.tabela}>
            <tbody>
              <tr>
                <th scope="row">Primeiro mês</th>
                <td>R$ 750</td>
              </tr>
              <tr>
                <th scope="row">Segundo mês</th>
                <td>R$ 750</td>
              </tr>
              <tr className={styles.total}>
                <th scope="row">
                  Total: implantação e estruturação de toda a operação
                </th>
                <td>R$ 1.500</td>
              </tr>
            </tbody>
          </table>
          <p>
            O valor contempla a implantação do TikTok Shop e a organização e
            configuração do Bling para a operação dos canais de venda.
          </p>
          <p>
            A assinatura do Bling e eventuais serviços adicionais são pagos
            diretamente pela empresa.
          </p>
        </section>

        <section className={styles.secao}>
          <h2 className={styles.h2}>
            3. Etapa 2 | Ativação e início da operação
          </h2>
          <p className={styles.quando}>Segundo mês</p>
          <p>
            Durante o segundo mês, com a estrutura preparada, iniciaremos a
            operação comercial do TikTok Shop.
          </p>
          <Lista itens={ATIVACAO} />
          <p>
            O objetivo é validar a operação, identificar possíveis gargalos e
            preparar a loja para um crescimento sustentável.
          </p>
        </section>

        <section className={styles.secao}>
          <h2 className={styles.h2}>
            4. Gestão recorrente | Modelos de contratação
          </h2>
          <p>
            Após a implantação, a continuidade do trabalho poderá ser
            contratada de acordo com o nível de participação desejado pela
            empresa.
          </p>
          {PLANOS.map((p) => (
            <div key={p.nome} className={styles.plano}>
              <h3 className={styles.h3}>{p.nome}</h3>
              <p>{p.resumo}</p>
              {p.inclui && <p className={styles.inclui}>{p.inclui}</p>}
              <Lista itens={p.itens} />
              <p className={styles.cobranca}>
                <strong>Modelo de cobrança:</strong> {p.cobranca}
              </p>
            </div>
          ))}
        </section>

        <section className={styles.secao}>
          <h2 className={styles.h2}>5. Condições comerciais</h2>
          <Lista itens={CONDICOES} />
        </section>

        <section className={styles.secao}>
          <h2 className={styles.h2}>6. Resultado esperado</h2>
          <p>
            Ao final da implantação, a empresa terá uma estrutura integrada
            entre Mercado Livre e TikTok Shop, com controle centralizado de
            estoque, produtos e pedidos.
          </p>
          <p>
            Também terá a possibilidade de utilizar uma loja virtual própria,
            ampliando sua independência em relação aos marketplaces.
          </p>
          <p>
            A partir dessa estrutura, será possível desenvolver novos canais de
            venda, explorar oportunidades comerciais e ampliar a presença
            digital da marca sem perder o controle da operação existente.
          </p>
        </section>

        <section className={styles.fim}>
          <p>Ficou alguma dúvida? É só me chamar.</p>
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
    </div>
  );
}
