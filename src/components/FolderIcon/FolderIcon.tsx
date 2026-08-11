/* ---------------------------------------------------------------------------
   Glifos das pastas.
   Traço fino, viewBox 48×48 comum, para a massa óptica bater entre eles.
   Aparecem pequenos na etiqueta da pasta e grandes como marca d'água no painel.
--------------------------------------------------------------------------- */

export type IconName = "tag" | "image" | "globe" | "spark";

const paths: Record<IconName, React.ReactNode> = {
  tag: (
    <>
      <path d="M27.4 6.5H40a1.5 1.5 0 0 1 1.5 1.5v12.6a3 3 0 0 1-.9 2.1L23.7 39.6a3 3 0 0 1-4.2 0L8.4 28.5a3 3 0 0 1 0-4.2L25.3 7.4a3 3 0 0 1 2.1-.9Z" />
      <circle cx="33.9" cy="14.1" r="2.6" />
    </>
  ),
  image: (
    <>
      <rect x="6" y="9" width="36" height="30" rx="4.2" />
      <circle cx="17.2" cy="19.4" r="3.2" />
      <path d="M7.8 33.8l9.6-10.2 6.2 6.9 5-5.3 11.4 11.6" />
    </>
  ),
  globe: (
    <>
      <circle cx="24" cy="24" r="17" />
      <path d="M24 7c4.6 4.7 6.9 10.4 6.9 17S28.6 36.3 24 41c-4.6-4.7-6.9-10.4-6.9-17S19.4 11.7 24 7Z" />
      <path d="M8.4 18.6h31.2M8.4 29.4h31.2" />
    </>
  ),
  /*
    Faísca, e não robô ou cérebro: os dois viraram clichê e datam a página.
    A faísca lê como "algo acontece aqui" sem prometer ficção científica.
  */
  spark: (
    <>
      <path d="M20 7.5c0 6.9 5.6 12.5 12.5 12.5C25.6 20 20 25.6 20 32.5 20 25.6 14.4 20 7.5 20 14.4 20 20 14.4 20 7.5Z" />
      <path d="M34.5 27c0 3.6 2.9 6.5 6.5 6.5-3.6 0-6.5 2.9-6.5 6.5 0-3.6-2.9-6.5-6.5-6.5 3.6 0 6.5-2.9 6.5-6.5Z" />
    </>
  ),
};

type Props = {
  name: IconName;
  className?: string;
};

export function FolderIcon({ name, className }: Props) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {paths[name]}
    </svg>
  );
}
