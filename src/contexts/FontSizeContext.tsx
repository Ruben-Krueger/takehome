import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

type FontSize = 'small' | 'large';

interface FontSizeContextType {
  fontSize: FontSize;
  toggleFontSize: () => void;
}

const FontSizeContext = createContext<FontSizeContextType | undefined>(
  undefined
);

export const useFontSize = () => {
  const context = useContext(FontSizeContext);
  if (context === undefined) {
    throw new Error('useFontSize must be used within a FontSizeProvider');
  }
  return context;
};

interface FontSizeProviderProps {
  children: ReactNode;
}

export const FontSizeProvider: React.FC<FontSizeProviderProps> = ({
  children,
}) => {
  const [fontSize, setFontSize] = useState<FontSize>('small');

  const toggleFontSize = () => {
    setFontSize(prev => (prev === 'small' ? 'large' : 'small'));
  };

  return (
    <FontSizeContext.Provider value={{ fontSize, toggleFontSize }}>
      {children}
    </FontSizeContext.Provider>
  );
};
