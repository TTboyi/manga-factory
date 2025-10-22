import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../providers/ThemeProvider';

const AboutContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const AboutHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const AboutTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 0.5rem;
`;

const AboutSubtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0;
`;

const AboutContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const AboutSection = styled.div`
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: 1.5rem;
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 1rem;
`;

const SectionContent = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.6;
`;

const FeatureList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

const FeatureItem = styled.li`
  margin-bottom: 0.5rem;
  padding-left: 1.5rem;
  position: relative;
  
  &:before {
    content: '✓';
    position: absolute;
    left: 0;
    color: ${({ theme }) => theme.colors.primary};
    font-weight: bold;
  }
`;

const TeamGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
`;

const TeamMember = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const MemberAvatar = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.primary}20;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 0.5rem;
`;

const MemberName = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0 0 0.25rem 0;
`;

const MemberRole = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0;
`;

const AboutPage: React.FC = () => {
  const { theme } = useTheme();

  return (
    <AboutContainer theme={theme}>
      <AboutHeader>
        <AboutTitle theme={theme}>关于小说生成漫画</AboutTitle>
        <AboutSubtitle theme={theme}>利用AI技术将小说转换为漫画的智能平台</AboutSubtitle>
      </AboutHeader>
      
      <AboutContent>
        <AboutSection theme={theme}>
          <SectionTitle theme={theme}>项目介绍</SectionTitle>
          <SectionContent theme={theme}>
            <p>
              小说生成漫画是一个创新的项目，旨在利用人工智能技术将文字小说转换为视觉漫画。
              通过自然语言处理和计算机视觉技术，我们能够自动提取小说中的场景、人物和情感，
              并生成相应的漫画图像，让读者能够以全新的方式体验小说内容。
            </p>
            <p>
              该项目结合了最新的AI技术，包括大语言模型、图像生成模型和场景理解技术，
              为用户提供了一个简单易用的平台，只需上传小说文件或输入文本，即可自动生成漫画。
            </p>
          </SectionContent>
        </AboutSection>
        
        <AboutSection theme={theme}>
          <SectionTitle theme={theme}>主要功能</SectionTitle>
          <SectionContent theme={theme}>
            <FeatureList theme={theme}>
              <FeatureItem theme={theme}>支持多种文件格式（TXT、MD等）</FeatureItem>
              <FeatureItem theme={theme}>自动提取小说场景和关键情节</FeatureItem>
              <FeatureItem theme={theme}>智能生成漫画分镜和画面</FeatureItem>
              <FeatureItem theme={theme}>保持小说风格和情感基调</FeatureItem>
              <FeatureItem theme={theme}>支持多种漫画风格选择</FeatureItem>
              <FeatureItem theme={theme}>提供场景编辑和优化功能</FeatureItem>
            </FeatureList>
          </SectionContent>
        </AboutSection>
        
        <AboutSection theme={theme}>
          <SectionTitle theme={theme}>技术特点</SectionTitle>
          <SectionContent theme={theme}>
            <p>
              我们的项目采用了多种先进技术，包括自然语言处理、计算机视觉和生成式AI模型。
              通过深度学习技术，我们的系统能够理解小说内容，识别场景、人物和情感，
              并生成符合故事情节的漫画图像。
            </p>
            <p>
              我们的技术架构包括前端React应用、后端Python API服务以及AI模型服务。
              前端负责用户交互和结果展示，后端处理文件上传和场景提取，
              AI模型服务负责生成漫画图像。
            </p>
          </SectionContent>
        </AboutSection>
        
        <AboutSection theme={theme}>
          <SectionTitle theme={theme}>开发团队</SectionTitle>
          <SectionContent theme={theme}>
            <TeamGrid theme={theme}>
              <TeamMember>
                <MemberAvatar theme={theme}>AI</MemberAvatar>
                <MemberName theme={theme}>AI助手</MemberName>
                <MemberRole theme={theme}>全栈开发</MemberRole>
              </TeamMember>
              <TeamMember>
                <MemberAvatar theme={theme}>UI</MemberAvatar>
                <MemberName theme={theme}>UI设计师</MemberName>
                <MemberRole theme={theme}>界面设计</MemberRole>
              </TeamMember>
              <TeamMember>
                <MemberAvatar theme={theme}>ML</MemberAvatar>
                <MemberName theme={theme}>ML工程师</MemberName>
                <MemberRole theme={theme}>模型开发</MemberRole>
              </TeamMember>
            </TeamGrid>
          </SectionContent>
        </AboutSection>
        
        <AboutSection theme={theme}>
          <SectionTitle theme={theme}>使用指南</SectionTitle>
          <SectionContent theme={theme}>
            <p>
              使用小说生成漫画非常简单，只需按照以下步骤操作：
            </p>
            <FeatureList theme={theme}>
              <FeatureItem theme={theme}>上传小说文件或直接输入文本</FeatureItem>
              <FeatureItem theme={theme}>等待系统自动提取场景和关键情节</FeatureItem>
              <FeatureItem theme={theme}>查看生成的场景列表和预览图</FeatureItem>
              <FeatureItem theme={theme}>根据需要编辑和优化场景</FeatureItem>
              <FeatureItem theme={theme}>导出完整的漫画作品</FeatureItem>
            </FeatureList>
          </SectionContent>
        </AboutSection>
      </AboutContent>
    </AboutContainer>
  );
};

export default AboutPage;