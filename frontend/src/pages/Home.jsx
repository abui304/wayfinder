import React from 'react';
import NavBar from '../components/NavBar';
import ShootingStars from '../components/ShootingStars'; // Your existing component
import './Home.css';

function Home() {
    return (
        <div className="home-container">
            {/* Add ShootingStars - it won't affect your layout */}
            <ShootingStars />
            
            <NavBar />
            <div className="home-content">
                <div className="text-section">
                    <h1 className="typewriter">Hi Traveler</h1>
                    <p className="subtext">
                        Wayfinder: Discover your next destination through the stars.
                    </p>
                </div>
                <div className="graphic-section">
                    {/* graphic placeholder */}
                </div>
            </div>
        </div>
    );
}

export default Home;