'use client';

import { useEffect, useRef } from 'react';

const CustomCursor = () => {
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorOutlineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursorDot = cursorDotRef.current;
    const cursorOutline = cursorOutlineRef.current;
    const cursorWrapper = document.getElementById('cursor-wrapper');
    if (!cursorDot || !cursorOutline || !cursorWrapper) return;
    
    document.body.style.cursor = 'none';

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      cursorDot.style.left = `${clientX}px`;
      cursorDot.style.top = `${clientY}px`;
      cursorOutline.style.left = `${clientX - cursorOutline.offsetWidth / 2}px`;
      cursorOutline.style.top = `${clientY - cursorOutline.offsetHeight / 2}px`;
    };

    const handleMouseOver = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (target.closest('a, button, input[type="submit"], [role="button"]')) {
            cursorWrapper.classList.add('pointer');
        }
    };

    const handleMouseOut = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (target.closest('a, button, input[type="submit"], [role="button"]')) {
            cursorWrapper.classList.remove('pointer');
        }
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      document.body.style.cursor = 'default';
    };
  }, []);

  return (
    <div id="cursor-wrapper" className="custom-cursor">
      <div ref={cursorDotRef} className="cursor-dot"></div>
      <div ref={cursorOutlineRef} className="cursor-outline"></div>
    </div>
  );
};

export default CustomCursor;
