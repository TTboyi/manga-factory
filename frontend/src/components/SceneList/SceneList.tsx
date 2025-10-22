import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { EyeOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useTheme } from '../../providers/ThemeProvider';
import { Loading } from '../Loading';
import  type { Scene } from '../../types';

const SceneContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const SceneHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const SceneTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0;
`;

const SceneActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const SceneAction = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.backgroundLight};
  }
  
  &:disabled {
    color: ${({ theme }) => theme.colors.textDisabled};
    cursor: not-allowed;
  }
`;

const SceneListContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
  width: 100%;
`;

const SceneCard = styled.div`
  background-color: ${({ theme }) => theme.colors.backgroundLight};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
`;

const SceneCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
`;

const SceneCardTitle = styled.h4`
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const SceneCardActions = styled.div`
  display: flex;
  gap: 0.25rem;
`;

const SceneCardAction = styled.button`
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
    background-color: ${({ theme }) => theme.colors.background};
  }
`;

const SceneCardDescription = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0 0 0.75rem 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const SceneCardMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
`;

const SceneTag = styled.span`
  background-color: ${({ theme }) => theme.colors.primary}20;
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  padding: 0.25rem 0.5rem;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
`;

const SceneCardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SceneCardImage = styled.div`
  width: 60px;
  height: 60px;
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const SceneCardIndex = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  text-align: center;
`;

const EmptyIcon = styled.div`
  font-size: 3rem;
  color: ${({ theme }) => theme.colors.textDisabled};
  margin-bottom: 1rem;
`;

const EmptyText = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 1.5rem;
`;

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.colors.danger};
  font-size: ${({ theme }) => theme.fontSizes.md};
  text-align: center;
  padding: 1rem;
`;

interface SceneListProps {
  scenes?: Scene[];
  loading?: boolean;
  error?: string;
  onSceneClick?: (scene: Scene) => void;
  onSceneEdit?: (scene: Scene) => void;
  onSceneDelete?: (sceneId: number) => void;
  onSceneAdd?: () => void;
  showAddButton?: boolean;
  showActions?: boolean;
}

const SceneList: React.FC<SceneListProps> = ({
  scenes = [],
  loading = false,
  error,
  onSceneClick,
  onSceneEdit,
  onSceneDelete,
  onSceneAdd,
  showAddButton = false,
  showActions = true
}) => {
  const { theme } = useTheme();

  if (loading) {
    return (
      <SceneContainer>
        <Loading text="加载场景中..." overlay={false} size="default" />
      </SceneContainer>
    );
  }

  if (error) {
    return (
      <SceneContainer>
        <ErrorMessage theme={theme}>{error}</ErrorMessage>
      </SceneContainer>
    );
  }

  if (scenes.length === 0) {
    return (
      <SceneContainer>
        <EmptyState>
          <EmptyIcon theme={theme}>📝</EmptyIcon>
          <EmptyText theme={theme}>暂无场景，请先上传小说或输入文本</EmptyText>
          {showAddButton && (
            <SceneAction onClick={onSceneAdd} theme={theme}>
              <PlusOutlined /> 添加场景
            </SceneAction>
          )}
        </EmptyState>
      </SceneContainer>
    );
  }

  return (
    <SceneContainer>
      <SceneHeader>
        <SceneTitle theme={theme}>场景列表 ({scenes.length})</SceneTitle>
        {showAddButton && (
          <SceneActions>
            <SceneAction onClick={onSceneAdd} theme={theme}>
              <PlusOutlined /> 添加场景
            </SceneAction>
          </SceneActions>
        )}
      </SceneHeader>
      
      <SceneListContainer>
        {scenes.map((scene, index) => (
          <SceneCard
            key={scene.id}
            theme={theme}
            onClick={() => onSceneClick && onSceneClick(scene)}
          >
            <SceneCardHeader>
              <SceneCardTitle theme={theme}>{scene.title}</SceneCardTitle>
              {showActions && (
                <SceneCardActions>
                  <SceneCardAction
                    onClick={(e) => {
                      e.stopPropagation();
                      onSceneEdit && onSceneEdit(scene);
                    }}
                    theme={theme}
                  >
                    <EditOutlined />
                  </SceneCardAction>
                  <SceneCardAction
                    onClick={(e) => {
                      e.stopPropagation();
                      onSceneDelete && onSceneDelete(scene.id);
                    }}
                    theme={theme}
                  >
                    <DeleteOutlined />
                  </SceneCardAction>
                </SceneCardActions>
              )}
            </SceneCardHeader>
            
            <SceneCardDescription theme={theme}>
              {scene.description}
            </SceneCardDescription>
            
            <SceneCardMeta>
              <SceneTag theme={theme}>{scene.type}</SceneTag>
              <SceneTag theme={theme}>{scene.mood}</SceneTag>
              <SceneTag theme={theme}>{scene.time_of_day}</SceneTag>
            </SceneCardMeta>
            
            <SceneCardFooter>
              <SceneCardIndex theme={theme}>场景 #{index + 1}</SceneCardIndex>
              <SceneCardImage theme={theme}>
                {scene.image_url ? (
                  <img src={scene.image_url} alt={scene.title} />
                ) : (
                  <EyeOutlined style={{ fontSize: '1.5rem', color: theme.colors.textDisabled }} />
                )}
              </SceneCardImage>
            </SceneCardFooter>
          </SceneCard>
        ))}
      </SceneListContainer>
    </SceneContainer>
  );
};

export default SceneList;