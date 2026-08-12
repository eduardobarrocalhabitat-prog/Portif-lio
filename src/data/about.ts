/* ---------------------------------------------------------------------------
   Seção "Sobre mim".

   A narrativa se apoia em três pernas: identidade visual, UI/UX e soluções
   com IA. Elas aparecem nesta ordem em `services`, e a ordem importa — é a
   ordem em que a pessoa lê o que você faz.

   Sobre os termos:
   · "UI/UX" fica em inglês de propósito. É como o mercado brasileiro escreve
     e como as vagas descrevem — traduzir vira ruído no lugar de clareza.
   · "Soluções com IA", e não "em IA": "em IA" soa como quem pesquisa o campo,
     "com IA" é quem usa a ferramenta para resolver o problema de alguém. A
     segunda é a que vende trabalho.

   Conteúdo provisório — troque os textos e os links.
--------------------------------------------------------------------------- */

export const about = {
  kicker: "Sobre mim",
  title: "Eduardo Barrocal",
  lede: "Designer de interfaces e soluções com IA. Desenho o produto e construo o que faz ele funcionar, geralmente com um café esfriando do lado.",

  paragraphs: [
    "Comecei desenhando marcas e acabei descobrindo que o desenho só termina quando ele roda. Hoje trabalho as duas pontas: a identidade que dá o tom e a interface que entrega isso funcionando na mão do usuário.",
    "A IA entrou como ferramenta de trabalho e virou parte do que eu entrego. Não como enfeite: como a peça que automatiza o que era manual, responde o que antes esperava atendimento, e faz um produto pequeno dar conta de coisa grande.",
  ],

  /** Números que qualquer visita quer saber sem precisar perguntar. */
  facts: [
    { label: "Atuação", value: "Identidade, UI/UX e soluções com IA" },
    { label: "Ferramentas", value: "Figma, React, Next.js, LLMs" },
    { label: "Base", value: "Brasil · trabalho remoto" },
    { label: "Disponibilidade", value: "Aberto a projetos" },
  ],

  /**
   * A faixa entre a hero e o Sobre.
   *
   * Existe porque as pastas mostram *artefatos* — marca, conteúdo, site,
   * caso — e há serviço seu que não vira artefato nenhum: análise de métricas
   * e apresentação comercial não têm pasta e sumiriam da página inteira.
   * A faixa é o lugar de baixa hierarquia onde a amplitude cabe sem competir
   * com a hero.
   *
   * Mantenha curta. Passou de uma dúzia vira lista de palavra-chave, e aí ela
   * deixa de informar e passa a parecer que você faz de tudo.
   */
  marquee: [
    "Identidade visual",
    "Brand book",
    "Design de interface",
    "UI/UX",
    "Automação com IA",
    "Assistentes e integrações",
    "Post e reel",
    "Apresentação comercial",
    "Análise de métricas",
  ],

  /** As três frentes, na ordem em que se lê a narrativa. */
  services: [
    {
      title: "Identidade",
      body: "Naming, marca e o sistema que segura tudo isso depois que o logo fica pronto.",
    },
    {
      title: "UI/UX",
      body: "Design de interface e experiência: fluxo, protótipo e a tela que chega ao usuário.",
    },
    {
      title: "Soluções com IA",
      body: "Automações, assistentes e integrações que tiram trabalho repetitivo do caminho.",
    },
  ],

  /*
    O WhatsApp vem primeiro em todo lugar, e é ele que os botões de contato
    disparam: é onde ele responde. O resto fica como alternativa, não como
    escolha equivalente.

    `whatsapp.href` é só dígitos com o país na frente, que é o formato que o
    wa.me exige. `whatsapp.label` é o número como se lê, para a tela.
  */
  contact: {
    label: "Vamos conversar",
    body: "Aberto a projetos, colaborações e conversas sem compromisso. Costumo responder em até um dia útil.",
    whatsapp: {
      label: "+55 11 96184-8938",
      href: "https://wa.me/5511961848938",
      icon: "whatsapp",
    },
    /*
      `label` continua aqui mesmo com os botões virando ícones. Ele não some:
      vira o nome acessível do link e o texto do rodapé. Um botão de contato
      sem nome é um botão perdido para quem navega por leitor de tela ou
      teclado.
    */
    links: [
      {
        label: "eduardo.barrocal@hotmail.com",
        href: "mailto:eduardo.barrocal@hotmail.com",
        icon: "email",
      },
      {
        label: "LinkedIn",
        href: "https://www.linkedin.com/in/eduardo-barrocal",
        icon: "linkedin",
      },
      {
        label: "Behance",
        href: "https://www.behance.net/eduardobarrocal",
        icon: "behance",
      },
    ],
  },
} as const;
