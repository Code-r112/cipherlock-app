
'use client';

import { useEffect, useRef } from 'react';

const CustomCursor = () => {
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorOutlineRef = useRef<HTMLDivElement>(null);
  const cursorWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursorDot = cursorDotRef.current;
    const cursorOutline = cursorOutlineRef.current;
    const cursorWrapper = cursorWrapperRef.current;
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
        const interactiveTarget = target.closest('a, button, input[type="submit"], [role="button"]');
        
        if (interactiveTarget) {
            cursorWrapper.classList.add('pointer');
            const computedStyle = window.getComputedStyle(interactiveTarget);
            const textColor = computedStyle.getPropertyValue('color');
            const bgColor = computedStyle.getPropertyValue('background-color');

            // Use the button's text color for the dot to ensure contrast.
            if(cursorDot) {
                cursorDot.style.backgroundColor = textColor;
            }
            // Use the button's background color for the outline.
            if(cursorOutline) {
                cursorOutline.style.borderColor = (bgColor && !bgColor.includes('rgba(0, 0, 0, 0)')) ? bgColor : textColor;
            }

        }
    };

    const handleMouseOut = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        const interactiveTarget = target.closest('a, button, input[type="submit"], [role="button"]');

        if (interactiveTarget) {
            cursorWrapper.classList.remove('pointer');
             if(cursorDot) {
                cursorDot.style.backgroundColor = ''; // Revert to CSS default
            }
            if(cursorOutline) {
                cursorOutline.style.borderColor = ''; // Revert to CSS default
            }
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
    <div id="cursor-wrapper" ref={cursorWrapperRef} className="custom-cursor">
      <div ref={cursorDotRef} className="cursor-dot"></div>
      <div ref={cursorOutlineRef} className="cursor-outline"></div>
    </div>
  );
};

export default CustomCursor;
