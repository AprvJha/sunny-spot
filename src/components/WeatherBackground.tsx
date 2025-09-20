import { useEffect, useState } from 'react';
import { WeatherCondition } from '../types/weather';

interface WeatherBackgroundProps {
  condition: WeatherCondition;
}

export const WeatherBackground = ({ condition }: WeatherBackgroundProps) => {
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    setShowAnimation(true);
    return () => setShowAnimation(false);
  }, [condition]);

  const createRaindrops = () => {
    const raindrops = [];
    for (let i = 0; i < 100; i++) {
      raindrops.push(
        <div
          key={i}
          className="raindrop"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${0.5 + Math.random() * 0.5}s`
          }}
        />
      );
    }
    return raindrops;
  };

  const createClouds = () => {
    const clouds = [];
    for (let i = 0; i < 5; i++) {
      clouds.push(
        <div
          key={i}
          className="cloud"
          style={{
            top: `${10 + Math.random() * 30}%`,
            width: `${100 + Math.random() * 150}px`,
            height: `${40 + Math.random() * 30}px`,
            animationDuration: `${20 + Math.random() * 20}s`,
            animationDelay: `${Math.random() * 10}s`
          }}
        />
      );
    }
    return clouds;
  };

  const createStars = () => {
    const stars = [];
    for (let i = 0; i < 50; i++) {
      stars.push(
        <div
          key={i}
          className="star"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 50}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${2 + Math.random() * 2}s`
          }}
        />
      );
    }
    return stars;
  };

  if (!showAnimation) return null;

  return (
    <>
      {condition === 'rain' && (
        <div className="rain-animation">
          {createRaindrops()}
        </div>
      )}
      
      {condition === 'storm' && (
        <div className="rain-animation">
          {createRaindrops()}
          <div className="absolute inset-0 opacity-20">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-full h-full bg-white"
                style={{
                  animation: `flash ${2 + Math.random() * 3}s ease-in-out infinite`,
                  animationDelay: `${Math.random() * 5}s`
                }}
              />
            ))}
          </div>
        </div>
      )}
      
      {condition === 'clouds' && (
        <div className="cloud-animation">
          {createClouds()}
        </div>
      )}
      
      {condition === 'clear' && (
        <div className="sun-animation">
          <div className="sun" />
        </div>
      )}
      
      {condition === 'night' && (
        <>
          <div className="moon-animation">
            <div className="moon" />
          </div>
          <div className="stars-animation">
            {createStars()}
          </div>
        </>
      )}
      
      {condition === 'snow' && (
        <div className="rain-animation">
          {Array.from({ length: 80 }).map((_, i) => (
            <div
              key={i}
              className="absolute bg-white rounded-full opacity-80"
              style={{
                left: `${Math.random() * 100}%`,
                width: `${3 + Math.random() * 4}px`,
                height: `${3 + Math.random() * 4}px`,
                animation: `snowfall ${3 + Math.random() * 2}s linear infinite`,
                animationDelay: `${Math.random() * 3}s`
              }}
            />
          ))}
        </div>
      )}
    </>
  );
};

// Add additional keyframes for snow and flash effects
const additionalStyles = `
  @keyframes snowfall {
    0% {
      transform: translateY(-100vh) rotate(0deg);
      opacity: 1;
    }
    100% {
      transform: translateY(100vh) rotate(360deg);
      opacity: 0;
    }
  }
  
  @keyframes flash {
    0%, 90%, 100% {
      opacity: 0;
    }
    5%, 85% {
      opacity: 0.2;
    }
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = additionalStyles;
  document.head.appendChild(styleElement);
}