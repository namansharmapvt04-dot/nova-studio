import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.project.deleteMany();
  await prisma.stat.deleteMany();

  await prisma.project.createMany({
    data: [
      {
        title: "Luminary Brand Refresh",
        category: "Branding",
        imageUrl: "https://picsum.photos/seed/1/600/400",
      },
      {
        title: "Apex E-Commerce Platform",
        category: "Development",
        imageUrl: "https://picsum.photos/seed/2/600/400",
      },
      {
        title: "Pulse Dashboard UI",
        category: "UI/UX",
        imageUrl: "https://picsum.photos/seed/3/600/400",
      },
      {
        title: "Vertex Marketing Site",
        category: "Web Design",
        imageUrl: "https://picsum.photos/seed/4/600/400",
      },
      {
        title: "Orion Mobile App",
        category: "Development",
        imageUrl: "https://picsum.photos/seed/5/600/400",
      },
      {
        title: "Nova Identity System",
        category: "Branding",
        imageUrl: "https://picsum.photos/seed/6/600/400",
      },
    ],
  });

  await prisma.stat.createMany({
    data: [
      { label: "Projects Completed", value: "150" },
      { label: "Clients Worldwide", value: "50" },
      { label: "Years Experience", value: "5" },
    ],
  });
}

main()
  .catch((e) => {
    process.stderr.write(`${e}\n`);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
