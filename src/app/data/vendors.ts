export type WoodOption = {
  name: string;
  imageUrl: string;
  price: number;
  available: number;
  humidity: number | null;
};

export type Vendor = {
  id: number;
  name: string;
  initials: string;
  humidity: number | null;
  certified: boolean;
  species: string;
  available: number;
  price: number;
  address: string;
  rating: number;
  reviews: number;
  daysAgo: number | null;
  distance: number;
  zone: 'temuco' | 'padre-las-casas' | 'alrededores';
  lat: number;
  lng: number;
  heroImage: string;
  imageUrl: string;
  woods: WoodOption[];
};

export const vendors: Vendor[] = [
  {
    id: 1,
    name: 'Leñas Boyeco',
    initials: 'LB',
    humidity: 17,
    certified: true,
    species: 'Eucaliptus',
    available: 15,
    price: 45000,
    address: 'Av. Alemania 850, Temuco',
    rating: 4.9,
    reviews: 38,
    daysAgo: 1,
    distance: 2.3,
    zone: 'temuco',
    lat: -38.7259,
    lng: -72.5804,
    heroImage: 'https://i.imgur.com/V6erZjc.png',
    imageUrl: 'https://images.unsplash.com/photo-1519682577862-22b62b24e493?auto=format&fit=crop&w=1200&q=80',
    woods: [
      { name: 'Eucaliptus', imageUrl: 'https://i.imgur.com/9X0Oa6E.png', price: 45000, available: 15, humidity: 16 },
      { name: 'Coihue', imageUrl: 'https://i.imgur.com/OhvLQ4A.jpeg', price: 47000, available: 12, humidity: 18 },
      { name: 'Roble', imageUrl: 'https://i.imgur.com/wTYaseS.jpeg', price: 52000, available: 8, humidity: 19 },
      { name: 'Avellano', imageUrl: 'https://i.imgur.com/MYleME3.jpeg', price: 56000, available: 4, humidity: 17 },
    ],
  },
  {
    id: 2,
    name: 'Maderera Verde',
    initials: 'MV',
    humidity: 21,
    certified: true,
    species: 'Roble',
    available: 20,
    price: 52000,
    address: 'Rudecindo Ortega 234, Temuco',
    rating: 4.6,
    reviews: 24,
    daysAgo: 2,
    distance: 3.1,
    zone: 'temuco',
    lat: -38.7459,
    lng: -72.6004,
    heroImage: 'https://i.imgur.com/8FYaFaF.png',
    imageUrl: 'https://images.unsplash.com/photo-1439127988557-7f34c725d0b4?auto=format&fit=crop&w=1200&q=80',
    woods: [
      { name: 'Eucaliptus', imageUrl: 'https://i.imgur.com/9X0Oa6E.png', price: 49000, available: 18, humidity: 17 },
      { name: 'Roble', imageUrl: 'https://i.imgur.com/wTYaseS.jpeg', price: 52000, available: 15, humidity: 20 },
      { name: 'Laurel', imageUrl: 'https://i.imgur.com/NxqTEbu.jpeg', price: 54000, available: 7, humidity: 19 },
      { name: 'Abedul', imageUrl: 'https://i.imgur.com/gAhtgBs.png', price: 58000, available: 3, humidity: 16 },
    ],
  },
  {
    id: 3,
    name: 'Juan Rojas',
    initials: 'JR',
    humidity: null,
    certified: false,
    species: 'Coihue',
    available: 10,
    price: 33000,
    address: 'Los Boldos 123, Padre Las Casas',
    rating: 3.8,
    reviews: 11,
    daysAgo: null,
    distance: 5.2,
    zone: 'padre-las-casas',
    lat: -38.7659,
    lng: -72.6204,
    heroImage: 'https://i.imgur.com/6ilO7N8.png',
    imageUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
    woods: [
      { name: 'Coihue', imageUrl: 'https://i.imgur.com/OhvLQ4A.jpeg', price: 33000, available: 10, humidity: 22 },
      { name: 'Roble', imageUrl: 'https://i.imgur.com/wTYaseS.jpeg', price: 36000, available: 6, humidity: 24 },
      { name: 'Laurel', imageUrl: 'https://i.imgur.com/NxqTEbu.jpeg', price: 39000, available: 4, humidity: 20 },
    ],
  },
  {
    id: 4,
    name: 'Leñas del Sur',
    initials: 'LS',
    humidity: 19,
    certified: true,
    species: 'Eucaliptus',
    available: 25,
    price: 48000,
    address: 'Balmaceda 456, Padre Las Casas',
    rating: 4.7,
    reviews: 29,
    daysAgo: 5,
    distance: 4.5,
    zone: 'padre-las-casas',
    lat: -38.7559,
    lng: -72.6404,
    heroImage: 'https://i.imgur.com/WEB8Wee.png',
    imageUrl: 'https://images.unsplash.com/photo-1496337589255-1d6c9d2af7b9?auto=format&fit=crop&w=1200&q=80',
    woods: [
      { name: 'Eucaliptus', imageUrl: 'https://i.imgur.com/9X0Oa6E.png', price: 48000, available: 20, humidity: 18 },
      { name: 'Coihue', imageUrl: 'https://i.imgur.com/OhvLQ4A.jpeg', price: 50000, available: 14, humidity: 19 },
      { name: 'Roble', imageUrl: 'https://i.imgur.com/wTYaseS.jpeg', price: 52000, available: 9, humidity: 20 },
      { name: 'Avellano', imageUrl: 'https://i.imgur.com/MYleME3.jpeg', price: 56000, available: 6, humidity: 17 },
      { name: 'Abedul', imageUrl: 'https://i.imgur.com/gAhtgBs.png', price: 60000, available: 2, humidity: 15 },
    ],
  },
  {
    id: 5,
    name: 'Comercial Aromo',
    initials: 'CA',
    humidity: 18,
    certified: true,
    species: 'Eucaliptus',
    available: 12,
    price: 41000,
    address: 'Caupolicán 789, Temuco',
    rating: 4.5,
    reviews: 17,
    daysAgo: 1,
    distance: 1.8,
    zone: 'alrededores',
    lat: -38.7159,
    lng: -72.5604,
    heroImage: 'https://i.imgur.com/yESgpZV.png',
    imageUrl: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1200&q=80',
    woods: [
      { name: 'Eucaliptus', imageUrl: 'https://i.imgur.com/9X0Oa6E.png', price: 41000, available: 12, humidity: 18 },
      { name: 'Coihue', imageUrl: 'https://i.imgur.com/OhvLQ4A.jpeg', price: 43000, available: 10, humidity: 20 },
      { name: 'Laurel', imageUrl: 'https://i.imgur.com/NxqTEbu.jpeg', price: 45000, available: 6, humidity: 19 },
    ],
  },
  {
    id: 6,
    name: 'Don Pedro Leña',
    initials: 'DP',
    humidity: null,
    certified: false,
    species: 'Roble',
    available: 8,
    price: 30000,
    address: 'Las Encinas 321, Padre Las Casas',
    rating: 3.7,
    reviews: 5,
    daysAgo: null,
    distance: 6.7,
    zone: 'alrededores',
    lat: -38.7059,
    lng: -72.5404,
    heroImage: 'https://i.imgur.com/3IMCpv4.png',
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
    woods: [
      { name: 'Roble', imageUrl: 'https://i.imgur.com/wTYaseS.jpeg', price: 30000, available: 8, humidity: 24 },
      { name: 'Avellano', imageUrl: 'https://i.imgur.com/MYleME3.jpeg', price: 34000, available: 3, humidity: 21 },
    ],
  },
  {
    id: 7,
    name: 'Forestal Cautín',
    initials: 'FC',
    humidity: 23,
    certified: true,
    species: 'Roble',
    available: 18,
    price: 44000,
    address: 'Ruta 5 Norte km 8, Temuco',
    rating: 4.5,
    reviews: 18,
    daysAgo: 5,
    distance: 3.8,
    zone: 'temuco',
    lat: -38.7359,
    lng: -72.6104,
    heroImage: 'https://i.imgur.com/l5VVuMG.png',
    imageUrl: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=1200&q=80',
    woods: [
      { name: 'Eucaliptus', imageUrl: 'https://i.imgur.com/9X0Oa6E.png', price: 44000, available: 14, humidity: 21 },
      { name: 'Coihue', imageUrl: 'https://i.imgur.com/OhvLQ4A.jpeg', price: 46000, available: 10, humidity: 22 },
      { name: 'Roble', imageUrl: 'https://i.imgur.com/wTYaseS.jpeg', price: 48000, available: 8, humidity: 23 },
      { name: 'Laurel', imageUrl: 'https://i.imgur.com/NxqTEbu.jpeg', price: 50000, available: 5, humidity: 20 },
    ],
  },
];
