import React from 'react';
import styled, { keyframes } from 'styled-components';

const move = keyframes`
  from {
    transform: translate(-10vw, -10vh) rotate(0deg);
  }
  to {
    transform: translate(60vw, 70vh) rotate(360deg);
  }
`;

const BackgroundWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  overflow: hidden;
  background-color: var(--dark-bg);
  
  &::before,
  &::after {
    content: '';
    position: absolute;
    border-radius: 50%;
    will-change: transform;
    pointer-events: none;
    opacity: 0.15;
  }

  &::before {
    width: 120vmax;
    height: 120vmax;
    top: 50%;
    left: 50%;
    margin: -60vmax;
    background: radial-gradient(circle, var(--primary-cyan) 0%, transparent 40%);
    animation: ${move} 30s alternate infinite ease-in-out;
  }
  
  &::after {
    width: 80vmax;
    height: 80vmax;
    top: 50%;
    left: 50%;
    margin: -40vmax;
    background: radial-gradient(circle, var(--primary-magenta) 0%, transparent 40%);

    animation: ${move} 25s alternate-reverse infinite ease-in-out;
    animation-delay: -5s;
  }
`;

const AnimatedBackground: React.FC = () => {
    return <BackgroundWrapper />;
};

export default AnimatedBackground;