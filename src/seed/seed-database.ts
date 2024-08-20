import prisma from "../lib/prisma";
import { initialData } from "./seed";

async function main() {
  // delete previous data
  await prisma.user.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  const { categories, products, users } = initialData;

  // create users
  await prisma.user.createMany({
    data: users,
  });

  // create categories
  const categoriesData = categories.map((category) => ({
    name: category,
  }));

  await prisma.category.createMany({
    data: categoriesData,
  });

  // Map data
  const categoriesDB = await prisma.category.findMany();

  const categoriesMap = categoriesDB.reduce((map, category) => {
    map[category.name.toLowerCase()] = category.id;

    return map;
  }, {} as Record<string, string>);
  // end of mapping

  // create products
  products.forEach(async (product) => {
    const { type, images, ...rest } = product;

    const dbProduct = await prisma.product.create({
      data: { ...rest, categoryId: categoriesMap[type] },
    });

    // create images
    const imagesData = images.map((image) => ({
      url: image,
      productId: dbProduct.id,
    }));

    await prisma.productImage.createMany({
      data: imagesData,
    });
  });

  // log for successful creation
  console.log("Seed ran successfully");
}

(() => {
  if (process.env.NODE_ENV === "production") return;

  main();
})();
