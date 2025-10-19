import React, { useEffect, useRef } from 'react';

const ShootingStars = () => {
    const containerRef = useRef(null);
    const starsRef = useRef([]);
    const intervalsRef = useRef([]);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // Create background stars
        createBackgroundStars();
        
        // Start shooting stars animation
        startShootingStars();

        // Cleanup function
        return () => {
            // Clear all intervals
            intervalsRef.current.forEach(interval => clearInterval(interval));
            intervalsRef.current = [];
            
            // Remove all stars
            starsRef.current.forEach(star => {
                if (star && star.parentNode) {
                    star.remove();
                }
            });
            starsRef.current = [];
        };
    }, []);

    const createBackgroundStars = () => {
        const container = containerRef.current;
        const starCount = 150;
        
        for (let i = 0; i < starCount; i++) {
            const star = document.createElement('div');
            star.className = 'background-star';
            
            const size = Math.random() * 2;
            const opacity = 0.1 + Math.random() * 0.7;
            const delay = Math.random() * 4;
            
            star.style.cssText = `
                width: ${size}px;
                height: ${size}px;
                left: ${Math.random() * 100}vw;
                top: ${Math.random() * 100}vh;
                opacity: ${opacity};
                animation-delay: ${delay}s;
                filter: drop-shadow(0 0 2px #ebdbc1);
            `;
            
            container.appendChild(star);
            starsRef.current.push(star);
        }
    };

    const createShootingStar = () => {
        const container = containerRef.current;
        const star = document.createElement('div');
        star.className = 'shooting-star';
        
        // Random properties
        const startX = -200;
        const startY = Math.random() * window.innerHeight * 0.6;
        const angle = 25 + Math.random() * 40;
        const duration = 1.5 + Math.random() * 2;
        const length = 80 + Math.random() * 80;
        const delay = Math.random() * 2;
        
        // Apply styles
        star.style.cssText = `
            left: ${startX}px;
            top: ${startY}px;
            transform: rotate(${angle}deg);
            width: ${length}px;
            animation: shoot ${duration}s ease-in-out ${delay}s;
        `;
        
        container.appendChild(star);
        starsRef.current.push(star);
        
        // Remove star after animation
        setTimeout(() => {
            const index = starsRef.current.indexOf(star);
            if (index > -1) starsRef.current.splice(index, 1);
            if (star.parentNode) star.remove();
        }, (duration + delay) * 1000);
    };

    const startShootingStars = () => {
        // Create stars randomly every 1-3 seconds
        const interval = setInterval(() => {
            if (Math.random() < 0.6 && starsRef.current.length < 8) {
                createShootingStar();
            }
        }, 1000);
        
        intervalsRef.current.push(interval);
        
        // Initial burst of stars
        for (let i = 0; i < 3; i++) {
            setTimeout(() => createShootingStar(), i * 800);
        }
    };

    return <div ref={containerRef} className="shooting-stars-container" />;
};

export default ShootingStars;