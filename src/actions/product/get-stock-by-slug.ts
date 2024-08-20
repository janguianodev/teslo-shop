"use server";

import prisma from "@/lib/prisma";
import { sleep } from "@/utils";

export const getStuckBySlug = async (slug: string): Promise<number> => {
  try {
    const product = await prisma.product.findFirst({
      where: {
        slug,
      },
      select: { inStock: true },
    });

    return product?.inStock || 0;
  } catch (error) {
    console.error(error);
    return 0;
  }
};
