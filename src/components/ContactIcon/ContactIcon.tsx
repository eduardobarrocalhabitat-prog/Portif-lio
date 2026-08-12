/**
 * As marcas dos canais de contato, em SVG inline.
 *
 * Inline e não arquivo: são quatro glifos pequenos, e cada um como arquivo
 * seria uma requisição a mais para desenhar algo que cabe em duas linhas. Como
 * herdam `currentColor`, eles acompanham a cor do botão sem nenhuma regra
 * extra, inclusive no hover.
 *
 * Todos vêm com `aria-hidden`: quem dá nome ao link é o `aria-label` do
 * elemento em volta. Um ícone sozinho não diz nada a quem não enxerga, e
 * botão de contato sem nome é botão perdido.
 */

export type ContactIconName = "whatsapp" | "email" | "linkedin" | "behance";

const CAMINHOS: Record<ContactIconName, React.ReactNode> = {
  /* Balão com o fone, que é como o WhatsApp se apresenta em qualquer lugar. */
  whatsapp: (
    <path
      fill="currentColor"
      d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.86 9.86 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 1.67c2.2 0 4.27.86 5.83 2.42a8.2 8.2 0 0 1 2.41 5.82c0 4.54-3.7 8.24-8.25 8.24a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24Zm-3.2 4.3c-.15 0-.4.06-.6.28-.21.22-.8.78-.8 1.9s.82 2.2.93 2.36c.12.15 1.6 2.44 3.88 3.42.54.24.96.38 1.29.48.54.17 1.04.15 1.43.09.43-.06 1.34-.55 1.53-1.08.19-.53.19-.98.13-1.08-.06-.09-.21-.15-.43-.26-.23-.11-1.35-.66-1.55-.74-.21-.08-.36-.11-.51.11-.15.23-.58.74-.72.89-.13.15-.26.17-.49.06-.22-.12-.95-.35-1.81-1.12a6.8 6.8 0 0 1-1.26-1.55c-.13-.23-.01-.35.1-.46.1-.1.23-.26.34-.4.11-.13.15-.22.22-.37.08-.15.04-.28-.02-.4-.06-.11-.5-1.24-.7-1.69-.18-.44-.37-.38-.5-.39h-.44Z"
    />
  ),

  /* Envelope aberto: a linha do V é o que faz ler como carta e não como caixa. */
  email: (
    <>
      <rect x="2.6" y="4.8" width="18.8" height="14.4" rx="2.4" />
      <path d="M3.4 7.2 12 13.1l8.6-5.9" />
    </>
  ),

  linkedin: (
    <path
      fill="currentColor"
      d="M4.98 3.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5ZM3 9.25h3.96V21H3V9.25Zm6.44 0h3.8v1.6h.05c.53-.95 1.82-1.95 3.75-1.95 4 0 4.74 2.5 4.74 5.76V21h-3.96v-5.55c0-1.32-.03-3.03-1.9-3.03-1.9 0-2.19 1.44-2.19 2.93V21H9.44V9.25Z"
    />
  ),

  /* O "Bē" do Behance: o traço em cima do e é o que o distingue de um B solto. */
  behance: (
    <path
      fill="currentColor"
      d="M8.02 5.2c.86 0 1.6.08 2.29.23.68.15 1.26.4 1.74.72.48.33.85.77 1.11 1.31.26.55.39 1.22.39 2 0 .85-.2 1.56-.59 2.13-.38.56-.95 1.03-1.7 1.39 1.03.29 1.79.81 2.3 1.55.5.74.75 1.63.75 2.68 0 .84-.16 1.57-.49 2.19a4.1 4.1 0 0 1-1.32 1.5c-.55.4-1.19.68-1.91.87-.71.18-1.45.27-2.21.27H1V5.2h7.02Zm-.41 6.24c.7 0 1.29-.17 1.74-.5.46-.34.68-.88.68-1.63 0-.42-.07-.76-.22-1.03a1.63 1.63 0 0 0-.6-.62 2.5 2.5 0 0 0-.87-.31 5.9 5.9 0 0 0-1.02-.09H4.32v4.18h3.29Zm.18 6.55c.39 0 .76-.04 1.11-.11.36-.08.67-.2.94-.38.27-.18.49-.42.65-.73.16-.31.24-.71.24-1.19 0-.94-.27-1.61-.79-2.01-.53-.4-1.23-.6-2.1-.6H4.32v5.02h3.47Zm9.63-.13c.45.43 1.09.65 1.93.65.6 0 1.12-.15 1.56-.46.43-.3.7-.62.79-.96h2.62c-.42 1.31-1.06 2.24-1.93 2.8-.86.56-1.91.85-3.14.85-.85 0-1.62-.14-2.3-.41a4.8 4.8 0 0 1-1.75-1.18 5.2 5.2 0 0 1-1.1-1.83 6.7 6.7 0 0 1-.39-2.33c0-.82.13-1.58.4-2.29a5.3 5.3 0 0 1 1.14-1.83 5.3 5.3 0 0 1 1.76-1.21 5.7 5.7 0 0 1 2.24-.44c.92 0 1.73.18 2.42.54.69.36 1.25.84 1.69 1.44.44.6.75 1.29.95 2.06.19.77.26 1.58.2 2.42h-7.81c0 .87.29 1.68.74 2.11l-.02.07Zm3.4-5.72c-.36-.39-.98-.6-1.72-.6-.49 0-.89.08-1.21.25-.32.17-.58.37-.78.62-.19.24-.33.5-.4.78-.8.27-.13.51-.14.72h4.83c-.14-.76-.36-1.28-.72-1.67l.14-.1ZM17.1 6.14h4.9v1.42h-4.9V6.14Z"
    />
  ),
};

export function ContactIcon({ name }: { name: ContactIconName }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      /*
        `fill: none` e traço aqui na raiz: o envelope é desenhado com linha e
        herda tudo isto. As marcas cheias declaram o próprio `fill` no path e
        ignoram estas duas.
      */
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {CAMINHOS[name]}
    </svg>
  );
}
