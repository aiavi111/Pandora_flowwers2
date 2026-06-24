const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌹 Seeding Pandora Flowers database...');

  // Admin user
  const hashedAdminPassword = await bcrypt.hash('PandoraAdmin2024!', 12);
  await prisma.adminUser.upsert({
    where: { email: 'admin@pandora-flowers.kg' },
    update: {},
    create: {
      email: 'admin@pandora-flowers.kg',
      password: hashedAdminPassword,
      name: 'Администратор',
      role: 'owner',
    },
  });

  await prisma.adminUser.upsert({
    where: { email: 'manager@pandora-flowers.kg' },
    update: {},
    create: {
      email: 'manager@pandora-flowers.kg',
      password: await bcrypt.hash('Manager2024!', 12),
      name: 'Менеджер',
      role: 'manager',
    },
  });

  // Categories
  const categories = [
    { name: 'Розы',           slug: 'roses',      description: 'Классические розы на любой случай', imageUrl: 'https://images.unsplash.com/photo-1518895312237-a9e23508077d?w=400&q=80', sortOrder: 1 },
    { name: 'Пионы',          slug: 'peonies',    description: 'Роскошные пионы — символ любви', imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80', sortOrder: 2 },
    { name: 'Авторские букеты', slug: 'bouquets', description: 'Уникальные авторские композиции', imageUrl: 'https://images.unsplash.com/photo-1490750967868-88df5691cc1e?w=400&q=80', sortOrder: 3 },
    { name: 'Тюльпаны',       slug: 'tulips',     description: 'Свежие тюльпаны всех оттенков', imageUrl: 'https://images.unsplash.com/photo-1520763185298-1b434c919102?w=400&q=80', sortOrder: 4 },
    { name: 'Монобукеты',     slug: 'mono',       description: 'Изысканные монобукеты из одного вида цветов', imageUrl: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=400&q=80', sortOrder: 5 },
    { name: 'Подарки',        slug: 'gifts',      description: 'Шоколад, игрушки, шары и подарочные наборы', imageUrl: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400&q=80', sortOrder: 6 },
    { name: 'Свадебные',      slug: 'wedding',    description: 'Букеты невесты и свадебный декор', imageUrl: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&q=80', sortOrder: 7 },
    { name: 'Хризантемы',     slug: 'chrysanthemums', description: 'Пышные хризантемы для особых дат', imageUrl: 'https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=400&q=80', sortOrder: 8 },
  ];

  const createdCategories: Record<string, { id: string }> = {};
  for (const cat of categories) {
    const c = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    createdCategories[cat.slug] = c;
  }

  // Products
  const products = [
    // ROSES
    {
      name: 'Страсть — 25 красных роз',
      slug: 'passion-25-red-roses',
      description: 'Классический букет из 25 бархатистых красных роз сорта Explorer. Каждый бутон идеально раскрыт, длина стебля 60 см. Оформлен в фирменную упаковку Pandora с лентой ручной работы.',
      composition: '25 роз сорта Explorer (красный), зелень питоспорум, упаковка крафт + атласная лента',
      price: 4500,
      categorySlug: 'roses',
      size: 'medium',
      colors: 'red',
      flowers: 'rose',
      occasion: 'birthday,anniversary,romance',
      isPopular: true,
      isFeatured: true,
      images: [
        'https://images.unsplash.com/photo-1548094990-c16ca90f1f0d?w=800&q=90',
        'https://images.unsplash.com/photo-1518895312237-a9e23508077d?w=800&q=90',
        'https://images.unsplash.com/photo-1453728013993-6d66e9c9123a?w=800&q=90',
      ],
    },
    {
      name: 'Монако — 51 роза микс',
      slug: 'monaco-51-mixed-roses',
      description: 'Роскошный букет из 51 розы в нежной цветовой гамме: белые, кремовые и персиковые оттенки. Создан нашими флористами специально для тех, кто ценит изысканность.',
      composition: '51 роза (белая 17 + кремовая 17 + персиковая 17), эвкалипт, рафия',
      price: 8900,
      oldPrice: 10500,
      categorySlug: 'roses',
      size: 'large',
      colors: 'white,cream,peach',
      flowers: 'rose',
      occasion: 'birthday,anniversary,wedding,romance',
      isPopular: true,
      isFeatured: true,
      images: [
        'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=800&q=90',
        'https://images.unsplash.com/photo-1490750967868-88df5691cc1e?w=800&q=90',
      ],
    },
    {
      name: 'Вечность — 101 роза',
      slug: 'eternity-101-roses',
      description: 'Величественный букет из 101 красной розы. Символ безграничной любви и преданности. Каждый цветок отборный, длина стебля 70 см.',
      composition: '101 роза сорта Freedom (красный), длина 70 см, упаковка люкс',
      price: 18500,
      categorySlug: 'roses',
      size: 'xl',
      colors: 'red',
      flowers: 'rose',
      occasion: 'anniversary,romance,wedding',
      isPopular: false,
      isFeatured: true,
      images: [
        'https://images.unsplash.com/photo-1523301551780-cd17359a95d0?w=800&q=90',
        'https://images.unsplash.com/photo-1518895312237-a9e23508077d?w=800&q=90',
      ],
    },
    {
      name: 'Нежность — 15 белых роз',
      slug: 'tenderness-15-white-roses',
      description: 'Утончённый букет из 15 белоснежных роз сорта Avalanche. Воплощение чистоты и элегантности, подходит для любого торжества.',
      composition: '15 роз сорта Avalanche (белый), зелень, упаковка с лентой',
      price: 2800,
      categorySlug: 'roses',
      size: 'small',
      colors: 'white',
      flowers: 'rose',
      occasion: 'birthday,anniversary,condolence,wedding',
      isPopular: true,
      images: [
        'https://images.unsplash.com/photo-1487530811015-780780169b7a?w=800&q=90',
        'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=800&q=90',
      ],
    },
    {
      name: 'Розовая мечта — 35 роз',
      slug: 'pink-dream-35-roses',
      description: 'Трогательный букет из 35 нежно-розовых роз сорта Dolce Vita. Идеален для дня рождения, признания в любви и поздравлений.',
      composition: '35 роз сорта Dolce Vita (нежно-розовый), гипсофила, лента',
      price: 6200,
      categorySlug: 'roses',
      size: 'medium',
      colors: 'pink',
      flowers: 'rose',
      occasion: 'birthday,romance',
      isPopular: true,
      images: [
        'https://images.unsplash.com/photo-1533616688419-b7a585564566?w=800&q=90',
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=90',
      ],
    },
    // PEONIES
    {
      name: 'Пионовый рай — 15 пионов',
      slug: 'peony-paradise-15',
      description: 'Роскошные пионы сорта Sarah Bernhardt — пышные, ароматные, идеальные. Каждый бутон — произведение искусства. Доступны с мая по июль.',
      composition: '15 пионов сорта Sarah Bernhardt (розовый), зелень, упаковка Pandora',
      price: 5500,
      categorySlug: 'peonies',
      size: 'medium',
      colors: 'pink',
      flowers: 'peony',
      occasion: 'birthday,anniversary,romance',
      isPopular: true,
      isFeatured: true,
      images: [
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=90',
        'https://images.unsplash.com/photo-1490750967868-88df5691cc1e?w=800&q=90',
      ],
    },
    {
      name: 'Французский шик — 25 пионов',
      slug: 'french-chic-25-peonies',
      description: 'Великолепный букет из 25 белых пионов. Чистота, роскошь и аромат лета в каждом лепестке. Идеален для свадеб и особых событий.',
      composition: '25 пионов (белый/кремовый), ароматные сорта, рафия',
      price: 9500,
      categorySlug: 'peonies',
      size: 'large',
      colors: 'white,cream',
      flowers: 'peony',
      occasion: 'wedding,anniversary',
      isPopular: false,
      images: [
        'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=800&q=90',
        'https://images.unsplash.com/photo-1487530811015-780780169b7a?w=800&q=90',
      ],
    },
    // AUTHOR BOUQUETS
    {
      name: 'Pandora Secret — авторский',
      slug: 'pandora-secret',
      description: 'Наш флагманский авторский букет. Уникальная композиция из роз, эустомы и пионов в пудровой гамме. Оформление — фирменная коробка Pandora с шоколадом в подарок.',
      composition: 'Розы Juliet (15 шт), эустома (7 шт), пионы (5 шт), эвкалипт, фирменная коробка',
      price: 12000,
      oldPrice: 14000,
      categorySlug: 'bouquets',
      size: 'large',
      colors: 'pink,peach,cream',
      flowers: 'rose,eustoma,peony',
      occasion: 'birthday,anniversary,romance,wedding',
      isPopular: true,
      isFeatured: true,
      isNew: true,
      images: [
        'https://images.unsplash.com/photo-1490750967868-88df5691cc1e?w=800&q=90',
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=90',
        'https://images.unsplash.com/photo-1518895312237-a9e23508077d?w=800&q=90',
      ],
    },
    {
      name: 'Ботанический сад — авторский',
      slug: 'botanical-garden',
      description: 'Богатая природная композиция с полевыми цветами, ранункулюсами и зеленью. Для тех, кто ценит натуральную красоту и нестандартные решения.',
      composition: 'Ранункулюс (10 шт), пшеница, сухоцветы, зелень, полевые цветы, натуральная упаковка',
      price: 7800,
      categorySlug: 'bouquets',
      size: 'large',
      colors: 'yellow,orange,green',
      flowers: 'ranunculus,dried',
      occasion: 'birthday,housewarming',
      isPopular: true,
      images: [
        'https://images.unsplash.com/photo-1533616688419-b7a585564566?w=800&q=90',
        'https://images.unsplash.com/photo-1490750967868-88df5691cc1e?w=800&q=90',
      ],
    },
    {
      name: 'Лунный свет — белый авторский',
      slug: 'moonlight-white-author',
      description: 'Монохромный белый авторский букет — ромашки, белые розы, гортензия и орхидея. Максимальная элегантность в минималистичном исполнении.',
      composition: 'Розы (10 шт), гортензия (2 шт), орхидея дендробиум, ромашки, эвкалипт',
      price: 9200,
      categorySlug: 'bouquets',
      size: 'large',
      colors: 'white',
      flowers: 'rose,hydrangea,orchid,daisy',
      occasion: 'wedding,anniversary,birthday',
      isPopular: false,
      isNew: true,
      images: [
        'https://images.unsplash.com/photo-1487530811015-780780169b7a?w=800&q=90',
        'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=800&q=90',
      ],
    },
    // TULIPS
    {
      name: 'Весенний привет — 25 тюльпанов',
      slug: 'spring-hello-25-tulips',
      description: 'Яркий весенний букет из 25 отборных тюльпанов. Идеален для 8 Марта, Наурыза и дней рождения весной.',
      composition: '25 тюльпанов (микс: красный, жёлтый, розовый), упаковка крафт',
      price: 3200,
      categorySlug: 'tulips',
      size: 'medium',
      colors: 'red,yellow,pink',
      flowers: 'tulip',
      occasion: 'birthday,march8,holiday',
      isPopular: true,
      images: [
        'https://images.unsplash.com/photo-1520763185298-1b434c919102?w=800&q=90',
        'https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=800&q=90',
      ],
    },
    {
      name: 'Голландия — 51 тюльпан',
      slug: 'holland-51-tulips',
      description: 'Грандиозный букет из 51 тюльпана в нежно-розовой и сиреневой гамме. Подарок, который невозможно забыть.',
      composition: '51 тюльпан (розовый + сиреневый), зелень, упаковка премиум',
      price: 5800,
      categorySlug: 'tulips',
      size: 'large',
      colors: 'pink,lilac',
      flowers: 'tulip',
      occasion: 'birthday,anniversary,romance',
      isPopular: false,
      images: [
        'https://images.unsplash.com/photo-1520763185298-1b434c919102?w=800&q=90',
      ],
    },
    // MONO BOUQUETS
    {
      name: 'Орхидея — Нежность',
      slug: 'orchid-tenderness',
      description: 'Элегантный монобукет из белых орхидей Фаленопсис. Изысканный подарок для особых людей. Символ роскоши и восхищения.',
      composition: '5 орхидей Phalaenopsis (белый), мох, фирменный контейнер',
      price: 6500,
      categorySlug: 'mono',
      size: 'medium',
      colors: 'white',
      flowers: 'orchid',
      occasion: 'birthday,anniversary',
      isPopular: true,
      images: [
        'https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=800&q=90',
        'https://images.unsplash.com/photo-1487530811015-780780169b7a?w=800&q=90',
      ],
    },
    {
      name: 'Гортензия люкс — 7 веток',
      slug: 'hydrangea-luxury-7',
      description: 'Объёмный монобукет из 7 веток голубой гортензии. Создаёт впечатление облака из цветов. Очень фотогеничный подарок.',
      composition: '7 веток гортензии (голубая + сиреняя), упаковка шелковая бумага',
      price: 7200,
      categorySlug: 'mono',
      size: 'large',
      colors: 'blue,lilac',
      flowers: 'hydrangea',
      occasion: 'birthday,anniversary,wedding',
      isPopular: false,
      images: [
        'https://images.unsplash.com/photo-1533616688419-b7a585564566?w=800&q=90',
      ],
    },
    // GIFTS
    {
      name: 'Бельгийский шоколад Pandora',
      slug: 'pandora-belgian-chocolate',
      description: 'Фирменный набор бельгийского шоколада Pandora. Прекрасное дополнение к букету или самостоятельный подарок.',
      composition: '12 конфет ручной работы, фирменная коробка Pandora',
      price: 1800,
      categorySlug: 'gifts',
      size: 'small',
      isPopular: true,
      occasion: 'birthday,anniversary,holiday',
      images: [
        'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&q=90',
      ],
    },
    {
      name: 'Мишка Тедди 35 см',
      slug: 'teddy-bear-35cm',
      description: 'Мягкий плюшевый медведь 35 см. Нежный подарок для любого возраста. Доступен в белом, бежевом и розовом цвете.',
      composition: 'Плюшевый медведь 35 см, атласный бант',
      price: 1500,
      categorySlug: 'gifts',
      size: 'small',
      isPopular: true,
      occasion: 'birthday,romance,holiday',
      images: [
        'https://images.unsplash.com/photo-1557180295-76eee20ae8aa?w=800&q=90',
      ],
    },
    {
      name: 'Шары «С Днём Рождения»',
      slug: 'birthday-balloons',
      description: 'Связка из 7 воздушных шаров «С Днём Рождения». Яркое дополнение к любому подарку.',
      composition: '7 шаров фольга/латекс, оформление',
      price: 900,
      categorySlug: 'gifts',
      size: 'small',
      isPopular: false,
      occasion: 'birthday',
      images: [
        'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&q=90',
      ],
    },
    {
      name: 'Подарочный набор «Романтика»',
      slug: 'romantic-gift-set',
      description: 'Роскошный набор для особого вечера: свечи, шоколад, ароматная соль для ванны и открытка. Упакован в фирменную коробку Pandora.',
      composition: 'Ароматические свечи (2 шт), бельгийский шоколад, соль для ванны, открытка, фирменная упаковка',
      price: 4500,
      categorySlug: 'gifts',
      size: 'medium',
      isPopular: true,
      isFeatured: true,
      occasion: 'anniversary,romance,birthday',
      images: [
        'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&q=90',
        'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&q=90',
      ],
    },
    // WEDDING
    {
      name: 'Букет невесты «Blanc»',
      slug: 'bridal-bouquet-blanc',
      description: 'Изысканный свадебный букет из белых роз, пионов и эустомы. Создан специально для самого важного дня в жизни.',
      composition: 'Розы Avalanche (10 шт), пионы белые (5 шт), эустома (5 шт), зелень питоспорум, атласная лента',
      price: 15000,
      categorySlug: 'wedding',
      size: 'medium',
      colors: 'white,cream',
      flowers: 'rose,peony,eustoma',
      occasion: 'wedding',
      isPopular: false,
      isFeatured: true,
      images: [
        'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=90',
        'https://images.unsplash.com/photo-1487530811015-780780169b7a?w=800&q=90',
      ],
    },
    // CHRYSANTHEMUMS
    {
      name: 'Хризантемы — Осенний сад',
      slug: 'chrysanthemums-autumn-garden',
      description: 'Роскошный букет из объёмных хризантем в тёплых осенних тонах. Долго стоят в воде — радуют целых 2-3 недели.',
      composition: 'Хризантемы кустовые (7 шт), одиночные (5 шт), зелень',
      price: 3800,
      categorySlug: 'chrysanthemums',
      size: 'large',
      colors: 'yellow,orange,white',
      flowers: 'chrysanthemum',
      occasion: 'birthday,anniversary,holiday',
      isPopular: false,
      images: [
        'https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=800&q=90',
      ],
    },
  ];

  for (const p of products) {
    const { images, categorySlug, ...productData } = p;
    const category = createdCategories[categorySlug];

    const product = await prisma.product.upsert({
      where: { slug: productData.slug },
      update: {},
      create: {
        ...productData,
        categoryId: category.id,
        images: {
          create: images.map((url: string, i: number) => ({
            url,
            alt: productData.name,
            sortOrder: i,
          })),
        },
      },
    });

    console.log(`✅ Product created: ${product.name}`);
  }

  console.log('\n🌸 Pandora Flowers database seeded successfully!');
  console.log('\n🔑 Admin credentials:');
  console.log('   Email: admin@pandora-flowers.kg');
  console.log('   Password: PandoraAdmin2024!');
  console.log('\n🌐 Run: npm run dev');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
