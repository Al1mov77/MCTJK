import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const result = await prisma.user.updateMany({
    where: {
      name: {
        contains: 'MCTJK'
      }
    },
    data: {
      avatar: null
    }
  });
  console.log(`Updated ${result.count} users.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
