import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  :root {
    --font-primary: 'Kanit', sans-serif;
    --font-secondary: 'Oswald', sans-serif;
    --font-accent: 'Teko', sans-serif;
  }

  body {
    font-family: var(--font-primary);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    line-height: 1.5;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-secondary);
    font-weight: 600;
    line-height: 1.2;
  }

  /* Font weight utility classes */
  .font-thin { font-weight: 100; }
  .font-extralight { font-weight: 200; }
  .font-light { font-weight: 300; }
  .font-regular { font-weight: 400; }
  .font-medium { font-weight: 500; }
  .font-semibold { font-weight: 600; }
  .font-bold { font-weight: 700; }
  .font-extrabold { font-weight: 800; }
  .font-black { font-weight: 900; }

  /* Font family utility classes */
  .font-kanit { font-family: var(--font-primary); }
  .font-oswald { font-family: var(--font-secondary); }
  .font-teko { font-family: var(--font-accent); }

  html {
    scroll-behavior: smooth;
  }
`;

export default GlobalStyles;
