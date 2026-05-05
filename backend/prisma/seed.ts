import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // 1. Create Admin
  const adminEmail = 'admin@example.com';
  const adminPass = 'securepassword';
  const adminPassword = await bcrypt.hash(adminPass, 10);
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      password: adminPassword,
      name: 'MCTJK Admin',
      role: 'ADMIN',
      avatar: null,
    },
  });

  console.log('Admin created:', admin.email);

  // 0. Cleanup existing data
  await prisma.room.deleteMany({});
  await prisma.hotel.deleteMany({});
  console.log('Cleaned up existing hotels and rooms.');

  // 2. Create Hotels
  const hotels = [
    {
      title: 'Royal Resort',
      city: 'Khorog',
      description: 'The ultimate luxury destination in Khorog, featuring majestic mountain views and world-class service.',
      address: 'Pamir Highway 77',
      rating: 5.0,
      skills: JSON.stringify(['Sovereign Access', 'Neural Buffer']),
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1645640929991-867520dce42a?auto=format&fit=crop&q=80&w=1200',
        'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80&w=1200'
      ]),
      rooms: { create: [{ price: 1200, title: 'Royal Suite', description: 'Experience absolute sovereignty.' }] }
    },
    {
      title: 'Silk Road Palace',
      city: 'Khujand',
      description: 'Historical elegance meets modern luxury in the heart of Khujand.',
      address: 'Ismoili Somoni Ave 12',
      rating: 4.9,
      skills: JSON.stringify(['Cultural Tours', 'Buffer Protocol']),
      images: JSON.stringify([
        'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.unsplash.com/photo-1576354302919-96748cb8299e?auto=format&fit=crop&q=80&w=1200'
      ]),
      rooms: { create: [{ price: 950, title: 'Silk Master Suite', description: 'A blend of history and comfort.' }] }
    },
    {
      title: 'Pamir Spa',
      city: 'Istaravshan',
      description: 'Healing waters and serene views in the legendary Pamir mountains.',
      address: 'Health Spring Rd 5',
      rating: 4.8,
      skills: JSON.stringify(['Detox Program', 'Sovereign Wellness']),
      images: JSON.stringify([
        'https://plus.unsplash.com/premium_photo-1687996107318-c4347de0983d?auto=format&fit=crop&q=80&w=1200',
        'https://images.unsplash.com/photo-1597037537523-fbad54b5af44?auto=format&fit=crop&q=80&w=1200'
      ]),
      rooms: { create: [{ price: 1100, title: 'Zenith Spa Suite', description: 'Ultimate relaxation protocol.' }] }
    },
    {
      title: 'Crystal Heights',
      city: 'Dushanbe',
      description: 'Modern glass architecture with a breathtaking view of the city skyline.',
      address: 'Rudaki Ave 101',
      rating: 4.9,
      skills: JSON.stringify(['City View', 'Neural Link']),
      images: JSON.stringify([
        'https://plus.unsplash.com/premium_photo-1661879252375-7c1db1932572?auto=format&fit=crop&q=80&w=1200',
        'https://images.unsplash.com/photo-1629140727571-9b5c6f6267b4?auto=format&fit=crop&q=80&w=1200'
      ]),
      rooms: { create: [{ price: 800, title: 'Sky Suite', description: 'Live above the clouds.' }] }
    },
    {
      title: 'Oasis Sanctuary',
      city: 'Bokhtar',
      description: 'A desert gem offering unparalleled tranquility and luxury pools.',
      address: 'Palm Grove 42',
      rating: 4.7,
      skills: JSON.stringify(['Private Pool', 'Desert Safari']),
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1711059985570-4c32ed12a12c?auto=format&fit=crop&q=80&w=1200',
        'https://plus.unsplash.com/premium_photo-1678297270385-ad5067126607?auto=format&fit=crop&q=80&w=1200'
      ]),
      rooms: { create: [{ price: 650, title: 'Dune Villa', description: 'Your private desert escape.' }] }
    },
    {
      title: 'Nebula Suites',
      city: 'Murghab',
      description: 'Futuristic comfort at high altitude. Stargazing at its finest.',
      address: 'Stellar Way 1',
      rating: 5.0,
      skills: JSON.stringify(['Astro Observatory', 'Oxygen Bar']),
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&q=80&w=1200',
        'https://images.unsplash.com/photo-1667125095636-dce94dcbdd96?auto=format&fit=crop&q=80&w=1200'
      ]),
      rooms: { create: [{ price: 1500, title: 'Cosmic Chamber', description: 'Sleep among the stars.' }] }
    },
    {
      title: 'Golden Horizon',
      city: 'Kulob',
      description: 'Traditional Tajik hospitality wrapped in absolute golden luxury.',
      address: 'Victory Square 8',
      rating: 4.8,
      skills: JSON.stringify(['Heritage Tour', 'Royal Banquet']),
      images: JSON.stringify([
        'https://plus.unsplash.com/premium_photo-1732025157833-223882ed5bde?auto=format&fit=crop&q=80&w=1200',
        'https://images.unsplash.com/photo-1606136944609-5e8ecd4a3c56?auto=format&fit=crop&q=80&w=1200'
      ]),
      rooms: { create: [{ price: 720, title: 'Heritage Room', description: 'Luxury defined by history.' }] }
    },
    {
      title: 'Azure Marina',
      city: 'Nurek',
      description: 'Waterfront luxury with private docks and crystalline lake views.',
      address: 'Dam View Dr 15',
      rating: 4.9,
      skills: JSON.stringify(['Yacht Access', 'Water Sports']),
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1631554668504-79dd66bbfb94?auto=format&fit=crop&q=80&w=1200',
        'https://plus.unsplash.com/premium_photo-1733760125032-8a8b23769a0c?auto=format&fit=crop&q=80&w=1200'
      ]),
      rooms: { create: [{ price: 980, title: 'Lakeside Pavilion', description: 'Serenity by the azure waters.' }] }
    },
    {
      title: 'Velvet Valley',
      city: 'Panjakent',
      description: 'Lush greenery and ancient ruins surround this ultra-modern retreat.',
      address: 'Ancient Path 99',
      rating: 4.7,
      skills: JSON.stringify(['Nature Trail', 'Archaeological Guide']),
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1611444743416-cfb3296540e8?auto=format&fit=crop&q=80&w=1200',
        'https://images.unsplash.com/photo-1663811396969-3cb6b5522ca8?auto=format&fit=crop&q=80&w=1200'
      ]),
      rooms: { create: [{ price: 590, title: 'Garden Studio', description: 'Blend into the valley.' }] }
    },
    {
      title: 'Titanium Tower',
      city: 'Dushanbe',
      description: 'The pinnacle of high-tech living. Voice-controlled everything.',
      address: 'Tech District 4',
      rating: 5.0,
      skills: JSON.stringify(['Smart Home', 'Holographic Concierge']),
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1569297482606-f8738d22a573?auto=format&fit=crop&q=80&w=1200',
        'https://images.unsplash.com/photo-1702984252183-43a5fbc60c48?auto=format&fit=crop&q=80&w=1200'
      ]),
      rooms: { create: [{ price: 2100, title: 'Cyber Penthouse', description: 'Control your world.' }] }
    },
    {
      title: 'Elysium Grove',
      city: 'Hisor',
      description: 'A botanical masterpiece hotel set within a fortress-like garden.',
      address: 'Fortress Gate 2',
      rating: 4.9,
      skills: JSON.stringify(['Botanical Tour', 'Medieval Spa']),
      images: JSON.stringify([
        'https://plus.unsplash.com/premium_photo-1673014202078-2ab12abbb43d?auto=format&fit=crop&q=80&w=1200',
        'https://images.unsplash.com/photo-1689308608308-36c12e3e3fe3?auto=format&fit=crop&q=80&w=1200'
      ]),
      rooms: { create: [{ price: 1050, title: 'Royal Garden Suite', description: 'Sleep in a floral kingdom.' }] }
    },
    {
      title: 'Obsidian Lodge',
      city: 'Ayni',
      description: 'Dark marble luxury in the heart of the rugged mountains.',
      address: 'Black Rock Ridge 11',
      rating: 4.8,
      skills: JSON.stringify(['Mountain Trekking', 'Wine Cellar']),
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&q=80&w=1200',
        'https://images.unsplash.com/photo-1731336478850-6bce7235e320?auto=format&fit=crop&q=80&w=1200'
      ]),
      rooms: { create: [{ price: 880, title: 'Obsidian Suite', description: 'Strength meets elegance.' }] }
    }
  ];

  for (const hotelData of hotels) {
    const { rooms, ...data } = hotelData;
    const hotel = await prisma.hotel.create({
      data: {
        ...data,
        rooms: rooms
      }
    });
    console.log(`Created hotel: ${hotel.title}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
