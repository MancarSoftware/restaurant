import { PrismaClient, UserRole } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

function futureDate(days: number) {
  const date = new Date();
  date.setUTCHours(0, 0, 0, 0);
  date.setUTCDate(date.getUTCDate() + days);
  return date;
}

async function main() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "admin@casabruma.local";
  const adminPassword =
    process.env.SEED_ADMIN_PASSWORD ?? "ChangeMe-Local-2026!";

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: "Administración Casa Bruma",
      role: UserRole.ADMIN,
      passwordHash: await hash(adminPassword, 12),
    },
  });

  const restaurant = await prisma.restaurant.upsert({
    where: { id: "00000000-0000-4000-8000-000000000001" },
    update: {},
    create: {
      id: "00000000-0000-4000-8000-000000000001",
      name: "Casa Bruma",
      tagline: "Ecuador, contado a fuego lento.",
      description:
        "Una casa de cocina ecuatoriana contemporánea donde el manglar, la montaña y el fuego comparten la misma mesa.",
      phone: "+593 4 600 1842",
      whatsapp: "+593 99 840 1260",
      email: "mesa@casabruma.ec",
      address: "Av. del Bombero 481, Los Ceibos",
      city: "Guayaquil",
      country: "Ecuador",
      latitude: -2.168126,
      longitude: -79.921726,
      instagramUrl: "https://instagram.com/casabruma",
      facebookUrl: "https://facebook.com/casabruma",
      reservationLeadHours: 2,
      maxPartySize: 12,
      reservationDuration: 120,
    },
  });

  const hours = [
    { dayOfWeek: 0, isClosed: true, openTime: null, closeTime: null },
    { dayOfWeek: 1, isClosed: true, openTime: null, closeTime: null },
    { dayOfWeek: 2, isClosed: false, openTime: "19:00", closeTime: "23:00" },
    { dayOfWeek: 3, isClosed: false, openTime: "19:00", closeTime: "23:00" },
    { dayOfWeek: 4, isClosed: false, openTime: "19:00", closeTime: "23:00" },
    { dayOfWeek: 5, isClosed: false, openTime: "19:00", closeTime: "23:30" },
    { dayOfWeek: 6, isClosed: false, openTime: "13:00", closeTime: "23:30" },
  ];

  for (const hour of hours) {
    await prisma.openingHour.upsert({
      where: {
        restaurantId_dayOfWeek: {
          restaurantId: restaurant.id,
          dayOfWeek: hour.dayOfWeek,
        },
      },
      update: hour,
      create: { restaurantId: restaurant.id, ...hour },
    });
  }

  const categories = [
    {
      name: "Primeros paisajes",
      slug: "primeros-paisajes",
      description: "Bocados que abren el territorio.",
      displayOrder: 1,
    },
    {
      name: "Mar y manglar",
      slug: "mar-y-manglar",
      description: "El Pacífico en estado presente.",
      displayOrder: 2,
    },
    {
      name: "Tierra y fuego",
      slug: "tierra-y-fuego",
      description: "Cocciones lentas, humo y profundidad.",
      displayOrder: 3,
    },
    {
      name: "Dulce memoria",
      slug: "dulce-memoria",
      description: "Cacao, frutas y recuerdos del Ecuador.",
      displayOrder: 4,
    },
    {
      name: "Copa y fermento",
      slug: "copa-y-fermento",
      description: "Vinos, cócteles y bebidas de la casa.",
      displayOrder: 5,
    },
  ];

  const categoryMap = new Map<string, string>();
  for (const category of categories) {
    const saved = await prisma.menuCategory.upsert({
      where: { slug: category.slug },
      update: category,
      create: category,
    });
    categoryMap.set(saved.slug, saved.id);
  }

  const tags = [
    { name: "Vegetariano", slug: "vegetariano" },
    { name: "Vegano", slug: "vegano" },
    { name: "Sin gluten", slug: "sin-gluten" },
    { name: "Picante", slug: "picante" },
    { name: "Contiene frutos secos", slug: "frutos-secos" },
  ];
  const tagMap = new Map<string, string>();
  for (const tag of tags) {
    const saved = await prisma.dietaryTag.upsert({
      where: { slug: tag.slug },
      update: tag,
      create: tag,
    });
    tagMap.set(saved.slug, saved.id);
  }

  const items = [
    {
      name: "Corvina, cacao y maduro",
      slug: "corvina-cacao-maduro",
      description:
        "Corvina costrada, mole de cacao nacional, maduro al carbón y hierbas de altura.",
      price: 32,
      category: "mar-y-manglar",
      imageUrl: "/images/hero-fish.webp",
      featured: true,
      chefRecommended: true,
      dietaryTags: ["sin-gluten"],
    },
    {
      name: "Pulpo de roca y maní",
      slug: "pulpo-roca-mani",
      description:
        "Pulpo a la brasa, crema de maní tostado, encurtido de sambo y aceite de achiote.",
      price: 24,
      category: "primeros-paisajes",
      featured: true,
      dietaryTags: ["sin-gluten", "frutos-secos"],
    },
    {
      name: "Res de páramo",
      slug: "res-paramo",
      description:
        "Lomo fino en costra de hierbas, papas nativas, cebolla ahumada y reducción de mortiño.",
      price: 38,
      category: "tierra-y-fuego",
      imageUrl: "/images/beef-dish.webp",
      featured: true,
      chefRecommended: true,
      dietaryTags: ["sin-gluten"],
    },
    {
      name: "Arroz de hongos y trufa de cacao",
      slug: "arroz-hongos-trufa-cacao",
      description:
        "Arroz meloso de cebada, hongos andinos, queso maduro y trufa negra de cacao.",
      price: 26,
      category: "tierra-y-fuego",
      seasonal: true,
      dietaryTags: ["vegetariano"],
    },
    {
      name: "Yuca, coco y ají",
      slug: "yuca-coco-aji",
      description:
        "Yuca crocante, emulsión de coco, ají fermentado y hojas frescas.",
      price: 16,
      category: "primeros-paisajes",
      dietaryTags: ["vegano", "sin-gluten", "picante"],
    },
    {
      name: "Cacao de origen",
      slug: "cacao-origen",
      description:
        "Fondant de cacao 70%, sal de mar, uvilla y helado de hoja de higo.",
      price: 14,
      category: "dulce-memoria",
      featured: true,
      dietaryTags: ["vegetariano"],
    },
    {
      name: "Niebla de naranjilla",
      slug: "niebla-naranjilla",
      description:
        "Naranjilla, hierba luisa, espumante seco y cordial de cacao blanco.",
      price: 15,
      category: "copa-y-fermento",
      seasonal: true,
      dietaryTags: ["vegano", "sin-gluten"],
    },
    {
      name: "Fermento del jardín",
      slug: "fermento-jardin",
      description:
        "Kombucha de cedrón, toronja, albahaca amazónica y sal mineral.",
      price: 8,
      category: "copa-y-fermento",
      dietaryTags: ["vegano", "sin-gluten"],
    },
  ];

  for (const [index, item] of items.entries()) {
    const dietaryTagIds = item.dietaryTags.map((slug) => ({
      id: tagMap.get(slug)!,
    }));
    await prisma.menuItem.upsert({
      where: { slug: item.slug },
      update: {
        name: item.name,
        description: item.description,
        price: item.price,
        categoryId: categoryMap.get(item.category)!,
        imageUrl: item.imageUrl,
        featured: item.featured ?? false,
        seasonal: item.seasonal ?? false,
        chefRecommended: item.chefRecommended ?? false,
        displayOrder: index + 1,
        dietaryTags: { set: dietaryTagIds },
      },
      create: {
        name: item.name,
        slug: item.slug,
        description: item.description,
        price: item.price,
        categoryId: categoryMap.get(item.category)!,
        imageUrl: item.imageUrl,
        featured: item.featured ?? false,
        seasonal: item.seasonal ?? false,
        chefRecommended: item.chefRecommended ?? false,
        displayOrder: index + 1,
        dietaryTags: { connect: dietaryTagIds },
      },
    });
  }

  const gallery = [
    {
      title: "Fuego de la casa",
      category: "Espacio",
      imageUrl: "/images/restaurant-interior.webp",
      altText: "Comedor íntimo de Casa Bruma iluminado por una chimenea",
      displayOrder: 1,
    },
    {
      title: "Corvina y cacao",
      category: "Platos",
      imageUrl: "/images/hero-fish.webp",
      altText: "Corvina costrada servida con cacao y maduro",
      displayOrder: 2,
    },
    {
      title: "El gesto final",
      category: "Cocina",
      imageUrl: "/images/chef-valentina.webp",
      altText: "Chef Valentina Cedeño terminando un plato en la cocina",
      displayOrder: 3,
    },
    {
      title: "Tierra alta",
      category: "Platos",
      imageUrl: "/images/beef-dish.webp",
      altText: "Lomo de res con papas nativas y cebolla asada",
      displayOrder: 4,
    },
  ];
  for (const image of gallery) {
    const existing = await prisma.galleryImage.findFirst({
      where: { title: image.title },
    });
    if (!existing) await prisma.galleryImage.create({ data: image });
  }

  const events = [
    {
      title: "Cena de la luna nueva",
      slug: "cena-luna-nueva",
      description:
        "Un menú de siete tiempos guiado por ingredientes nocturnos, fuego y fermentos de temporada.",
      eventDate: futureDate(28),
      startTime: "19:30",
      imageUrl: "/images/restaurant-interior.webp",
      location: "Mesa del Fuego · Casa Bruma",
      capacity: 18,
    },
    {
      title: "Cacao, sal y vino",
      slug: "cacao-sal-vino",
      description:
        "Maridaje íntimo junto a productores de cacao nacional y una selección de vinos de mínima intervención.",
      eventDate: futureDate(61),
      startTime: "20:00",
      imageUrl: "/images/hero-fish.webp",
      location: "Salón Bruma",
      capacity: 24,
    },
  ];
  for (const event of events) {
    await prisma.event.upsert({
      where: { slug: event.slug },
      update: event,
      create: event,
    });
  }

  console.log(`Seed complete. Development admin: ${adminEmail}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => prisma.$disconnect());
