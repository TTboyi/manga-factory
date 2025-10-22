import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Spin } from 'antd';
import { useTheme } from '../../providers/ThemeProvider';

interface LoadingProps {
  text?: string;
  description?: string;
  size?: 'small' | 'default' | 'large';
  overlay?: boolean;
}

const LoadingContainer = styled.div<{ overlay?: boolean; size?: 'small' | 'default' | 'large' }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ overlay, size }) => overlay ? '2rem' : size === 'small' ? '1rem' : size === 'large' ? '3rem' : '2rem'};
  background-color: ${({ overlay, theme }) => overlay ? theme.colors.overlay : 'transparent'};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  width: 100%;
  height: ${({ overlay }) => overlay ? '100%' : 'auto'};
  position: ${({ overlay }) => overlay ? 'absolute' : 'relative'};
  top: 0;
  left: 0;
  z-index: ${({ overlay }) => overlay ? 1000 : 1};
`;

const LoadingText = styled.div<{ size?: 'small' | 'default' | 'large' }>`
  margin-top: ${({ size }) => size === 'small' ? '0.5rem' : size === 'large' ? '1.5rem' : '1rem'};
  font-size: ${({ size, theme }) => size === 'small' ? theme.fontSizes.small : size === 'large' ? theme.fontSizes.large : theme.fontSizes.medium};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.textPrimary};
  text-align: center;
`;

const LoadingDescription = styled.div`
  margin-top: 0.5rem;
  font-size: ${({ theme }) => theme.fontSizes.small};
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: center;
  max-width: 300px;
`;

const Loading: React.FC<LoadingProps> = ({ 
  text = '加载中...', 
  description, 
  size = 'default', 
  overlay = false 
}) => {
  const { theme } = useTheme();
  
  return (
    <LoadingContainer overlay={overlay} size={size}>
      <Spin size={size === 'small' ? 'small' : size === 'large' ? 'large' : 'default'} />
      {text && <LoadingText size={size}>{text}</LoadingText>}
      {description && <LoadingDescription>{description}</LoadingDescription>}
    </LoadingContainer>
  );
};

export default Loading;