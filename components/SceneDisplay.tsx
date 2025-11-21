import React, { useEffect, useState } from 'react';
import { StoryScene } from '../types';
import LoadingIndicator from './LoadingIndicator';

interface SceneDisplayProps {
  scene: StoryScene;
  imageData: string | null;
  imageLoading: boolean;
}

const SceneDisplay: React.FC<SceneDisplayProps> = ({ scene, imageData, imageLoading }) => {
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    setShowText(false);
    const timer = setTimeout(() => setShowText(true), 100);
    return () => clearTimeout(timer);
  }, [scene]);

  return (
    <div className="flex flex-col space-y-6 w-full max-w-4xl mx-auto">
      {/* Image Container */}
      <div className="relative w-full aspect-video bg-gray-900 rounded-xl overflow-hidden shadow-2xl border border-gray-800">
        {imageLoading && (
           <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
             <LoadingIndicator text="Painting the scene..." />
           </div>
        )}
        {imageData ? (
          <img 
            src={imageData} 
            alt={scene.visualPrompt} 
            className={`w-full h-full object-cover transition-opacity duration-1000 ${imageLoading ? 'opacity-50' : 'opacity-100'}`}
          />
        ) : (
          !imageLoading && (
             <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-500">
               <span className="italic">Visuals unobtainable through the mist...</span>
             </div>
          )
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/70 to-transparent p-6 pt-20">
          <h2 className="text-3xl md:text-4xl font-bold text-amber-100 fantasy-font tracking-wide drop-shadow-lg">
            {scene.title}
          </h2>
        </div>
      </div>

      {/* Text Content */}
      <div className={`transition-all duration-700 ease-out transform ${showText ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="bg-gray-800/50 backdrop-blur-sm p-6 md:p-8 rounded-xl border border-gray-700 shadow-inner">
          <p className="text-lg md:text-xl leading-relaxed text-gray-200 font-light">
            {scene.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SceneDisplay;