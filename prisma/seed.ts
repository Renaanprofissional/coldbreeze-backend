import crypto from "crypto";
import { PrismaClient, DiscountType } from "@prisma/client";

const db = new PrismaClient();

// ========================
// 🧊 Dados base
// ========================
const categories = [
  { name: "Camisetas", description: "Camisetas casuais e esportivas" },
  { name: "Shorts", description: "Shorts e bermudas" },
  { name: "Calças", description: "Calças confortáveis e estilosas" },
];

const products = [
  {
    name: "Camiseta Adidas",
    description: "Cold Breeze",
    categoryName: "Camisetas",
    variants: [
      {
        color: "Vermelha",
        price: 5999,
        imageUrl:
          "https://res.cloudinary.com/dgqjzpown/image/upload/v1760785853/CB_Adidas_ysy8xb.jpg",
      },
      {
        color: "Branca",
        price: 5999,
        imageUrl:
          "https://res.cloudinary.com/dgqjzpown/image/upload/v1760785849/CB_Adidas_azul_uwevmm.jpg",
      },
    ],
  },
  {
    name: "Quick Silver",
    description: "Cold Breeze",
    categoryName: "Camisetas",
    variants: [
      {
        color: "Branco",
        price: 5999,
        imageUrl:
          "https://res.cloudinary.com/dgqjzpown/image/upload/v1760785858/CB_Quick_Silver_2_aivw4s.jpg",
      },
    ],
  },
  {
    name: "Nike",
    description: "Cold Breeze",
    categoryName: "Camisetas",
    variants: [
      {
        color: "Preto",
        price: 5999,
        imageUrl:
          "https://res.cloudinary.com/dgqjzpown/image/upload/v1760785858/CB_Nike_sqydfm.jpg",
      },
    ],
  },
  {
    name: "High",
    description: "Cold Breeze",
    categoryName: "Camisetas",
    variants: [
      {
        color: "Vermelho",
        price: 5999,
        imageUrl:
          "https://res.cloudinary.com/dgqjzpown/image/upload/v1760785856/CB_High_enax7p.jpg",
      },
    ],
  },
  {
    name: "Hurley",
    description: "Cold Breeze",
    categoryName: "Camisetas",
    variants: [
      {
        color: "Bege",
        price: 5999,
        imageUrl:
          "https://res.cloudinary.com/dgqjzpown/image/upload/v1760785855/CB_Hurley_doomjv.jpg",
      },
    ],
  },
  {
    name: "Oakley",
    description: "Cold Breeze",
    categoryName: "Camisetas",
    variants: [
      {
        color: "Branco",
        price: 5999,
        imageUrl:
          "https://res.cloudinary.com/dgqjzpown/image/upload/v1760785849/CB_Oakley_branca_gbxarj.jpg",
      },
      {
        color: "Bege",
        price: 5999,
        imageUrl:
          "https://res.cloudinary.com/dgqjzpown/image/upload/v1760785854/CB_Oakley_nldfwu.jpg",
      },
    ],
  },
  {
    name: "Oakley",
    description: "Cold Breeze",
    categoryName: "Camisetas",
    variants: [
      {
        color: "Azul",
        price: 5999,
        imageUrl:
          "https://res.cloudinary.com/dgqjzpown/image/upload/v1760785852/CB_Oakley_2_bmikzp.jpg",
      },
      {
        color: "Vermelho",
        price: 5999,
        imageUrl:
          "https://res.cloudinary.com/dgqjzpown/image/upload/v1760785849/CB_Oakley_3_ys6h38.jpg",
      },
    ],
  },
  {
    name: "Tony Country",
    description: "Cold Breeze",
    categoryName: "Camisetas",
    variants: [
      {
        color: "Preto",
        price: 5999,
        imageUrl:
          "https://res.cloudinary.com/dgqjzpown/image/upload/v1760785852/CB_Tony_Country_hb0u3o.jpg",
      },
    ],
  },
  {
    name: "Quick Silver",
    description: "Cold Breeze",
    categoryName: "Camisetas",
    variants: [
      {
        color: "Cinza",
        price: 5999,
        imageUrl:
          "https://res.cloudinary.com/dgqjzpown/image/upload/v1760785852/CB_Quick_Silver_3_jctomn.jpg",
      },
    ],
  },
  {
    name: "Quick Silver",
    description: "Cold Breeze",
    categoryName: "Camisetas",
    variants: [
      {
        color: "Branco",
        price: 5999,
        imageUrl:
          "https://res.cloudinary.com/dgqjzpown/image/upload/v1760785849/CB_Quick_Silver_4_va3iln.jpg",
      },
    ],
  },
  {
    name: "Nike",
    description: "Cold Breeze",
    categoryName: "Camisetas",
    variants: [
      {
        color: "Branco",
        price: 5999,
        imageUrl:
          "https://res.cloudinary.com/dgqjzpown/image/upload/v1760785849/CB_Nike_2_tcne05.jpg",
      },
    ],
  },
  {
    name: "Hang Loose",
    description: "Cold Breeze",
    categoryName: "Camisetas",
    variants: [
      {
        color: "Azul",
        price: 5999,
        imageUrl:
          "https://res.cloudinary.com/dgqjzpown/image/upload/v1760785849/CB_Maozinha_cajss3.jpg",
      },
    ],
  },
  {
    name: "Diesel",
    description: "Cold Breeze",
    categoryName: "Camisetas",
    variants: [
      {
        color: "Bege",
        price: 5999,
        imageUrl:
          "https://res.cloudinary.com/dgqjzpown/image/upload/v1760785849/CB_Diesel_vlcaky.jpg",
      },
    ],
  },
  {
    name: "Quick Silver",
    description: "Cold Breeze",
    categoryName: "Camisetas",
    variants: [
      {
        color: "Preto",
        price: 5999,
        imageUrl:
          "https://res.cloudinary.com/dgqjzpown/image/upload/v1760783545/CB_Quick_Silver_zb00rv.jpg",
      },
    ],
  },
];

// ========================
// 🧾 Cupons
// ========================
const coupons = [
  {
    code: "COLD10",
    description: "10% OFF em toda loja",
    discountType: DiscountType.PERCENT,
    discountValue: 10,
    active: true,
  },
  {
    code: "PRIMEIRACOMPRA",
    description: "Desconto fixo de R$15,00 (frete grátis)",
    discountType: DiscountType.FIXED,
    discountValue: 1500,
    active: true,
  },
  {
    code: "VIP30",
    description: "30% OFF exclusivo para clientes VIP",
    discountType: DiscountType.PERCENT,
    discountValue: 30,
    active: true,
  },
];

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-");
}

// ========================
// 🚀 Execução principal
// ========================
async function main() {
  console.log("🌱 Iniciando seed...");

  // Limpeza de dados antigos
  await db.productVariant.deleteMany();
  await db.product.deleteMany();
  await db.category.deleteMany();
  await db.coupon.deleteMany();

  // Criação de categorias
  const categoryMap = new Map<string, string>();
  for (const cat of categories) {
    const id = crypto.randomUUID();
    const slug = slugify(cat.name);
    const created = await db.category.create({
      data: { id, name: cat.name, slug },
    });
    categoryMap.set(cat.name, created.id);
  }

  // Criação de produtos com slugs únicos
  const usedSlugs = new Set<string>();

  for (const p of products) {
    const id = crypto.randomUUID();
    let baseSlug = slugify(p.name);
    let slug = baseSlug;
    const categoryId = categoryMap.get(p.categoryName)!;

    // 🔹 Garante unicidade de slug
    let counter = 1;
    while (usedSlugs.has(slug)) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    usedSlugs.add(slug);

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
            slug: slugify(`${p.name}-${v.color}-${counter}`),
            color: v.color,
            priceInCents: v.price,
            imageUrl: v.imageUrl,
          })),
        },
      },
    });
  }

  // Cupons
  await db.coupon.createMany({ data: coupons });

  console.log("✅ Seed concluído com sucesso!");
}

main()
  .catch((err) => {
    console.error("❌ Erro no seed:", err);
  })
  .finally(() => db.$disconnect());
