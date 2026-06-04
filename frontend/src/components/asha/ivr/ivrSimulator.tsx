"use client";

import React, { useState } from 'react';
import { Phone, Hash } from 'lucide-react';
import Image from 'next/image';
import { useReport } from '@/contexts/reportContext';

// A simple map to convert the digit pressed to the disease name
const diseaseMap: { [key: string]: 'cholera' | 'typhoid' | 'diarrhea' | 'jaundice' | 'dysentery' } = {
  '1': 'cholera',
  '2': 'typhoid',
  '3': 'diarrhea',
  '4': 'jaundice',
  '5': 'dysentery',
};

interface ReportData {
  id: number;
  reportedDate: string;
  latitude: number;
  longitude: number;
  village: string;
  symptoms: string;
  estimatedDisease?: 'cholera' | 'typhoid' | 'diarrhea' | 'jaundice' | 'dysentery';
  cases: number;
  otherDetails?: string;
}

// Village coordinates for IVR reports
const ivrVillages = [
  { name: "Dibrugarh Village", lat: 27.47, long: 94.9 },
  { name: "Tinsukia Village", lat: 27.49, long: 95.36 },
  { name: "Jorhat Village", lat: 26.75, long: 94.22 },
  { name: "Golaghat Village", lat: 26.51, long: 93.97 },
  { name: "Sivasagar Village", lat: 26.98, long: 94.63 },
];

export function IVRSimulator() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<'disease' | 'cases'>('disease');
  const [diseaseDigit, setDiseaseDigit] = useState<string>('');
  const [caseCount, setCaseCount] = useState<string>('');
  const [statusMessage, setStatusMessage] = useState('Dialing...');
  
  const { setReport } = useReport();

  const handleKeyPress = (digit: string) => {
    if (step === 'disease') {
      setDiseaseDigit(digit);
      const diseaseName = diseaseMap[digit as keyof typeof diseaseMap];
      setStatusMessage(`Selected: ${diseaseName}. Enter case count...`);
      setStep('cases');
    } else if (step === 'cases') {
      setCaseCount(prev => prev + digit);
    }
  };

  const handleSubmit = async () => {
    setStatusMessage('Submitting report...');

    // Get a random village for the IVR report
    const randomVillage = ivrVillages[Math.floor(Math.random() * ivrVillages.length)];
    
    // Get the disease from the map, or undefined if not found
    const estimatedDisease = diseaseMap[diseaseDigit as keyof typeof diseaseMap];
    
    // Create the report data in the same format as your form
    const reportData: ReportData = {
      id: Date.now(),
      reportedDate: new Date().toISOString(),
      latitude: randomVillage.lat,
      longitude: randomVillage.long,
      village: randomVillage.name,
      symptoms: `IVR reported ${estimatedDisease || 'unknown disease'}`,
      estimatedDisease: estimatedDisease, // This will be undefined if digit not in map
      cases: parseInt(caseCount) || 1,
      otherDetails: 'Reported via IVR phone call',
    };

    // Set the report in context (this will trigger submission to backend)
    setReport(reportData);
    console.log("submit: ",reportData);
    
    setStatusMessage('Success! Report submitted via IVR.');

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
            <button 
              key={digit} 
              onClick={() => handleKeyPress(digit)} 
              className="h-16 bg-gray-200 rounded-lg text-2xl font-bold text-gray-800 hover:bg-gray-300"
            >
              {digit}
            </button>
          ))}
          <button 
            onClick={() => setIsOpen(false)}
            className="h-16 rounded-lg transition-color duration-200 flex items-center justify-center hover:bg-red-500"
          >
            <Image src="/assets/exit.png" alt="exit" width={20} height={20} />
          </button>
          <button 
            onClick={() => handleKeyPress('0')} 
            className="h-16 bg-gray-200 rounded-lg text-2xl font-bold text-gray-800 hover:bg-gray-300"
          >
            0
          </button>
          <button 
            onClick={handleSubmit} 
            className="h-16 bg-green-500 rounded-lg flex items-center justify-center hover:bg-green-600"
          >
            <Hash className="w-8 h-8 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}