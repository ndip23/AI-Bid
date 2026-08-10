const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

console.log('DATABASE_URL is:', process.env.DATABASE_URL);

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function test() {
  try {
    console.log('Attempting $connect()...');
    await prisma.$connect();
    console.log('Successfully connected to DB!');
    const count = await prisma.user.count();
    console.log('User count:', count);
  } catch (err) {
    console.error('Connection failed:', err);
  } finally {
    await prisma.$disconnect();
  }
}

test();
