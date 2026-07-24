// Allow the <iconify-icon> web component in JSX
declare namespace JSX {
  interface IntrinsicElements {
    "iconify-icon": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      icon?: string;
    };
  }
}
