import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

export const FontSize = {
  small: 'sm',
  medium: 'md',
  large: 'lg',
} as const;

export type FontSize = (typeof FontSize)[keyof typeof FontSize];

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
    '--text-xs': '0.625rem', // 10px
    '--text-sm': '0.75rem', // 12px
    '--text-base': '0.875rem', // 14px
    '--text-lg': '1.125rem', // 18px
    '--text-xl': '1.375rem', // 22px
    '--text-2xl': '1.75rem', // 28px
    '--text-3xl': '2.25rem', // 36px
    '--text-4xl': '2.875rem', // 46px
  },
  md: {
    '--text-xs': '0.75rem', // 12px
    '--text-sm': '0.875rem', // 14px
    '--text-base': '1rem', // 16px (default)
    '--text-lg': '1.25rem', // 20px
    '--text-xl': '1.625rem', // 26px
    '--text-2xl': '2.125rem', // 34px
    '--text-3xl': '2.75rem', // 44px
    '--text-4xl': '3.5rem', // 56px
  },
  lg: {
    '--text-xs': '0.875rem', // 14px
    '--text-sm': '1rem', // 16px
    '--text-base': '1.25rem', // 20px
    '--text-lg': '1.625rem', // 26px
    '--text-xl': '2.125rem', // 34px
    '--text-2xl': '2.75rem', // 44px
    '--text-3xl': '3.5rem', // 56px
    '--text-4xl': '4.5rem', // 72px
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
