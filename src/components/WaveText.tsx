import React from 'react';


interface WaveTextProps {
  text: string;
}

const WaveText: React.FC<WaveTextProps> = ({ text }) => {
  return (
    <>
      {text.split('').map((char, index) => (
        <span
          key={index}
          className="wave-char"
          style={{ animationDelay: `${index * 75}ms` }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </>
  );
};

export default WaveText;