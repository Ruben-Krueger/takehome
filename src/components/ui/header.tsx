import FontSizeWidget from './font-size-widget';
import { SidebarTrigger } from './sidebar';

export default function Header() {
  return (
    <header className="flex items-center gap-4 p-4 border-b">
      <SidebarTrigger />
      <FontSizeWidget />
    </header>
  );
}
