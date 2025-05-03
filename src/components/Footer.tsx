
import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full py-4 px-6 border-t mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-sm text-muted-foreground">
        <div>
          &copy; {new Date().getFullYear()} Office Activity Recognition
        </div>
        <div className="mt-2 sm:mt-0">
          Powered by CNN + LSTM Neural Networks
        </div>
      </div>
    </footer>
  );
};

export default Footer;
