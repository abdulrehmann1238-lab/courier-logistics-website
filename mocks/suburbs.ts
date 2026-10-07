export interface Suburb {
  name: string;
  postcode: string;
  state: 'VIC' | 'NSW' | 'QLD';
  depot: 'Melbourne' | 'Sydney' | 'Brisbane';
  distanceToDepotKm: number;
}

export const AU_SUBURBS: Suburb[] = [
  // Melbourne / VIC
  { name: 'Port Melbourne', postcode: '3207', state: 'VIC', depot: 'Melbourne', distanceToDepotKm: 1.2 },
  { name: 'Docklands', postcode: '3008', state: 'VIC', depot: 'Melbourne', distanceToDepotKm: 3.5 },
  { name: 'Melbourne CBD', postcode: '3000', state: 'VIC', depot: 'Melbourne', distanceToDepotKm: 4.1 },
  { name: 'Southbank', postcode: '3006', state: 'VIC', depot: 'Melbourne', distanceToDepotKm: 3.8 },
  { name: 'Richmond', postcode: '3121', state: 'VIC', depot: 'Melbourne', distanceToDepotKm: 6.4 },
  { name: 'Collingwood', postcode: '3066', state: 'VIC', depot: 'Melbourne', distanceToDepotKm: 7.2 },
  { name: 'Fitzroy', postcode: '3065', state: 'VIC', depot: 'Melbourne', distanceToDepotKm: 6.8 },
  { name: 'Brunswick', postcode: '3056', state: 'VIC', depot: 'Melbourne', distanceToDepotKm: 9.5 },
  { name: 'St Kilda', postcode: '3182', state: 'VIC', depot: 'Melbourne', distanceToDepotKm: 7.8 },
  { name: 'Hawthorn', postcode: '3122', state: 'VIC', depot: 'Melbourne', distanceToDepotKm: 11.2 },
  { name: 'Footscray', postcode: '3011', state: 'VIC', depot: 'Melbourne', distanceToDepotKm: 8.3 },
  { name: 'Box Hill', postcode: '3128', state: 'VIC', depot: 'Melbourne', distanceToDepotKm: 18.5 },
  { name: 'Dandenong', postcode: '3175', state: 'VIC', depot: 'Melbourne', distanceToDepotKm: 32.4 },
  { name: 'Geelong', postcode: '3220', state: 'VIC', depot: 'Melbourne', distanceToDepotKm: 72.0 },
  { name: 'Werribee', postcode: '3030', state: 'VIC', depot: 'Melbourne', distanceToDepotKm: 25.1 }, // hits the 24-26km zone!

  // Sydney / NSW
  { name: 'Alexandria', postcode: '2015', state: 'NSW', depot: 'Sydney', distanceToDepotKm: 0.8 },
  { name: 'Surry Hills', postcode: '2010', state: 'NSW', depot: 'Sydney', distanceToDepotKm: 3.2 },
  { name: 'Sydney CBD', postcode: '2000', state: 'NSW', depot: 'Sydney', distanceToDepotKm: 5.6 },
  { name: 'Newtown', postcode: '2042', state: 'NSW', depot: 'Sydney', distanceToDepotKm: 4.1 },
  { name: 'Bondi Junction', postcode: '2022', state: 'NSW', depot: 'Sydney', distanceToDepotKm: 8.9 },
  { name: 'North Sydney', postcode: '2060', state: 'NSW', depot: 'Sydney', distanceToDepotKm: 9.4 },
  { name: 'Chatswood', postcode: '2067', state: 'NSW', depot: 'Sydney', distanceToDepotKm: 14.8 },
  { name: 'Parramatta', postcode: '2150', state: 'NSW', depot: 'Sydney', distanceToDepotKm: 24.8 }, // hits the 24-26km zone!
  { name: 'Ryde', postcode: '2112', state: 'NSW', depot: 'Sydney', distanceToDepotKm: 16.2 },
  { name: 'Penrith', postcode: '2750', state: 'NSW', depot: 'Sydney', distanceToDepotKm: 54.0 },
  { name: 'Liverpool', postcode: '2170', state: 'NSW', depot: 'Sydney', distanceToDepotKm: 31.5 },
  { name: 'Mascot', postcode: '2020', state: 'NSW', depot: 'Sydney', distanceToDepotKm: 2.5 },

  // Brisbane / QLD
  { name: 'Eagle Farm', postcode: '4009', state: 'QLD', depot: 'Brisbane', distanceToDepotKm: 1.0 },
  { name: 'Fortitude Valley', postcode: '4006', state: 'QLD', depot: 'Brisbane', distanceToDepotKm: 5.2 },
  { name: 'Brisbane CBD', postcode: '4000', state: 'QLD', depot: 'Brisbane', distanceToDepotKm: 6.8 },
  { name: 'South Brisbane', postcode: '4101', state: 'QLD', depot: 'Brisbane', distanceToDepotKm: 7.9 },
  { name: 'Herston', postcode: '4006', state: 'QLD', depot: 'Brisbane', distanceToDepotKm: 6.1 },
  { name: 'Hamilton', postcode: '4007', state: 'QLD', depot: 'Brisbane', distanceToDepotKm: 3.4 },
  { name: 'Chermside', postcode: '4032', state: 'QLD', depot: 'Brisbane', distanceToDepotKm: 11.5 },
  { name: 'Mount Gravatt', postcode: '4122', state: 'QLD', depot: 'Brisbane', distanceToDepotKm: 17.8 },
  { name: 'Ipswich', postcode: '4305', state: 'QLD', depot: 'Brisbane', distanceToDepotKm: 42.0 },
  { name: 'Gold Coast (Surfers)', postcode: '4217', state: 'QLD', depot: 'Brisbane', distanceToDepotKm: 78.0 },
];

export function calculateDistanceBetweenSuburbs(fromSuburb: string, toSuburb: string): { distanceKm: number; isInterstate: boolean } {
  const from = AU_SUBURBS.find(s => s.name.toLowerCase() === fromSuburb.toLowerCase());
  const to = AU_SUBURBS.find(s => s.name.toLowerCase() === toSuburb.toLowerCase());

  if (!from || !to) return { distanceKm: 14.5, isInterstate: false };

  if (from.state !== to.state) {
    return { distanceKm: 720.0, isInterstate: true };
  }

  // Same suburb
  if (from.name === to.name) {
    return { distanceKm: 4.2, isInterstate: false };
  }

  // Approximate realistic distance based on depot distances
  const baseDist = Math.abs(from.distanceToDepotKm - to.distanceToDepotKm) + 6.0;
  return { distanceKm: Math.max(3.5, Math.round(baseDist * 10) / 10), isInterstate: false };
}
