import { createGlobalStyle, css } from 'styled-components';
export const glassEffect = css`
  background-color: rgba(29, 38, 59, 0.6);
  background-image: linear-gradient(
    135deg, 
    rgba(255, 255, 255, 0.08) 0%, 
    rgba(255, 255, 255, 0) 60%
  );

  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
`;

const GlobalStyles = createGlobalStyle`
  :root {
    --dark-bg: #101727;
    --glass-bg: rgba(29, 38, 59, 0.6);
    --primary-cyan: #00E0FF;
    --primary-magenta: #E500FF;
    --text-primary: #F0F4F8;
    --text-secondary: #A0AEC0;
    --success-green: #48BB78;
    --error-red: #F56565;
    --border-color: rgba(255, 255, 255, 0.12);
    --header-height: 70px;
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: var(--dark-bg); 
    color: var(--text-primary);
    line-height: 1.6;
    overflow-x: hidden;
  }

  #root {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  button, a {
    transition: all 0.2s ease-in-out;
    text-shadow: 0 1px 3px rgba(0,0,0,0.2);
  }

  button {
    cursor: pointer;
    border: none;
    font-family: inherit;
  }

  input, select, textarea {
    font-family: inherit;
    background: rgba(0,0,0,0.2);
    color: var(--text-primary);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    padding: 0.75rem 1rem;
    transition: all 0.2s ease-in-out;

    &:focus {
      outline: none;
      border-color: var(--primary-cyan);
      box-shadow: 0 0 0 3px rgba(0, 224, 255, 0.3);
    }
  }

  a {
    color: var(--primary-cyan);
    text-decoration: none;
  }

  a:hover {
    color: #fff;
    text-decoration: none;
  }
`;

export default GlobalStyles;