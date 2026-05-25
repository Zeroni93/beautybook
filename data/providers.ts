export const mockProviders = [
  {
    id: 'barber-1',
    name: 'LV Fade House',
    category: 'Barber',
    location: 'Las Vegas, NV',
    startingPrice: '$25',
    rating: 4.8,
    bio: 'Specializing in classic fades and modern cuts. Over 10 years experience serving the Strip.',
    instagram: 'lvfadehouse',
    services: [
      { name: 'Basic Cut', price: '$25' },
      { name: 'Premium Cut', price: '$40' },
      { name: 'Shave', price: '$15' }
    ],
    gallery: ['/images/sample1.jpg', '/images/sample2.jpg']
  },
  {
    id: 'nail-1',
    name: 'Desert Nails',
    category: 'Nail Tech',
    location: 'Las Vegas, NV',
    startingPrice: '$35',
    rating: 4.6,
    bio: 'Luxury manicures and long-lasting gel services with a modern touch.',
    instagram: 'desertnailslv',
    services: [
      { name: 'Manicure', price: '$35' },
      { name: 'Gel Manicure', price: '$45' }
    ],
    gallery: ['/images/sample3.jpg', '/images/sample4.jpg']
  },
  {
    id: 'barber-2',
    name: 'Strip Cuts',
    category: 'Barber',
    location: 'Las Vegas, NV',
    startingPrice: '$30',
    rating: 4.7,
    bio: 'Quick walk-in friendly cuts with attention to detail.',
    instagram: 'stripcuts',
    services: [
      { name: 'Cut & Style', price: '$30' },
      { name: 'Kid Cut', price: '$20' }
    ],
    gallery: []
  },
  {
    id: 'nail-2',
    name: 'Glam & Glow Nails',
    category: 'Nail Tech',
    location: 'Las Vegas, NV',
    startingPrice: '$40',
    rating: 4.9,
    bio: 'Bringing glam to every set — custom art and premium products.',
    instagram: 'glamglownv',
    services: [
      { name: 'Full Set', price: '$60' },
      { name: 'Fill', price: '$40' }
    ],
    gallery: ['/images/sample5.jpg']
  }
]

export type Provider = typeof mockProviders[number]
export const providers = [
  {
    id: 'barber-1',
    name: 'LV Fade House',
    category: 'Barber',
    startingPrice: '$25'
  },
  {
    id: 'nail-1',
    name: 'Desert Nails',
    category: 'Nail Tech',
    startingPrice: '$35'
  },
  {
    id: 'barber-2',
    name: 'Strip Cuts',
    category: 'Barber',
    startingPrice: '$30'
  },
  {
    id: 'nail-2',
    name: 'Glam & Glow Nails',
    category: 'Nail Tech',
    startingPrice: '$40'
  }
]
