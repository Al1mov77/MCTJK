import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // 1. Create Admin
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
  const adminPass = process.env.ADMIN_PASSWORD || 'securepassword';
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

  // 2. Create Hotels
  const hotels = [
    {
      title: 'MCTJK Grand Plaza',
      description: 'Experience luxury in the heart of Dushanbe with world-class amenities and breathtaking city views.',
      city: 'Dushanbe',
      address: 'Rudaki Ave 15',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=1200',
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1200'
      ]),
      rating: 5.0,
      skills: JSON.stringify(['VIP Services', 'Personal Butler', 'Rooftop Pool', 'Luxury Spa']),
    },
    {
      title: 'Pamir Resort & Spa',
      description: 'A serene mountain retreat offering traditional hospitality and modern comfort.',
      city: 'Khorog',
      address: 'Mountain View Rd 1',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=1200',
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=1200'
      ]),
      rating: 4.8,
      skills: JSON.stringify(['Hiking Tours', 'Mountain Spa', 'Organic Food', 'Yoga Retreat']),
    }
  ];

  for (const hotelData of hotels) {
    const hotel = await prisma.hotel.create({
      data: {
        ...hotelData,
        rooms: {
          create: [
            {
              price: 150.0,
              description: 'Deluxe King Room with City View',
              images: JSON.stringify(['https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&q=80&w=1000']),
            },
            {
              price: 250.0,
              description: 'Presidential Suite',
              images: JSON.stringify(['https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=1000']),
            }
          ]
        }
      }
    });
    console.log(`Created hotel: ${hotel.title}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
