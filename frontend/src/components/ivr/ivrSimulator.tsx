"use client";

import React, { useState, /*useEffect, useCallback*/ } from 'react';
import { Phone, Hash } from 'lucide-react';
import Image from 'next/image';

// A simple map to convert the digit pressed to the disease name
const diseaseMap: { [key: string]: string } = {
  '1': 'cholera',
  '2': 'typhoid',
  '3': 'diarrhea',
  '4': 'jaundice',
  '5': 'dysentery',
};

/*// ✅ 1. Reusable hook to manage playing sounds
const useSound = (src: string) => {
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    // This effect runs once on the client to create the audio object
    const audioInstance = new Audio(src);
    audioInstance.preload = 'auto';
    setAudio(audioInstance);
  }, [src]);

  const play = useCallback(() => {
    if (audio) {
      audio.currentTime = 0; // Rewind to the start
      audio.play().catch(e => console.error("Error playing sound:", e));
    }
  }, [audio]);

  return play;
};*/

export function IVRSimulator() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<'disease' | 'cases'>('disease');
  const [diseaseDigit, setDiseaseDigit] = useState<string>('');
  const [caseCount, setCaseCount] = useState<string>('');
  const [statusMessage, setStatusMessage] = useState('Dialing...');

  const handleKeyPress = (digit: string) => {
    if (step === 'disease') {
      setDiseaseDigit(digit);
      setStatusMessage(`Selected: ${diseaseMap[digit]}. Enter case count...`);
      setStep('cases');
    } else if (step === 'cases') {
      setCaseCount(prev => prev + digit);
    }
  };

  const handleSubmit = async () => {
    setStatusMessage('Submitting report...');

    // This creates the same data structure that the real Twilio would send
    const formData = new URLSearchParams();
    formData.append('Digits[0]', diseaseDigit);
    formData.append('Digits', caseCount);
    formData.append('From', '+919999999999'); // A fake number for the demo

    // This calls your real API endpoint
    try {
      const response = await fetch('/api/ivr-report', {
        method: 'POST',
        body: formData.toString(),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      if (response.ok) {
        setStatusMessage('Success! Report submitted.');
      } else {
        setStatusMessage('Error: Submission failed.');
      }
    } catch (error) {
      console.error(error)
      setStatusMessage('Error: Network failed.');
    }

    setTimeout(() => {
      setIsOpen(false);
      reset();
    }, 2000);
  };

  const reset = () => {
    setStep('disease');
    setDiseaseDigit('');
    setCaseCount('');
    setStatusMessage('Dialing...');
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 transition-transform hover:scale-110"
      >
        <Phone className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl w-80 p-6">
        <p className="text-center font-semibold text-gray-800">Sanket IVR System</p>
        <p className="text-center text-gray-800">
          1: cholera,
          2: typhoid,<br/>
          3: diarrhea,
          4: jaundice,
          5: dysentery
        </p>
        <p className="text-center text-sm text-gray-500 mb-4 h-10">{statusMessage}</p>

        <div className="grid grid-cols-3 gap-4">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(digit => (
            <button key={digit} onClick={() => handleKeyPress(digit)} className="h-16 bg-gray-200 rounded-lg text-2xl font-bold text-gray-800 bg0 hover:bg-gray-300">
              {digit}
            </button>
          ))}
          <button onClick={() => setIsOpen(false)}
            className="h-16 rounded-lg transition-color duration-200 flex items-center justify-center hover:bg-red-500">
            <Image src="/assets/exit.png" alt="exit" width={20} height={20} />
          </button>
          <button onClick={() => handleKeyPress('0')} className="h-16 bg-gray-200 rounded-lg text-2xl font-bold text-gray-800 hover:bg-gray-300">0</button>
          <button onClick={handleSubmit} className="h-16 bg-green-500 rounded-lg flex items-center justify-center hover:bg-green-600">
            <Hash className="w-8 h-8 text-white" />
          </button>

        </div>
      </div>
    </div>
  );
}
