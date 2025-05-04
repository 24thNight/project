import React from 'react';
import { toast } from 'sonner';
import { useLanguage } from '../../../lib/language-context';

// 定义组件接口
interface FileExplorerProps {
  openFiles: string[];
  currentFile: string;
  fileContents: { [key: string]: string };
  onFileClick: (fileName: string) => void;
  onCreateFile: (fileName: string) => void;
}

/**
 * 文件资源管理器组件
 * 
 * 用于显示和管理工作空间中的文件列表，支持创建新文件和选择文件
 */
const FileExplorer: React.FC<FileExplorerProps> = ({
  openFiles,
  currentFile,
  fileContents,
  onFileClick,
  onCreateFile
}) => {
  const { language } = useLanguage();

  const handleCreateFile = () => {
    const fileName = prompt(language === 'zh' ? '请输入文件名:' : 'Enter file name:');
    if (fileName && !openFiles.includes(fileName)) {
      onCreateFile(fileName);
      toast.success(language === 'zh' ? `文件 ${fileName} 已创建` : `File ${fileName} created`);
    } else if (fileName && openFiles.includes(fileName)) {
      toast.error(language === 'zh' ? `文件 ${fileName} 已存在` : `File ${fileName} already exists`);
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">{language === 'zh' ? '文件' : 'Files'}</h2>
        <button
          onClick={handleCreateFile}
          className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
          aria-label={language === 'zh' ? '新建文件' : 'New File'}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
      
      <div className="space-y-1">
        {openFiles.map((file) => (
          <div
            key={file}
            className={`p-2 rounded-md cursor-pointer flex items-center ${
              file === currentFile 
                ? 'bg-gray-200 dark:bg-gray-700' 
                : 'hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
            onClick={() => onFileClick(file)}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            {file}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileExplorer; 