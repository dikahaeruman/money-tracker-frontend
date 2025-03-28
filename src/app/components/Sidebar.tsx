import React from 'react'
import { Home, Rocket, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface SidebarProps {
  onMenuSelect: (key: string) => void;
  collapsed: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ onMenuSelect, collapsed = false }) => {
  const [selected, setSelected] = React.useState('dashboard')

  const handleClick = (key: string) => {
    setSelected(key)
    onMenuSelect(key)
  }

  return (
    <>
      <div className={cn(
        "flex items-center justify-center",
        collapsed ? "my-4" : "my-10"
      )}>
        <Rocket className={cn(
          "text-[#4f6f52]",
          collapsed ? "h-8 w-8" : "h-12 w-12"
        )} />
      </div>

      <nav className="flex h-screen flex-col gap-2 px-2">
  <Button
    variant="ghost"
    className={cn(
      "flex items-center gap-2 rounded-md transition-colors", // Ensure proper alignment and spacing
      collapsed ? "justify-center px-2 py-3" : "justify-start w-full py-4 px-4", // Center when collapsed
      selected === 'dashboard' && "bg-accent text-accent-foreground" // Highlight when selected
    )}
    onClick={() => handleClick('dashboard')}
  >
    <Home className="h-5 w-5" />
    {!collapsed && <span>Dashboard</span>}
  </Button>
  <Button
    variant="ghost"
    className={cn(
      "flex items-center gap-2 rounded-md transition-colors", // Ensure proper alignment and spacing
      collapsed ? "justify-center px-2 py-3" : "justify-start w-full py-4 px-4", // Center when collapsed
      selected === 'settings' && "bg-accent text-accent-foreground" // Highlight when selected
    )}
    onClick={() => handleClick('settings')}
  >
    <Settings className="h-5 w-5" />
    {!collapsed && <span>Settings</span>}
  </Button>
</nav>
    </>
  )
}

export default Sidebar