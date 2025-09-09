import React from 'react';

export function Footer() {
  return (
    <footer className="bg-muted text-muted-foreground py-4 mt-auto">
      <div className="container mx-auto text-center text-sm">
        <p>&copy; {new Date().getFullYear()} CipherLock. All rights reserved.</p>
      </div>
    </footer>
  );
}