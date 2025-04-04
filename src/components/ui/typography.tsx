import React from 'react';
import clsx from 'clsx';

interface TypographyProps {
  variant?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  className?: string;
  children: React.ReactNode;
}

const Typography: React.FC<TypographyProps> = ({
  variant = 'p',
  className,
  children,
}) => {
  const baseStyles = 'text-gray-800'; // Default text color
  const variants = {
    h1: 'text-4xl font-bold',
    h2: 'text-3xl font-semibold',
    h3: 'text-2xl font-medium',
    p: 'text-base',
    span: 'text-sm',
  };

  const Component = variant;

  return (
    <Component className={clsx(baseStyles, variants[variant], className)}>
      {children}
    </Component>
  );
};

export { Typography };
