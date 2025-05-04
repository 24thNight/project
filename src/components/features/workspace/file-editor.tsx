import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../../lib/language-context';

// 定义组件接口
interface FileEditorProps {
  currentFile: string;
  fileContents: { [key: string]: string };
  onContentChange: (fileName: string, content: string) => void;
}

/**
 * 文件编辑器组件
 * 
 * 用于显示和编辑当前选中文件的内容
 */
const FileEditor: React.FC<FileEditorProps> = ({
  currentFile,
  fileContents,
  onContentChange
}) => {
  const { language } = useLanguage();
  const [content, setContent] = useState('');
  
  // 当当前文件变化时，更新编辑器内容
  useEffect(() => {
    if (currentFile && fileContents[currentFile] !== undefined) {
      setContent(fileContents[currentFile]);
    } else {
      setContent('');
    }
  }, [currentFile, fileContents]);
  
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    onContentChange(currentFile, newContent);
  };
  
  // 根据文件类型渲染不同的编辑器视图
  const renderEditor = () => {
    // 如果是Markdown文件，可以添加预览功能等
    if (currentFile.endsWith('.md') || currentFile.endsWith('.txt')) {
      return (
        <textarea
          className="w-full h-full p-4 font-mono bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 resize-none focus:outline-none"
          value={content}
          onChange={handleContentChange}
          spellCheck="false"
          aria-label={language === 'zh' ? '文件内容' : 'File content'}
        />
      );
    }
    // 如果是JSON文件，可以添加格式化功能
    if (currentFile.endsWith('.json')) {
      return (
        <textarea
          className="w-full h-full p-4 font-mono bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 resize-none focus:outline-none"
          value={content}
          onChange={handleContentChange}
          spellCheck="false"
          aria-label={language === 'zh' ? '文件内容' : 'File content'}
        />
      );
    }
    
    // 默认编辑器
    return (
      <textarea
        className="w-full h-full p-4 font-mono bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 resize-none focus:outline-none"
        value={content}
        onChange={handleContentChange}
        spellCheck="false"
        aria-label={language === 'zh' ? '文件内容' : 'File content'}
      />
    );
  };
  
  return (
    <div className="h-full flex flex-col">
      {currentFile ? (
        <>
          <div className="border-b border-gray-200 dark:border-gray-700 px-4 py-2 flex items-center justify-between">
            <h2 className="text-sm font-medium">{currentFile}</h2>
          </div>
          <div className="flex-1 overflow-auto">
            {renderEditor()}
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center h-full text-gray-500">
          {language === 'zh' ? '没有选择文件' : 'No file selected'}
        </div>
      )}
    </div>
  );
};

export default FileEditor; 