// src/components/AuroraButton/AuroraButton.jsx
import React from 'react';
import styled from 'styled-components';

const StyledAuroraButton = styled.button`
  padding: 1rem 2.5rem;
  font-size: 1.2rem;
  font-family: var(--font-primary);
  font-weight: 500;
  color: white;
  background: linear-gradient(
    45deg,
    #FF0080,
    #7928CA,
    #FF69B4,
    #FF0080
  );
  background-size: 300% 300%;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  animation: aurora-bg 8s ease infinite;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(255, 0, 128, 0.3);
  }

  &::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    border-radius: 50px;
    background: inherit;
    filter: blur(8px);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover::before {
    opacity: 0.2;
  }

  @keyframes aurora-bg {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
`;

const AuroraButton = ({ children, onClick, className }) => {
  return (
    <StyledAuroraButton onClick={onClick} className={className}>
      {children}
    </StyledAuroraButton>
  );
};

export default AuroraButton;