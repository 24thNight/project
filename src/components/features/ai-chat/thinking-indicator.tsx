import React from 'react';
import { motion } from 'framer-motion';

interface ThinkingIndicatorProps {
  isDarkMode?: boolean;
}

const ThinkingIndicator: React.FC<ThinkingIndicatorProps> = ({ isDarkMode = false }) => {
  return (
    <div className="mb-6">
      {/* 消息头部 - Cursor风格 */}
      <div className="flex items-center gap-2 mb-2">
        {/* AI头像 */}
        <div className={`w-5 h-5 rounded-full flex-shrink-0 overflow-hidden ${isDarkMode ? 'bg-gray-700' : 'bg-blue-100'} flex items-center justify-center`}>
          <svg className={`w-3.5 h-3.5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
      </div>
      
      {/* 思考中指示器 - Cursor风格 */}
      <div className="pl-7">
        <div className={`inline-flex items-center rounded-md py-1 px-2.5 ${
          isDarkMode 
            ? 'bg-gray-800 border border-gray-700' 
            : 'bg-gray-100 border border-gray-200'
        }`}>
          <span className={`text-xs mr-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>思考中</span>
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className={`h-1.5 w-1.5 ${isDarkMode ? 'bg-blue-400' : 'bg-blue-500'} rounded-full`}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.6, 1, 0.6]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThinkingIndicator; 