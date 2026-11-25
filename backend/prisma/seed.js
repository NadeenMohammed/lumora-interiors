import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const count = await prisma.project.count();
  if (count === 0) {
    await prisma.project.createMany({
      data: [
        {
          id: 'katameya-dunes-villa',
          title: 'Katameya Dunes Residence',
          category: 'Residential',
          location: 'New Cairo, Egypt',
          area: '740 sqm',
          year: '2026',
          image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1400&q=80',
          gallery: JSON.stringify([
            'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80'
          ]),
          summary: 'Full architectural interior overhaul featuring travertine stone walls, custom walnut millwork, and warm indirect lighting.',
          challenge: 'Transforming a cavernous concrete shell into an intimate family sanctuary without sacrificing double height openness.',
          outcome: 'Delivered 3 weeks ahead of schedule with bespoke acoustic zoning and seamless indoor garden sightlines.'
        },
        {
          id: 'cairo-capital-hq',
          title: 'Vanguard Financial Headquarters',
          category: 'Commercial',
          location: 'Fifth Settlement, New Cairo',
          area: '1,180 sqm',
          year: '2026',
          image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1400&q=80',
          gallery: JSON.stringify([
            'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80'
          ]),
          summary: 'Executive suites, acoustic boardrooms, and client hospitality lounges built for a regional investment firm.',
          challenge: 'Balancing strict acoustic privacy for 42 executive offices with natural daylight penetration across the floorplate.',
          outcome: 'Reduced ambient office noise by 38% using custom fluted oak panels and double glazed bronze partitions.'
        },
        {
          id: 'mivida-courtyard-home',
          title: 'Mivida Courtyard Villa',
          category: 'Residential',
          location: 'New Cairo, Egypt',
          area: '580 sqm',
          year: '2025',
          image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1400&q=80',
          gallery: JSON.stringify([
            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80'
          ]),
          summary: 'Minimalist limestone and brushed brass interior architecture designed around a central landscaped courtyard.',
          challenge: 'Unifying fragmented ground floor rooms into a cohesive entertaining and daily living layout.',
          outcome: 'Increased usable living footprint by 24% through concealed structural steel beams and custom pocket doors.'
        },
        {
          id: 'zamalek-atelier-boutique',
          title: 'Maison Solis Flagship',
          category: 'Commercial',
          location: 'Zamalek, Cairo',
          area: '310 sqm',
          year: '2025',
          image: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=1400&q=80',
          gallery: JSON.stringify([
            'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=1200&q=80'
          ]),
          summary: 'Gallery inspired retail flagship crafted from hand troweled lime plaster, travertine plinths, and warm spotlighting.',
          challenge: 'Showcasing high jewelry and couture pieces inside a heritage building with strict structural constraints.',
          outcome: 'Freestanding architectural display volumes preserved original moldings while lifting dwell time by 41%.'
        }
      ]
    });
  }

  const consultCount = await prisma.consultation.count();
  if (consultCount === 0) {
    await prisma.consultation.create({
      data: {
        fullName: 'Omar El Shazly',
        email: 'omar.shazly@example.com',
        phone: '+20 100 442 8891',
        projectType: 'Residential Villa',
        location: 'Swan Lake, New Cairo',
        budget: 'EGP 3M – 6M',
        size: '650 sqm',
        preferredDate: '2026-12-03',
        details: 'Looking for full turnkey interior architecture and landscape integration.',
        status: 'New'
      }
    });
  }

  const msgCount = await prisma.contactMessage.count();
  if (msgCount === 0) {
    await prisma.contactMessage.create({
      data: {
        fullName: 'Salma Hegazy',
        email: 'salma.hegazy@example.com',
        phone: '+20 109 882 1104',
        subject: 'Commercial Showroom Inquiry',
        message: 'We are opening a 280 sqm flagship gallery in New Cairo and would like to discuss concept design timelines.',
        status: 'Unread'
      }
    });
  }
}

main()
  .then(() => console.log('Database seeded successfully'))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
