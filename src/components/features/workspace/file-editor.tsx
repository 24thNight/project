import React from 'react';

// 定义组件接口
interface FileEditorProps {
  currentFile: string;
  fileContents: { [key: string]: string };
  onContentChange: (fileName: string, content: string) => void;
}

/**
 * 文件编辑器组件
 * 
 * 用于编辑工作区中的文件内容
 */
const FileEditor: React.FC<FileEditorProps> = ({
  currentFile,
  fileContents,
  onContentChange
}) => {
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onContentChange(currentFile, e.target.value);
  };

  return (
    <div className="h-full flex flex-col">
      {/* 文件标题栏 */}
      <div className="bg-gray-800 text-gray-100 px-4 py-2 border-b border-gray-700 flex items-center">
        <span className="text-sm font-medium">{currentFile}</span>
      </div>
      
      {/* 编辑区域 */}
      <div className="flex-1 overflow-auto bg-gray-900">
        <textarea
          value={fileContents[currentFile] || ''}
          onChange={handleContentChange}
          className="w-full h-full p-4 bg-gray-900 text-gray-200 font-mono resize-none focus:outline-none"
          spellCheck={false}
        />
      </div>
    </div>
  );
};

export default FileEditor; 