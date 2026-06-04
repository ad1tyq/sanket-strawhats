interface Village {
  name: string;
  coordinates: { long: number; lat: number }[];
}

export const villages: Village[] = [
  // Existing villages
  { name: "Dibrugarh Village", coordinates: [{ long: 94.9, lat: 27.47 }] },
  { name: "Tinsukia Village", coordinates: [{ long: 95.36, lat: 27.49 }] },
  { name: "Jorhat Village", coordinates: [{ long: 94.22, lat: 26.75 }] },
  { name: "Golaghat Village", coordinates: [{ long: 93.97, lat: 26.51 }] },
  { name: "Sivasagar Village", coordinates: [{ long: 94.63, lat: 26.98 }] },
  { name: "Charaideo Village", coordinates: [{ long: 94.87, lat: 26.93 }] },
  
  // Additional villages in Assam
  { name: "Guwahati Rural", coordinates: [{ long: 91.75, lat: 26.18 }] },
  { name: "Nagaon District", coordinates: [{ long: 92.68, lat: 26.35 }] },
  { name: "Barpeta Village", coordinates: [{ long: 91.0, lat: 26.32 }] },
  { name: "Bongaigaon Rural", coordinates: [{ long: 90.56, lat: 26.48 }] },
  { name: "Dhubri District", coordinates: [{ long: 89.98, lat: 26.02 }] },
  { name: "Dhemaji Area", coordinates: [{ long: 94.58, lat: 27.48 }] },
  { name: "Lakhimpur Village", coordinates: [{ long: 94.11, lat: 27.24 }] },
  { name: "Sonitpur Rural", coordinates: [{ long: 92.8, lat: 26.63 }] },
  { name: "Morigaon District", coordinates: [{ long: 92.34, lat: 26.25 }] },
  { name: "Nalbari Village", coordinates: [{ long: 91.44, lat: 26.45 }] },
  { name: "Goalpara Rural", coordinates: [{ long: 90.62, lat: 26.17 }] },
  { name: "Kokrajhar District", coordinates: [{ long: 90.27, lat: 26.4 }] },
  { name: "Darrang Village", coordinates: [{ long: 92.0, lat: 26.52 }] },
  { name: "Udalguri Area", coordinates: [{ long: 92.13, lat: 26.76 }] },
  { name: "Baksa District", coordinates: [{ long: 91.38, lat: 26.72 }] },
  { name: "Kamrup Rural", coordinates: [{ long: 91.44, lat: 26.22 }] },
  { name: "Kamrup Metro Outskirts", coordinates: [{ long: 91.8, lat: 26.15 }] },
  { name: "Cachar District", coordinates: [{ long: 92.8, lat: 24.82 }] },
  { name: "Hailakandi Rural", coordinates: [{ long: 92.56, lat: 24.68 }] },
  { name: "Karimganj Village", coordinates: [{ long: 92.35, lat: 24.87 }] },
  { name: "Hojai District", coordinates: [{ long: 92.86, lat: 26.0 }] },
  { name: "Dima Hasao Rural", coordinates: [{ long: 93.17, lat: 25.33 }] },
  { name: "Karbi Anglong", coordinates: [{ long: 93.47, lat: 26.0 }] },
  { name: "West Karbi Anglong", coordinates: [{ long: 92.86, lat: 26.17 }] },
  { name: "Bishwanath District", coordinates: [{ long: 93.17, lat: 26.67 }] },
  { name: "Majuli Island", coordinates: [{ long: 94.16, lat: 26.95 }] },
  { name: "Chirang Rural", coordinates: [{ long: 90.47, lat: 26.52 }] },
  { name: "South Salmara", coordinates: [{ long: 89.87, lat: 25.87 }] },
  
  // Villages near major rivers
  { name: "Brahmaputra Riverside", coordinates: [{ long: 91.75, lat: 26.18 }] },
  { name: "Subansiri Basin", coordinates: [{ long: 94.25, lat: 27.52 }] },
  { name: "Dhansiri Bank", coordinates: [{ long: 93.73, lat: 26.28 }] },
  { name: "Kopili River Area", coordinates: [{ long: 92.83, lat: 26.08 }] },
  { name: "Barak Valley", coordinates: [{ long: 92.8, lat: 24.82 }] },
  
  // Tea garden villages
  { name: "Tea Estate Dibrugarh", coordinates: [{ long: 94.93, lat: 27.42 }] },
  { name: "Tea Garden Tinsukia", coordinates: [{ long: 95.4, lat: 27.45 }] },
  { name: "Jorhat Tea Village", coordinates: [{ long: 94.25, lat: 26.72 }] },
  { name: "Golaghat Plantation", coordinates: [{ long: 93.92, lat: 26.48 }] },
  
  // Flood-prone areas
  { name: "Dhubri Flood Zone", coordinates: [{ long: 89.98, lat: 26.02 }] },
  { name: "Barpeta Lowland", coordinates: [{ long: 91.0, lat: 26.32 }] },
  { name: "Goalpara Riverine", coordinates: [{ long: 90.62, lat: 26.17 }] },
  { name: "Morigaon Wetland", coordinates: [{ long: 92.34, lat: 26.25 }] },
  
  // Border area villages
  { name: "Dhubri Border", coordinates: [{ long: 89.82, lat: 26.12 }] },
  { name: "Karimganj Frontier", coordinates: [{ long: 92.38, lat: 24.82 }] },
  { name: "Cachar Border", coordinates: [{ long: 92.75, lat: 24.78 }] },
  
  // Hill area villages
  { name: "Karbi Hills", coordinates: [{ long: 93.47, lat: 26.0 }] },
  { name: "Dima Hasao Highland", coordinates: [{ long: 93.17, lat: 25.33 }] },
  { name: "North Cachar", coordinates: [{ long: 93.0, lat: 25.5 }] },
  
  // Wildlife sanctuary areas
  { name: "Kaziranga Buffer", coordinates: [{ long: 93.41, lat: 26.58 }] },
  { name: "Manas Fringe", coordinates: [{ long: 91.0, lat: 26.72 }] },
  { name: "Nameri Outskirts", coordinates: [{ long: 92.87, lat: 27.0 }] },
  
  // Urban fringe villages
  { name: "Guwahati Peri-urban", coordinates: [{ long: 91.68, lat: 26.12 }] },
  { name: "Silchar Outskirts", coordinates: [{ long: 92.8, lat: 24.85 }] },
  { name: "Dibrugarh Suburban", coordinates: [{ long: 94.88, lat: 27.42 }] },
  { name: "Jorhat Rural", coordinates: [{ long: 94.18, lat: 26.73 }] }
];