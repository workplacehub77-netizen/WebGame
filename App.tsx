import React, { useState, useCallback, useRef, useEffect } from 'react';
import { StoryScene, GameState } from './types';
import { generateStoryScene, generateSceneImage } from './services/geminiService';
import { INITIAL_PROMPT } from './constants';
import StartScreen from './components/StartScreen';
import SceneDisplay from './components/SceneDisplay';
import Button from './components/Button';
import LoadingIndicator from './components/LoadingIndicator';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    history: [],
    currentScene: null,
    currentImage: null,
    isLoadingText: false,
    isLoadingImage: false,
    error: null,
    isGameStarted: false,
    turnCount: 0
  });

  // To scroll to bottom when new content arrives
  const bottomRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
     setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
     }, 100);
  }, []);

  // Handle fetching the image independently so text displays first
  const fetchImage = useCallback(async (visualPrompt: string) => {
    setGameState(prev => ({ ...prev, isLoadingImage: true }));
    try {
      const imageData = await generateSceneImage(visualPrompt);
      setGameState(prev => ({ ...prev, currentImage: imageData, isLoadingImage: false }));
    } catch (err) {
      console.error(err);
      setGameState(prev => ({ ...prev, isLoadingImage: false }));
    }
  }, []);

  const handleGameAction = useCallback(async (userAction: string, isInitial: boolean = false) => {
    setGameState(prev => ({ 
      ...prev, 
      isLoadingText: true, 
      error: null,
      currentImage: null // Reset image for new scene
    }));

    try {
      const scene = await generateStoryScene(
        isInitial ? [] : gameState.history,
        userAction
      );

      // Update state with text immediately
      setGameState(prev => {
        const newHistory = [...prev.history];
        if (!isInitial) {
             // Add brief summary of previous choice to history to keep context lean
             newHistory.push(`Player chose: ${userAction}`);
        }
        newHistory.push(`Scene: ${scene.title} - ${scene.description}`);
        
        // Keep history manageable (last 5 turns)
        if (newHistory.length > 10) {
            newHistory.splice(0, newHistory.length - 10);
        }

        return {
            ...prev,
            history: newHistory,
            currentScene: scene,
            isLoadingText: false,
            isGameStarted: true,
            turnCount: prev.turnCount + 1
        };
      });

      scrollToBottom();

      // Trigger image generation in background
      fetchImage(scene.visualPrompt);

    } catch (error: any) {
      console.error("Game Error:", error);
      setGameState(prev => ({
        ...prev,
        isLoadingText: false,
        error: "The mists of time are thick. The oracle could not see the future. Please try again."
      }));
    }
  }, [gameState.history, fetchImage, scrollToBottom]);

  const handleStart = () => {
    handleGameAction(INITIAL_PROMPT, true);
  };

  return (
    <div className="min-h-screen bg-[#121212] text-gray-200 selection:bg-amber-900 selection:text-white flex flex-col">
      
      {/* Header */}
      <header className="p-4 md:p-6 border-b border-gray-800 bg-[#1a1a1a]/90 sticky top-0 z-50 backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <span className="text-xl md:text-2xl font-bold text-amber-500 fantasy-font cursor-pointer" onClick={() => window.location.reload()}>
            Infinite Realms
          </span>
          {gameState.isGameStarted && (
             <div className="text-sm text-gray-500 font-mono">
                Turn: {gameState.turnCount}
             </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow p-4 md:p-6 flex flex-col items-center max-w-6xl mx-auto w-full">
        
        {!gameState.isGameStarted ? (
          <StartScreen onStart={handleStart} isLoading={gameState.isLoadingText} />
        ) : (
          <div className="w-full flex flex-col space-y-8 pb-32 fade-in">
            
            {/* Scene Display */}
            {gameState.currentScene && (
              <SceneDisplay 
                scene={gameState.currentScene}
                imageData={gameState.currentImage}
                imageLoading={gameState.isLoadingImage}
              />
            )}

            {/* Loading State for Next Turn */}
            {gameState.isLoadingText && (
               <div className="py-12">
                  <LoadingIndicator text="Weaving the next chapter..." />
               </div>
            )}

            {/* Error Display */}
            {gameState.error && (
              <div className="bg-red-900/20 border border-red-800 text-red-200 p-4 rounded-lg text-center">
                <p>{gameState.error}</p>
                <Button onClick={() => handleGameAction("Try again")} className="mt-4" variant="secondary">
                  Retry
                </Button>
              </div>
            )}

          </div>
        )}
         <div ref={bottomRef} />
      </main>

      {/* Persistent Action Bar (Sticky Bottom) */}
      {gameState.isGameStarted && !gameState.isLoadingText && gameState.currentScene && (
        <div className="fixed bottom-0 left-0 right-0 bg-[#1a1a1a]/95 backdrop-blur-lg border-t border-gray-800 p-4 z-40 pb-safe">
          <div className="max-w-4xl mx-auto">
            <p className="text-gray-400 text-sm mb-3 font-bold uppercase tracking-wider text-center">
               What will you do?
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {gameState.currentScene.choices.map((choice, idx) => (
                <Button 
                  key={idx} 
                  onClick={() => handleGameAction(choice)}
                  variant={idx === 0 ? 'primary' : 'secondary'}
                  className="w-full text-left md:text-center text-sm md:text-base py-4 truncate"
                  title={choice}
                >
                  {choice}
                </Button>
              ))}
               {/* Custom Action Input could go here in v2 */}
            </div>
          </div>
        </div>
      )}
      <style>{`
        .pb-safe {
            padding-bottom: env(safe-area-inset-bottom, 20px);
        }
      `}</style>
    </div>
  );
};

export default App;