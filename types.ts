import React from 'react';

export interface StoryScene {
  title: string;
  description: string;
  choices: string[];
  visualPrompt: string;
}

export interface GameState {
  history: string[]; // Array of previous context/summaries
  currentScene: StoryScene | null;
  currentImage: string | null; // Base64 data URL
  isLoadingText: boolean;
  isLoadingImage: boolean;
  error: string | null;
  isGameStarted: boolean;
  turnCount: number;
}

export enum GameActionType {
  START_GAME = 'START_GAME',
  MAKE_CHOICE = 'MAKE_CHOICE',
  SET_SCENE = 'SET_SCENE',
  SET_IMAGE = 'SET_IMAGE',
  SET_ERROR = 'SET_ERROR',
  RESET = 'RESET'
}

// For clarity in component props
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
}