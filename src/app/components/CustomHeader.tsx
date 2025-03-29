'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';
import { useQueryClient } from '@tanstack/react-query';
import { MessageCircle, Bell, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/ui/toggle-ui';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface CustomHeaderProps {
  username?: string;
}

const CustomHeader: React.FC<CustomHeaderProps> = () => {
  const router = useRouter();
  const { user, setUser } = useUser();
  const queryClient = useQueryClient();

  const logoutHandler = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      if (response.ok) {
        setUser(null);
        queryClient.clear();
        await queryClient.invalidateQueries();
        router.push('/login');
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="flex items-center justify-between p-4">
      <h3 className="text-2xl font-semibold text-muted-foreground">
        Money Tracker
      </h3>

      <div className="flex items-center gap-12">
        {/* <Input placeholder="Search Dashboard" className="w-[200px]" /> */}

        <div className="flex items-center gap-3">
                  {/* Mode toggle */}
        <ModeToggle /> {/* This is where you integrate the mode toggle button */}
          <Button variant="ghost" size="icon" onClick={() => {}}>
            <MessageCircle className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => {}}>
            <Bell className="h-5 w-5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="relative h-9 w-9 rounded-full p-0 cursor-pointer">
                <Avatar className="h-9 w-9">
                  <AvatarFallback>
                    <User className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem disabled>
                {user?.username} - {user?.email}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logoutHandler}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default CustomHeader;
