import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Type } from 'lucide-react';
import { useFontSize, FontSize } from '@/contexts/FontSizeContext';
import assertExhaustiveSwitchError from '@/lib/assertExhaustiveSwitchError';

const getFontSizeClass = (size: FontSize) => {
  switch (size) {
    case FontSize.small:
      return 'text-sm';
    case FontSize.medium:
      return 'text-base';
    case FontSize.large:
      return 'text-lg';
    default:
      assertExhaustiveSwitchError(size);
  }
};

function WidgetButton({
  fontSize,
  onPressFontSize,
  selected,
}: {
  fontSize: FontSize;
  onPressFontSize: (fontsize: FontSize) => void;
  selected: boolean;
}) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => onPressFontSize(fontSize)}
      className={`h-8 w-8 p-0 ${selected ? 'bg-blue-100 border-blue-300' : ''}`}
    >
      <span className={getFontSizeClass(fontSize)}>A</span>
    </Button>
  );
}

export default function FontSizeWidget() {
  const { fontSize, setFontSize } = useFontSize();

  return (
    <div className="fixed top-4 right-4 z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-2">
      <div className="flex items-center gap-2">
        <Type className="h-4 w-4 text-gray-500" />

        <div className="flex items-center gap-1">
          {Object.values(FontSize).map(ft => (
            <WidgetButton
              fontSize={ft}
              onPressFontSize={() => setFontSize(ft)}
              selected={fontSize === ft}
              key={ft}
            />
          ))}
        </div>
        <Badge variant="secondary" className="text-xs">
          {fontSize}
        </Badge>
      </div>
    </div>
  );
}
