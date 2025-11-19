
import React, { useState, useRef, ChangeEvent, KeyboardEvent } from 'react';

interface PinInputProps {
  length: number;
  onComplete: (pin: string) => void;
}

const PinInput: React.FC<PinInputProps> = ({ length, onComplete }) => {
  const [pin, setPin] = useState<string[]>(Array(length).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const { value } = e.target;
    if (/^[0-9]$/.test(value) || value === '') {
      const newPin = [...pin];
      newPin[index] = value;
      setPin(newPin);

      if (value !== '' && index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
      
      if (newPin.every(digit => digit !== '')) {
        onComplete(newPin.join(''));
      }
    }
  };
  
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && pin[index] === '' && index > 0) {
        inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="flex justify-center gap-3 md:gap-4">
      {pin.map((digit, index) => (
        <input
          key={index}
          ref={el => inputRefs.current[index] = el}
          type="tel"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          className="w-14 h-16 md:w-16 md:h-20 bg-gray-700 border-2 border-gray-600 rounded-lg text-center text-2xl md:text-3xl font-bold text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition"
        />
      ))}
    </div>
  );
};

export default PinInput;
