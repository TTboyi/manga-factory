import React, { useState, useCallback, useRef } from 'react';
import styled from 'styled-components';
import { InboxOutlined, DeleteOutlined } from '@ant-design/icons';
import { useTheme } from '../../providers/ThemeProvider';
import { Loading } from '../Loading';
import { Progress } from 'antd';

// src/components/FileUpload/FileUpload.tsx

interface FileItem {
  id: string;
  file: File;
  name: string;
  size: number;
  progress?: number; // 上传进度百分比，可能为 undefined
}


const UploadArea = styled.div<{ isDragOver: boolean; isDisabled: boolean }>`
  border: 2px dashed ${({ theme, isDragOver }) => isDragOver ? theme.colors.primary : theme.colors.border};
  background-color: ${({ theme, isDragOver }) => isDragOver ? theme.colors.backgroundLight : 'transparent'};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: 2rem;
  text-align: center;
  cursor: ${({ isDisabled }) => isDisabled ? 'not-allowed' : 'pointer'};
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &:hover {
    border-color: ${({ theme, isDisabled }) => isDisabled ? theme.colors.border : theme.colors.primary};
    background-color: ${({ theme, isDisabled }) => isDisabled ? 'transparent' : theme.colors.backgroundLight};
  }
`;

const UploadIcon = styled(InboxOutlined)`
  font-size: 3rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 1rem;
`;

const UploadText = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 0.5rem;
`;

const FileInput = styled.input`
  display: none;
`;

const FileList = styled.div`
  margin-top: 1rem;
`;

const FileItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem;
  background-color: ${({ theme }) => theme.colors.backgroundLight};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  margin-bottom: 0.5rem;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background-color: ${({ theme }) => theme.colors.backgroundLight};
  border-radius: 2px;
  margin-top: 8px;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ progress: number }>`
  height: 100%;
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: 2px;
  width: ${props => props.progress}%;
  transition: width 0.3s ease;
`;

const FileInfo = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
`;

const FileName = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.textPrimary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-right: 0.5rem;
`;

const FileActions = styled.div`
  display: flex;
  align-items: center;
`;

const FileRemove = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.danger};
  cursor: pointer;
  padding: 0.25rem;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.colors.danger};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  margin-top: 0.5rem;
`;

// src/components/FileUpload/FileUpload.tsx

// FileSize 组件，用于显示文件大小
const FileSize = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  white-space: nowrap;
`;

// ProgressText 组件，用于显示进度文本
const ProgressText = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-top: 4px;
  text-align: right;
`;


interface FileUploadProps {
  accept?: string;
  maxSize?: number; // MB
  maxCount?: number;
  disabled?: boolean;
  onChange?: (files: File[]) => void;
  onUpload?: (files: File[]) => Promise<any>;
  loading?: boolean;
  error?: string;
  showProgress?: boolean;
  onProgress?: (progress: number, file: File) => void; // 上传进度回调
}

const FileUpload: React.FC<FileUploadProps> = ({
  accept = '.txt,.docx,.doc',
  maxSize = 10,
  maxCount = 1,
  disabled = false,
  onChange,
  onUpload,
  loading = false,
  error,
  showProgress = false,
  onProgress
}) => {
  const { theme } = useTheme();
  const [isDragOver, setIsDragOver] = useState(false);
  const [files, setFiles] = useState<FileItem[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      processFiles(selectedFiles);
    }
  }, []);

  const processFiles = (newFiles: File[]) => {
    if (files.length + newFiles.length > maxCount) {
      alert(`最多上传 ${maxCount} 个文件`);
      return;
    }

    const validFiles = newFiles.filter(file => file.size <= maxSize * 1024 * 1024);
    const fileItems = validFiles.map(file => ({
      id: `${file.name}-${file.size}-${Date.now()}`,
      file,
      name: file.name,
      size: file.size,
      progress: 0
    }));

    const updatedFiles = [...files, ...fileItems];
    setFiles(updatedFiles);
    
    if (onChange) onChange(updatedFiles.map(item => item.file));
  };

  const removeFile = useCallback((id: string) => {
    const updatedFiles = files.filter(file => file.id !== id);
    setFiles(updatedFiles);
    if (onChange) onChange(updatedFiles.map(item => item.file));
  }, [files, onChange]);

  // 在 FileUpload 组件中的 handleUpload 方法里做类型转换
const handleUpload = useCallback(async () => {
  if (onUpload && files.length > 0) {
    try {
      const uploadWithProgress = async () => {
        const uploadPromises = files.map(async (fileItem) => {
          if (onProgress) {
            const updateProgress = (progress: number) => {
              // 更新文件项的进度
              const updatedFiles = files.map(f => 
                f.id === fileItem.id ? { ...f, progress } : f
              );
              setFiles(updatedFiles);
              onProgress(progress, fileItem.file);
            };

            // 模拟进度更新
            for (let i = 0; i <= 100; i += 10) {
              await new Promise(resolve => setTimeout(resolve, 100));
              updateProgress(i);
            }
          }

          return fileItem.file; // 返回原始的 File 对象
        });

        await Promise.all(uploadPromises);

        // 这里需要传递 File[] 类型
        if (onChange) {
          // 将 FileItem[] 中的 file 提取成 File[]
          const fileArray = files.map(item => item.file);
          onChange(fileArray); // 确保传递的是 File[] 类型
        }
      };

      await uploadWithProgress();
    } catch (err) {
      console.error('文件上传失败:', err);
    }
  }
}, [onUpload, files, onProgress, onChange]);


  return (
    <div>
      <UploadArea
        isDragOver={isDragOver}
        isDisabled={disabled || loading}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setIsDragOver(false); processFiles(Array.from(e.dataTransfer.files)); }}
      >
        {loading ? (
          <Loading text="上传中..." overlay={false} size="small" />
        ) : (
          <>
            <UploadIcon theme={theme} />
            <UploadText theme={theme}>点击或拖拽文件到此处上传</UploadText>
            <FileInput
              ref={fileInputRef}
              type="file"
              accept={accept}
              multiple={maxCount > 1}
              onChange={handleFileSelect}
              disabled={disabled || loading}
            />
          </>
        )}
      </UploadArea>
      
      {error && <ErrorMessage theme={theme}>{error}</ErrorMessage>}
      
      {files.length > 0 && (
        <FileList>
          {files.map(file => (
            <FileItem key={file.id} theme={theme}>
              <FileInfo>
                <FileName>{file.name}</FileName>
                <FileSize>{formatFileSize(file.size)}</FileSize>
                {showProgress && loading && (
                  <>
                    <ProgressBar theme={theme}>
                      <ProgressFill theme={theme} progress={file.progress || 0} />
                    </ProgressBar>
                    <ProgressText theme={theme}>{file.progress || 0}%</ProgressText>
                  </>
                )}
              </FileInfo>
              <FileActions>
                <FileRemove onClick={() => removeFile(file.id)} disabled={loading} theme={theme}>
                  <DeleteOutlined />
                </FileRemove>
              </FileActions>
            </FileItem>
          ))}
        </FileList>
      )}
    </div>
  );
};

export default FileUpload;
