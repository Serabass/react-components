import React from 'react';

export interface IfProps {
  condition: boolean | (() => boolean);
  children: React.ReactElement;
}

export function If({
  condition,
  children,
}: IfProps): React.ReactElement | null {
  if (typeof condition === 'function') {
    if (condition()) {
      return children;
    }
  }

  if (condition) {
    return children;
  }

  return null;
}
