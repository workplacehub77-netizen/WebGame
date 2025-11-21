import React from 'react';
import { ButtonProps } from '../types';

const Button: React.FC<ButtonProps> = ({ variant = 'primary', className = '', children, ...props }) => {
  const baseStyle = "px-6 py-3 rounded-lg font-bold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-amber-600 hover:bg-amber-500 text-white focus:ring-amber-500 shadow-lg shadow-amber-900/20 border border-amber-700",
    secondary: "bg-gray-700 hover:bg-gray-600 text-gray-200 focus:ring-gray-500 border border-gray-600",
    outline: "bg-transparent border-2 border-amber-600 text-amber-500 hover:bg-amber-900/20 focus:ring-amber-500"
  };

  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;