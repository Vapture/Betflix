import React from 'react';
import styled, { css } from 'styled-components';

const GlowWrapper = styled.div`
  position: absolute;
  inset: 0;
  border-radius: inherit;
  overflow: hidden; 
  pointer-events: none;
  z-index: 10; 
`;

const ShineElement = styled.span<{ $hue: string; $conic?: string; $isBottom?: boolean }>`
  pointer-events: none;
  border-radius: 0;
  border-top-right-radius: inherit;
  border-bottom-left-radius: inherit;
  border: var(--neon-border-width) solid transparent;
  width: 75%;
  height: auto;
  aspect-ratio: 1;
  display: block;
  position: absolute;
  right: calc(var(--neon-border-width) * -1);
  top: calc(var(--neon-border-width) * -1);
  left: auto;
  z-index: 1;

  --start: 12%;
  background: conic-gradient(
      from ${props => props.$conic || '-45deg'} at center in oklch,
      transparent var(--start,0%), hsl(${props => props.$hue} 90% 75%), transparent var(--end,50%) 
  ) border-box;
  
  mask: 
      linear-gradient(transparent), 
      linear-gradient(black);
  mask-repeat: no-repeat;
  mask-clip: padding-box, border-box;
  mask-composite: subtract;

  animation: neon-glow 2s var(--neon-ease) both;
  animation-delay: 0s;

  &::before,
  &::after {
      content: "";
      width: auto;
      inset: -2px;
      mask: none;
      position: absolute;
      border: inherit;
      border-radius: inherit;
  }
      
  &::after { 
      z-index: 2;
      --start: 17%;
      --end: 33%;
      background: conic-gradient(
          from ${props => props.$conic || '-45deg'} at center in oklch,
          transparent var(--start,0%), hsl(${props => props.$hue} 90% 90%), transparent var(--end,50%) 
      );
  }

  ${props => props.$isBottom && css`
    top: auto;
    bottom: calc(var(--neon-border-width) * -1);
    left: calc(var(--neon-border-width) * -1);
    right: auto;
    animation-delay: 0.1s;
    animation-duration: 1.8s;
  `}
`;

const GlowElement = styled.span<{ $hue: string; $conic?: string; $isBottom?: boolean; $isBright?: boolean }>`
  pointer-events: none;
  border-top-right-radius: calc(var(--neon-radius) * 2.5);
  border-bottom-left-radius: calc(var(--neon-radius) * 2.5);
  border: calc(var(--neon-radius) * 1.5) solid transparent
  inset: calc(var(--neon-radius) * -2.5);
  width: 75%;
  height: auto;
  aspect-ratio: 1;
  display: block;
  position: absolute;
  left: auto;
  bottom: auto;
  opacity: 1;
  filter: blur(16px) saturate(1.5) brightness(0.7);
  mix-blend-mode: plus-lighter;
  z-index: 3;

  mask: url('https://assets.codepen.io/13471/noise-base.png'); 
  mask-mode: luminance;
  mask-size: 29%;

  animation: neon-glow 1s var(--neon-ease) both; 
  animation-delay: 0.2s;

  &.glow-bottom { 
    inset: calc(var(--neon-radius) * -2.5);
    top: auto;
    right: auto;
    animation-delay: 0.3s;
  }
  
  &::before, 
  &::after {
      content: "";
      position: absolute;
      inset: 0;
      border: inherit;
      border-radius: inherit;
      background: conic-gradient(
          from ${props => props.$conic || '-45deg'} at center in oklch,
          transparent var(--start,0%), hsl(${props => props.$hue} 95% 70%), transparent var(--end,50%) 
      ) border-box;  More vibrant glow */
      mask: 
          linear-gradient(transparent), 
          linear-gradient(black);
      mask-repeat: no-repeat;
      mask-clip: padding-box, border-box;
      mask-composite: subtract;
      filter: saturate(2.5) brightness(1.2);
  }
  
  &::after {
      --lit: 80%;
      --sat: 100%;
      --start: 15%;
      --end: 35%;
      border-width: calc(var(--neon-radius) * 1.75);
      border-radius: calc(var(--neon-radius) * 2.75);
      inset: calc(var(--neon-radius) * -0.25);
      z-index: 4;
      opacity: 0.85;
  }

  ${props => props.$isBottom && css`
    inset: calc(var(--neon-radius) * -2.5);
    top: auto;
    right: auto;
    animation-delay: 0.3s;
  `}

  ${props => props.$isBright && css`
    --lit: 90%;
    --sat: 100%;
    --start: 13%;
    --end: 37%;
    border-width: 6px;
    border-radius: calc(var(--neon-radius) + 4px);
    inset: -9px;
    left: auto;
    filter: blur(3px) brightness(0.8);
    animation-duration: 1.5s;
    animation-delay: 0.1s;

    &::after {
        content: none;
    }

    ${props.$isBottom && css`
      inset: -9px;
      right: auto;
      top: auto;
      animation-duration: 1.1s;
      animation-delay: 0.3s;
    `}
  `}
`;

const CardGlowEffect: React.FC = () => {
  return (
    <GlowWrapper>
      <ShineElement $hue="var(--neon-hue1)" />
      <ShineElement $hue="var(--neon-hue2)" $conic="135deg" $isBottom />

      <GlowElement $hue="var(--neon-hue1)" />
      <GlowElement $hue="var(--neon-hue2)" $conic="135deg" $isBottom />

      <GlowElement $hue="var(--neon-hue1)" $isBright />
      <GlowElement $hue="var(--neon-hue2)" $conic="135deg" $isBright $isBottom />
    </GlowWrapper>
  );
};

export default CardGlowEffect;