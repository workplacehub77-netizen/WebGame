import React from 'react';
import Button from './Button';

interface StartScreenProps {
  onStart: () => void;
  isLoading: boolean;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart, isLoading }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
      <div className="mb-8 space-y-2">
        <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-red-600 fantasy-font mb-4">
          Infinite Realms
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          An endless text adventure powered by AI. Every choice you make paints a new world. 
          Where will your path lead?
        </p>
      </div>
      
      <div className="p-1 bg-gradient-to-r from-amber-500 to-red-600 rounded-lg shadow-[0_0_40px_rgba(217,119,6,0.3)]">
        <div className="bg-gray-900 p-8 rounded-md">
            <Button 
                onClick={onStart} 
                disabled={isLoading}
                className="text-xl px-12 py-4"
            >
                {isLoading ? "Awakening the World..." : "Begin Adventure"}
            </Button>
        </div>
      </div>
    </div>
  );
};

export default StartScreen;