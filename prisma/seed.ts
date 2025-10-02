import { hashPassword } from '../src/common/auth/password';
import prisma from '../src/lib/prismaClient';

async function main() {
  // Seed admin user
  const adminEmail = 'admin@gmail.com';
  const adminUsername = 'admin';
  const adminPassword = 'admin123';

  const hashedPassword = await hashPassword(adminPassword);
  await prisma.user.create({
    data: {
      user_name: adminUsername,
      email: adminEmail,
      password: hashedPassword,
      role: 'Admin',
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
