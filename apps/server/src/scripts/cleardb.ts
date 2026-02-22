import { prisma } from "../lib/prisma";

async function main() {
  console.log("Clearing existing data...");
  await prisma.employee.deleteMany();

  console.log("Data cleared");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });