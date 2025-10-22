import React, { useState, useEffect } from 'react';
import styled, { ThemeProvider } from 'styled-components';  // styled-components 是核心
import { Button, message } from 'antd';
import { UploadOutlined, FileTextOutlined } from '@ant-design/icons'; 
import { useTheme } from '../providers/ThemeProvider';
import  type { CustomTheme } from '../styles/GlobalStyles'; // 定义的主题
import { FileUpload } from '../components/FileUpload';
//import { TextInput } from '../components/TextInput';
import { SceneList } from '../components/SceneList';
import { Loading } from '../components/Loading';
import { uploadFile, submitText, extractScenes, getScenes } from '../services/api';
//import TextSubmissionRequest from '../services/api';
import type { TextSubmissionRequest } from '../types';  // 导入 TextSubmissionRequest 类型

import type { Novel, Scene } from '../types';


const HomeContainer = styled.div<{ theme: CustomTheme }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;


const HomeHeader = styled.div<{ theme: CustomTheme }>`
  text-align: center;
  margin-bottom: 2rem;
`;

const HomeTitle = styled.h1`
  font-size: ${({ theme }: { theme: CustomTheme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }: { theme: CustomTheme }) => theme.fontWeights.medium};
  color: ${({ theme }: { theme: CustomTheme }) => theme.colors.textPrimary};
  margin-bottom: 0.5rem;
`;

const HomeSubtitle = styled.p`
  font-size: ${({ theme }: { theme: CustomTheme }) => theme.fontSizes.md};
  color: ${({ theme }: { theme: CustomTheme }) => theme.colors.textSecondary};
  margin: 0;
`;

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.colors.danger};
  font-size: ${({ theme }) => theme.fontSizes.md};
  text-align: center;
  padding: 1rem;
`;

const ScenesSection = styled.div`
  margin-top: 2rem;
`;

const HomeContent = styled.div<{ theme: CustomTheme }>`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;



// 确保可以正确使用 Ant Design 和 styled-components 配合
const InputSection = styled.div<{ theme: CustomTheme }>`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InputTabs = styled.div`
  display: flex;
  border-bottom: 1px solid ${({ theme }: { theme: CustomTheme }) => theme.colors.border};
  margin-bottom: 1rem;
`;

const InputTab = styled.button<{ active: boolean }>`
  background: none;
  border: none;
  padding: 0.75rem 1.5rem;
  font-size: ${({ theme }: { theme: CustomTheme }) => theme.fontSizes.md};
  color: ${({ active, theme }: { active: boolean; theme: CustomTheme }) => active ? theme.colors.primary : theme.colors.textSecondary};
  border-bottom: 2px solid ${({ active, theme }: { active: boolean; theme: CustomTheme }) => active ? theme.colors.primary : 'transparent'};
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    color: ${({ theme }: { theme: CustomTheme }) => theme.colors.primary};
  }
`;

const ActionButton = styled(Button)`
  min-width: 120px;
  height: 40px;
  border-radius: ${({ theme }: { theme: CustomTheme }) => theme.borderRadius.md};
  font-weight: ${({ theme }: { theme: CustomTheme }) => theme.fontWeights.medium};
`;

const HomePage: React.FC = () => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<'file' | 'text'>('file');
  const [files, setFiles] = useState<File[]>([]);
  const [text, setText] = useState('');
  const [currentNovel, setCurrentNovel] = useState<Novel | null>(null);
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [showProgress, setShowProgress] = useState(false);

  const handleFileChange = (newFiles: File[]) => {
    setFiles(newFiles);
    setError(null);
  };

  const handleTextChange = (newText: string) => {
    setText(newText);
    setError(null);
  };

  const handleFileUpload = async () => {
    if (files.length === 0) {
      message.error('请选择要上传的文件');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const file = files[0];
      const response = await uploadFile(file);
      
      if (response.success && response.data?.novel) {
        setCurrentNovel(response.data.novel);
        message.success('文件上传成功');
        
        // 自动提取场景
        
        await extractScenes({novel_id: response.data.novel.id});
      } else {
        setError(response.message || '文件上传失败');
        message.error('文件上传失败');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '文件上传失败';
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleTextSubmit = async () => {
    if (!text.trim()) {
      message.error('请输入小说文本');
      return;
    }

    setLoading(true);
    setError(null);
    setProgress(0);
    setShowProgress(true);

    try {
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 300);

      const requestData: TextSubmissionRequest = {
        title: 'My Novel', // 假设标题是固定的，或者你可以提供动态输入
        text
      };

      const response = await submitText(requestData);
      
      clearInterval(progressInterval);
      setProgress(100);
      
      if (response.success && response.data) {
        setCurrentNovel(response.data.novel);
        message.success('文本提交成功');
        
        // 自动提取场景
        await extractScenes({ novel_id: response.data.novel.id });
      } else {
        setError(response.message || '文本提交失败');
        message.error('文本提交失败');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '文本提交失败';
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setTimeout(() => {
        setShowProgress(false);
        setProgress(0);
      }, 1000);
      setLoading(false);
    }
  };

  return (
    <HomeContainer theme={theme}>
      {/* 添加处理进度 */}
      {loading && <Loading text="处理中..." />}
      
      <HomeHeader theme={theme}>
        <HomeTitle theme={theme}>小说生成漫画</HomeTitle>
        <HomeSubtitle theme={theme}>上传小说文件或输入文本，自动提取场景并生成漫画</HomeSubtitle>
      </HomeHeader>
      
      {/* 添加上传和提交 */}
      <HomeContent>
        {/* 文件或文本上传选项 */}
        <InputSection>
          {/* 标签和功能按钮 */}
        </InputSection>
        {/* 错误处理 */}
        {error && <ErrorMessage theme={theme}>{error}</ErrorMessage>}
        {/* 场景显示区域 */}
        <ScenesSection>
          <SceneList
            scenes={scenes}
            loading={loading}
          />
        </ScenesSection>
      </HomeContent>
    </HomeContainer>
  );
};

export default HomePage;
