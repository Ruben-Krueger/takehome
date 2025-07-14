import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

export enum FontSize {
  small = 'sm',
  medium = 'md',
  large = 'lg',
}

interface FontSizeContextType {
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
}

const FontSizeContext = createContext<FontSizeContextType | undefined>(
  undefined
);

// CSS custom property mappings
const fontSizeMap = {
  sm: {
    '--font-size-xs': '0.625rem', // 10px
    '--font-size-sm': '0.75rem', // 12px
    '--font-size-base': '0.875rem', // 14px
    '--font-size-lg': '1rem', // 16px
    '--font-size-xl': '1.125rem', // 18px
    '--font-size-2xl': '1.25rem', // 20px
    '--font-size-3xl': '1.5rem', // 24px
    '--font-size-4xl': '1.875rem', // 30px
  },
  md: {
    '--font-size-xs': '0.75rem', // 12px
    '--font-size-sm': '0.875rem', // 14px
    '--font-size-base': '1rem', // 16px (default)
    '--font-size-lg': '1.125rem', // 18px
    '--font-size-xl': '1.25rem', // 20px
    '--font-size-2xl': '1.5rem', // 24px
    '--font-size-3xl': '1.875rem', // 30px
    '--font-size-4xl': '2.25rem', // 36px
  },
  lg: {
    '--font-size-xs': '0.875rem', // 14px
    '--font-size-sm': '1rem', // 16px
    '--font-size-base': '1.125rem', // 18px
    '--font-size-lg': '1.25rem', // 20px
    '--font-size-xl': '1.5rem', // 24px
    '--font-size-2xl': '1.875rem', // 30px
    '--font-size-3xl': '2.25rem', // 36px
    '--font-size-4xl': '2.75rem', // 44px
  },
};

interface FontSizeProviderProps {
  children: ReactNode;
}

export const FontSizeProvider: React.FC<FontSizeProviderProps> = ({
  children,
}) => {
  const [fontSize, setFontSize] = useState<FontSize>(() => {
    const saved = localStorage.getItem('fontSize');
    const isValid = Object.values(FontSize).includes(saved as FontSize);
    return isValid ? (saved as FontSize) : FontSize.medium;
  });

  // Apply CSS custom properties to document root
  useEffect(() => {
    const root = document.documentElement;
    const properties = fontSizeMap[fontSize];

    Object.entries(properties).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });
  }, [fontSize]);

  // Save to localStorage when fontSize changes
  useEffect(() => {
    localStorage.setItem('fontSize', fontSize);
  }, [fontSize]);

  return (
    <FontSizeContext.Provider value={{ fontSize, setFontSize }}>
      {children}
    </FontSizeContext.Provider>
  );
};

export const useFontSize = () => {
  const context = useContext(FontSizeContext);
  if (context === undefined) {
    throw new Error('useFontSize must be used within a FontSizeProvider');
  }
  return context;
};
