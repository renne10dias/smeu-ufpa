import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class Seed {
  public async saveTypeUser(): Promise<void> {
    const users = [
      {
        uuid: "04fd1c01-64aa-4715-afcf-54e6ff0196fe",
        typeUser: "admin",
      },
      {
        uuid: "12345678-90ab-cdef-1234-567890abcdef",
        typeUser: "employee",
      },
      {
        uuid: "abcdef12-3456-7890-abcd-ef1234567890",
        typeUser: "user",
      },
    ];

    for (const user of users) {
      await prisma.userType.create({
        data: user,
      });
    }
  }

  public async saveShift(): Promise<void> {
    const shifts = [
      {
        uuid: "04fd1c01-64aa-4715-afcf-54e6ff0197fe",
        nameShift: "Manhã",
      },
      {
        uuid: "12345678-90ab-cdef-1234-567891abcdef",
        nameShift: "Tarde",
      },
      {
        uuid: "abcdef12-3456-7890-abcd-ef1334567890",
        nameShift: "Noite",
      },
    ];

    for (const shift of shifts) {
      await prisma.shift.create({
        data: shift,
      });
    }
  }

  public async seedUserAdmin() {
    await prisma.user.create({
      data: {
        uuid: '04fd1c01-64aa-4715-afcf-58e6ff0196fe',
        name: 'Renne',
        surname: 'Farias Dias',
        email: 'rennedias@gmail.com',
        passwordHash: "123",
        activated: true,
        createdAt: new Date(),
        userTypeId: "04fd1c01-64aa-4715-afcf-54e6ff0196fe"
      }
    });
  }
}

const seeder = new Seed();

async function runSeeding() {
  try {
    await seeder.saveTypeUser();
    await seeder.saveShift();
    await seeder.seedUserAdmin();
    console.log("Seeding completed successfully.");
  } catch (e) {
    console.error("Error during seeding:", e);
  } finally {
    await prisma.$disconnect();
  }
}

runSeeding();
