import { PrismaClient, Gender, VoiceCategory } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const voices = [
    {
      id: 'default-emma',
      name: 'Emma',
      language: 'en-US',
      gender: Gender.FEMALE,
      accent: 'American',
      ageRange: 'Young',
      category: VoiceCategory.PREMADE,
      isDefault: true,
    },
    {
      id: 'default-james',
      name: 'James',
      language: 'en-GB',
      gender: Gender.MALE,
      accent: 'British',
      ageRange: 'Middle',
      category: VoiceCategory.PREMADE,
      isDefault: true,
    },
    {
      id: 'default-sofia',
      name: 'Sofia',
      language: 'es-ES',
      gender: Gender.FEMALE,
      accent: 'Spanish',
      ageRange: 'Young',
      category: VoiceCategory.PREMADE,
      isDefault: true,
    },
    {
      id: 'default-hassan',
      name: 'Hassan',
      language: 'ur-PK',
      gender: Gender.MALE,
      accent: 'Pakistani',
      ageRange: 'Young',
      category: VoiceCategory.PREMADE,
      isDefault: true,
    },
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
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });