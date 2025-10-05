import crypto from "crypto";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const categories = [
  { name: "Camisetas", description: "Camisetas casuais e esportivas" },
  { name: "Shorts", description: "Shorts e bermudas" },
  { name: "Calças", description: "Calças confortáveis e estilosas" },
];

const products = [
  {
    name: "Camiseta Active",
    description: "Camiseta esportiva com tecido respirável.",
    categoryName: "Camisetas",
    variants: [
      { color: "Preta", price: 6999, imageUrl: "https://d4lgxe9bm8juw.cloudfront.net/products/Camisetas/3/d4c0657c_c2c2_4356_a509_61cd9ecc4148.webp" },
      { color: "Branca", price: 6999, imageUrl: "https://d4lgxe9bm8juw.cloudfront.net/products/Camisetas/3/c222d1e5_7cd7_4794_b644_57f47c9d344c.jpg" },
    ],
  },
  {
    name: "Shorts Core",
    description: "Shorts confortável para o dia a dia.",
    categoryName: "Shorts",
    variants: [
      { color: "Preto", price: 5999, imageUrl: "https://d4lgxe9bm8juw.cloudfront.net/products/Bermuda+%26+Shorts/2/a5562ec7_e37a_49db_911b_26dd787463ab.jpg" },
    ],
  },
  {
    name: "Calça Knit",
    description: "Calça de moletom premium.",
    categoryName: "Calças",
    variants: [
      { color: "Cinza", price: 12999, imageUrl: "https://d4lgxe9bm8juw.cloudfront.net/products/Calc%C7%As/2/e5b271dd_1696_4ff0_8cc9_649b45ef2c88.jpg" },
    ],
  },
];

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-");
}

async function main() {
  console.log("🌱 Iniciando seed...");

  await db.productVariant.deleteMany();
  await db.product.deleteMany();
  await db.category.deleteMany();

  const categoryMap = new Map<string, string>();

  for (const cat of categories) {
    const id = crypto.randomUUID();
    const slug = slugify(cat.name);

    const created = await db.category.create({
      data: { id, name: cat.name, slug },
    });
    categoryMap.set(cat.name, created.id);
  }

  for (const p of products) {
    const id = crypto.randomUUID();
    const slug = slugify(p.name);
    const categoryId = categoryMap.get(p.categoryName)!;

    await db.product.create({
      data: {
        id,
        name: p.name,
        slug,
        description: p.description,
        categoryId,
        variants: {
          create: p.variants.map((v) => ({
            id: crypto.randomUUID(),
            name: v.color,
            slug: slugify(`${p.name}-${v.color}`),
            color: v.color,
            priceInCents: v.price,
            imageUrl: v.imageUrl,
          })),
        },
      },
    });
  }

  console.log("✅ Seed concluído com sucesso!");
}

main().finally(() => db.$disconnect());
