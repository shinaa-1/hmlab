import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const voices = [
    { id: 'default-emma', name: 'Emma', language: 'en-US', gender: 'FEMALE', accent: 'American', ageRange: 'Young', category: 'PREMADE' as const, isDefault: true },
    { id: 'default-james', name: 'James', language: 'en-GB', gender: 'MALE', accent: 'British', ageRange: 'Middle', category: 'PREMADE' as const, isDefault: true },
    { id: 'default-sofia', name: 'Sofia', language: 'es-ES', gender: 'FEMALE', accent: 'Spanish', ageRange: 'Young', category: 'PREMADE' as const, isDefault: true },
    { id: 'default-hassan', name: 'Hassan', language: 'ur-PK', gender: 'MALE', accent: 'Pakistani', ageRange: 'Young', category: 'PREMADE' as const, isDefault: true },
  ];

  for (const voice of voices) {
    await prisma.voice.upsert({
      where: { id: voice.id },
      update: {},
      create: voice,
    });
  }

  console.log('✅ Seed complete: 4 default voices added');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
