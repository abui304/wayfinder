import React, { useEffect, useRef } from 'react';
import './ShootingStars.css';

const ShootingStars = () => {
    const containerRef = useRef(null);
    const starsRef = useRef([]);
    const intervalsRef = useRef([]);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        startShootingStars();

        return () => {
            intervalsRef.current.forEach(interval => clearInterval(interval));
            starsRef.current.forEach(star => {
                if (star && star.parentNode) star.remove();
            });
        };
    }, []);

    const createShootingStar = () => {
        const container = containerRef.current;
        const star = document.createElement('div');
        star.className = 'shooting-star';
        
        const startX = -200;
        const startY = Math.random() * window.innerHeight * 0.6;
        const angle = 25 + Math.random() * 40;
        const duration = 1.5 + Math.random() * 2;
        const length = 80 + Math.random() * 80;
        const delay = Math.random() * 2;
        
        star.style.cssText = `
            left: ${startX}px;
            top: ${startY}px;
            transform: rotate(${angle}deg);
            width: ${length}px;
            animation: shoot ${duration}s ease-in-out ${delay}s;
        `;
        
        container.appendChild(star);
        starsRef.current.push(star);
        
        setTimeout(() => {
            const index = starsRef.current.indexOf(star);
            if (index > -1) starsRef.current.splice(index, 1);
            if (star.parentNode) star.remove();
        }, (duration + delay) * 1000);
    };

    const startShootingStars = () => {
        const interval = setInterval(() => {
            if (Math.random() < 0.6 && starsRef.current.length < 5) {
                createShootingStar();
            }
        }, 1000);
        
        intervalsRef.current.push(interval);
        
        for (let i = 0; i < 3; i++) {
            setTimeout(() => createShootingStar(), i * 800);
        }
    };

    return <div ref={containerRef} className="shooting-stars-container" />;
};

export default ShootingStars;