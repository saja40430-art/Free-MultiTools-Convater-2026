import React from 'react';

export enum ToolCategory {
  IMAGE = 'Image',
  AUDIO_VIDEO = 'Audio & Video',
  CALCULATOR = 'Calculators',
  TEXT = 'Text & Code',
  UTILITY = 'Utilities',
  AI = 'Gemini AI'
}

export interface ToolDef {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: ToolCategory;
  component: React.ReactNode;
}

export enum ImageFormat {
  PNG = 'image/png',
  JPEG = 'image/jpeg',
  WEBP = 'image/webp'
}

export interface CalculatorResult {
  label: string;
  value: string | number;
}