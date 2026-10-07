export interface Customer {
  id: string;
  name: string;
  type: 'business' | 'individual';
  suburb: string;
  state: 'VIC' | 'NSW' | 'QLD';
  accountNo?: string;
  email: string;
  phone: string;
}

export const SEED_CUSTOMERS: Customer[] = [
  {
    id: 'C-01',
    name: 'Harlow & Finch Architects',
    type: 'business',
    suburb: 'Richmond',
    state: 'VIC',
    accountNo: 'ACT-4402',
    email: 'studio@harlowfinch.com.au',
    phone: '03 9421 8800',
  },
  {
    id: 'C-02',
    name: 'Tasman Dental Supply',
    type: 'business',
    suburb: 'Parramatta',
    state: 'NSW',
    accountNo: 'ACT-2918',
    email: 'dispatch@tasmandental.com.au',
    phone: '02 9689 4110',
  },
  {
    id: 'C-03',
    name: 'Northgate Labs',
    type: 'business',
    suburb: 'Herston',
    state: 'QLD',
    accountNo: 'ACT-8812',
    email: 'logistics@northgatelabs.com.au',
    phone: '07 3354 9022',
  },
  {
    id: 'C-04',
    name: 'Ostrava Printworks',
    type: 'business',
    suburb: 'Collingwood',
    state: 'VIC',
    accountNo: 'ACT-1033',
    email: 'jobs@ostravaprint.com.au',
    phone: '03 9419 7200',
  },
  {
    id: 'C-05',
    name: 'Mei-Ling Zhao',
    type: 'individual',
    suburb: 'Surry Hills',
    state: 'NSW',
    email: 'ml.zhao@outlook.com',
    phone: '0412 883 910',
  },
  {
    id: 'C-06',
    name: 'Daniel Okafor',
    type: 'individual',
    suburb: 'Fortitude Valley',
    state: 'QLD',
    email: 'd.okafor@fastmail.com',
    phone: '0433 192 840',
  },
  {
    id: 'C-07',
    name: 'Isla Brennan',
    type: 'individual',
    suburb: 'Brunswick',
    state: 'VIC',
    email: 'isla.brennan@gmail.com',
    phone: '0429 881 743',
  },
  {
    id: 'C-08',
    name: 'Cobalt Bike Co.',
    type: 'business',
    suburb: 'Fitzroy',
    state: 'VIC',
    accountNo: 'ACT-5091',
    email: 'workshop@cobaltbikes.com.au',
    phone: '03 9417 6620',
  },
];
