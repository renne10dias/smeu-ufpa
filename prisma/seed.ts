import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class Seed {

  public async saveTypeUser(): Promise<void> {
    const users = [
      {
        id: "04fd1c01-64aa-4715-afcf-54e6ff0196fe",
        typeUser: "admin",
      },
      {
        id: "12345678-90ab-cdef-1234-567890abcdef",
        typeUser: "employee",
      },
      {
        id: "abcdef12-3456-7890-abcd-ef1234567890",
        typeUser: "user",
      },
    ];

    for (const user of users) {
      await prisma.userType.create({
        data: user,
      });
    }
  }

  public  async seedUserAdmin() {
    await prisma.user.create({
        data: {
            id: '04fd1c01-64aa-4715-afcf-54e6ff0196fe',
            name: 'Renne',
            surname: 'Farias Dias',
            email: 'rennedias@gmail.com',
            passwordHash: "123",
            createdAt: new Date,
            userTypeId: "04fd1c01-64aa-4715-afcf-54e6ff0196fe"
        }
    })
}




}

const seeder = new Seed();
seeder.saveTypeUser().catch((e) => {
  console.error(e);
  prisma.$disconnect();
}).finally(() => {
  prisma.$disconnect();
});
