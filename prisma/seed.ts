import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const data = [
  { name: "Supino reto com barra" },
  { name: "Supino inclinado com halter" },
  { name: "Crucifixo" },
  { name: "Desenvolvimento com halter" },
  { name: "Levantamento lateral" },
  { name: "Tríceps corda" },
  { name: "Remada baixa" },
  { name: "Puxada" },
  { name: "Bíceps com barra W" },
  { name: "Barra fixa pegada neutra" },
  { name: "Extensão de ombro" },
  { name: "Leg press" },
  { name: "Agachamento" },
  { name: "Cadeira extensora" },
  { name: "Cadeira flexora" },
  { name: "Agachamento búlgaro" },
];

async function main() {
  let exercises = await prisma.exercise.findMany();
  if (exercises.length === 0) {
    await prisma.exercise.createMany({
      data,
    });
  }

  console.log({ data });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
