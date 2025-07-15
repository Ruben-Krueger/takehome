import type { JSX } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

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
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {subtitle && (
          <div>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          </div>
        )}
      </CardHeader>
      <CardContent className="overflow-hidden">{children}</CardContent>
    </Card>
  );
}
