import type { JSX } from 'react';
import { Card, CardContent } from './ui/card';

interface Props {
  title: string;
  subtitle?: string;
  children: JSX.Element;
}

export default function StudyChartContainer({
  title,
  subtitle,
  children,
}: Props) {
  return (
    <Card className={'h-full overflow-hidden'}>
      <CardContent className="p-4 overflow-hidden">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">{title}</h3>
          <h3 className="text-md font-medium">{subtitle}</h3>
          {children}
        </div>
      </CardContent>
    </Card>
  );
}
