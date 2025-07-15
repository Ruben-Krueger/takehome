import type { JSX } from 'react';

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
    <div className="space-y-4">
      <h3 className="text-lg font-medium">{title}</h3>
      <h3 className="text-md font-medium">{subtitle}</h3>
      {children}
    </div>
  );
}
