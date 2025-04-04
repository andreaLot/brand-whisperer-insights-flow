
import React from 'react';

const RobotAvatar: React.FC = () => {
  return (
    <div className="w-12 h-12 bg-brand-gray-dark rounded-full flex items-center justify-center border border-brand-blue-light">
      <svg width="24" height="24" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18 20.5C19.6569 20.5 21 19.1569 21 17.5C21 15.8431 19.6569 14.5 18 14.5C16.3431 14.5 15 15.8431 15 17.5C15 19.1569 16.3431 20.5 18 20.5Z" fill="white"/>
        <path d="M30 13H28V9C28 6.24 25.76 4 23 4H13C10.24 4 8 6.24 8 9V13H6C3.24 13 1 15.24 1 18V24C1 26.76 3.24 29 6 29H8V32C8 33.1 8.9 34 10 34H26C27.1 34 28 33.1 28 32V29H30C32.76 29 35 26.76 35 24V18C35 15.24 32.76 13 30 13ZM10 9C10 7.35 11.35 6 13 6H23C24.65 6 26 7.35 26 9V13H24V9C24 8.45 23.55 8 23 8H13C12.45 8 12 8.45 12 9V13H10V9ZM14 13V10H22V13H14ZM26 32H10V27H26V32ZM33 24C33 25.65 31.65 27 30 27H6C4.35 27 3 25.65 3 24V18C3 16.35 4.35 15 6 15H30C31.65 15 33 16.35 33 18V24Z" fill="white"/>
      </svg>
    </div>
  );
};

export default RobotAvatar;
