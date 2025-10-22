import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { EditOutlined, ClearOutlined } from '@ant-design/icons';
import { useTheme } from '../../providers/ThemeProvider';

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const TextHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const TextTitle = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const TextActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const TextAction = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.textSecondary};
  cursor: pointer;
  padding: 0.25rem;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    background-color: ${({ theme }) => theme.colors.backgroundLight};
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  min-height: 300px;
  padding: 1rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.textPrimary};
  background-color: ${({ theme }) => theme.colors.background};
  resize: vertical;
  transition: border-color 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary}20;
  }
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.textDisabled};
  }
`;

const TextFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
`;

const TextCount = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const TextHint = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.colors.danger};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  margin-top: 0.5rem;
`;

const ProgressContainer = styled.div`
  margin-top: 1rem;
  width: 100%;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background-color: ${({ theme }) => theme.colors.backgroundLight};
  border-radius: 2px;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ progress: number }>`
  height: 100%;
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: 2px;
  width: ${props => props.progress}%;
  transition: width 0.3s ease;
`;

const ProgressText = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-top: 4px;
  text-align: right;
`;

interface TextInputProps {
  value?: string;
  placeholder?: string;
  maxLength?: number;
  disabled?: boolean;
  onChange?: (value: string) => void;
  onSubmit?: () => void;
  error?: string;
  hint?: string;
  showClear?: boolean;
  showWordCount?: boolean;
  autoResize?: boolean;
  showProgress?: boolean;
  progress?: number;
}

const TextInput: React.FC<TextInputProps> = ({
  value = '',
  placeholder = '请输入小说文本...',
  maxLength = 10000,
  disabled = false,
  onChange,
  onSubmit,
  error,
  hint = '请输入您想要转换为漫画的小说内容，系统将自动分析并提取关键场景。',
  showClear = true,
  showWordCount = true,
  autoResize = true,
  showProgress = false,
  progress = 0
}) => {
  const { theme } = useTheme();
  const [text, setText] = useState(value);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setText(value);
  }, [value]);

  useEffect(() => {
    if (autoResize && textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [text, autoResize]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (maxLength && newValue.length > maxLength) {
      return;
    }
    setText(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  const handleClear = () => {
    setText('');
    if (onChange) {
      onChange('');
    }
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && e.ctrlKey && onSubmit) {
      onSubmit();
    }
  };

  const remainingChars = maxLength ? maxLength - text.length : 0;
  const isOverLimit = remainingChars < 0;

  return (
    <TextContainer>
      <TextHeader>
        <TextTitle theme={theme}>小说文本输入</TextTitle>
        <TextActions>
          {showClear && text && (
            <TextAction onClick={handleClear} disabled={disabled} theme={theme}>
              <ClearOutlined />
            </TextAction>
          )}
        </TextActions>
      </TextHeader>
      
      <Textarea
        ref={textareaRef}
        value={text}
        placeholder={placeholder}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        theme={theme}
      />
      
      <TextFooter>
        <TextHint theme={theme}>{hint}</TextHint>
        {showWordCount && maxLength && (
          <TextCount theme={theme} style={{ color: isOverLimit ? theme.colors.danger : theme.colors.textSecondary }}>
            {text.length}/{maxLength}
          </TextCount>
        )}
      </TextFooter>
      
      {error && <ErrorMessage theme={theme}>{error}</ErrorMessage>}
      
      {showProgress && (
        <ProgressContainer>
          <ProgressBar>
            <ProgressFill progress={Math.min(100, Math.max(0, progress))} />
          </ProgressBar>
          <ProgressText>{Math.min(100, Math.max(0, progress))}%</ProgressText>
        </ProgressContainer>
      )}
    </TextContainer>
  );
};

export default TextInput;