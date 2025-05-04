import React from 'react';
import { motion } from 'framer-motion';

const ThinkingIndicator: React.FC = () => {
  return (
    <div className="flex justify-start mb-4">
      <div className="flex items-center bg-gray-100 px-4 py-3 rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl">
        <span className="text-gray-500 text-sm mr-2">思考中</span>
        <div className="flex space-x-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="h-2 w-2 bg-blue-500 rounded-full"
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
  );
};

export default ThinkingIndicator; 