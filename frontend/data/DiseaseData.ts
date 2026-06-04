export interface AshaReport {
  id: number;
  reportedDate: string;
  latitude: number;
  longitude: number;
  village: string;
  symptoms: string;
  estimatedDisease?: 'cholera' | 'typhoid' | 'diarrhea' | 'jaundice' | 'dysentery'; // Optional
  cases: number;
  otherDetails?: string; // Optional
}

export const allAshaReports: AshaReport[] = [
  {
    id: 2001,
    reportedDate: '2023-09-01',
    latitude: 26.1,
    longitude: 91.6,
    village: 'Kamrup District Outskirts',
    symptoms: 'Multiple families reporting severe stomach cramps and dehydration.',
    estimatedDisease: 'cholera',
    cases: 15,
    otherDetails: 'Water from the main community well seems cloudy.',
  },
  {
    id: 2002,
    reportedDate: '2023-09-02',
    latitude: 27.47,
    longitude: 94.9,
    village: 'Near Dibrugarh Town',
    symptoms: 'Persistent high fever and weakness spreading among adults.',
    estimatedDisease: 'typhoid',
    cases: 8,
  },
  {
    id: 2003,
    reportedDate: '2023-09-02',
    latitude: 26.25,
    longitude: 92.25,
    village: 'Morigaon Flood Relief Camp',
    symptoms: 'Widespread diarrhea affecting many children in the camp.',
    estimatedDisease: 'diarrhea',
    cases: 45,
    otherDetails: 'Sanitation facilities are overwhelmed due to recent flooding.'
  },
  {
    id: 2004,
    reportedDate: '2023-09-03',
    latitude: 23.72,
    longitude: 92.71,
    village: 'Aizawl, Mizoram',
    symptoms: 'Several people are showing signs of yellowing eyes and skin.',
    estimatedDisease: 'jaundice',
    cases: 12,
    otherDetails: 'Peoples eyes are yellow.'
  },
  {
    id: 2005,
    reportedDate: '2023-09-04',
    latitude: 24.82,
    longitude: 92.8,
    village: 'Silchar, Cachar District',
    symptoms: 'Bloody stools and severe abdominal pain reported in one neighborhood.',
    estimatedDisease: 'dysentery',
    cases: 18,
  },
];
