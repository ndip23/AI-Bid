const { PrismaClient } = require('@prisma/client');

const passwords = ['postgres', 'postgrespassword2026', 'root', 'admin', '', '123456', 'password'];

async function testPass() {
  for (const pass of passwords) {
    const url = `postgresql://postgres:${pass}@localhost:5432/postgres?schema=public`;
    const prisma = new PrismaClient({
      datasources: {
        db: { url }
      }
    });
    try {
      await prisma.$connect();
      console.log('SUCCESS with password:', pass);
      await prisma.$disconnect();
      return pass;
    } catch (e) {
      console.log('Failed password:', pass, e.message);
      await prisma.$disconnect();
    }
  }
}

testPass();
