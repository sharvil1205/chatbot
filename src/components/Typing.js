import React from 'react';

export const Typing = () => (
  <div className="typing-indicator flex items-center space-x-2">
    <p className="text-blue-500 text-sm font-semibold ml-2">Typing</p>
    <div className="h-2 w-2 bg-blue-500 rounded-full animate-bounce"></div>
    <div className="h-2 w-2 bg-blue-500 rounded-full animate-bounce"></div>
    <div className="h-2 w-2 bg-blue-500 rounded-full animate-bounce"></div>
  </div>
);

export default Typing;
