
import React from 'react';
import { Brain } from 'lucide-react';

const Header = () => {
  return (
    <header className="w-full py-4 px-6 border-b">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Brain size={28} className="text-primary" />
          <h1 className="text-2xl font-bold">Office Activity Recognition</h1>
        </div>
        <div>
          <span className="text-sm text-muted-foreground">
            AI-powered human activity detection
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
