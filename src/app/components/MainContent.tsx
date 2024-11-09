import React, { ReactNode } from 'react';

interface MainContentProps {
  children: ReactNode;
}

const MainContent: React.FC<MainContentProps> = ({ children }) => {
  return (
    <>
      {children}
    </>
  );
};

export default MainContent;