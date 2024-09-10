"use server";

import prisma from "@/lib/prisma";
import { v2 as cloudinary } from "cloudinary";
import { revalidatePath } from "next/cache";

cloudinary.config(process.env.CLOUDINARY_URL ?? "");

export const deleteProductImage = async (imageId: number, imageUrl: string) => {
  if (!imageUrl.startsWith("http")) {
    return {
      ok: false,
      message: "File system image cannot be deleted",
    };
  }

  const imageName = imageUrl.split("/").pop()?.split(".")[0] ?? "";

  try {
    await cloudinary.uploader.destroy(imageName);
    const deletedImage = await prisma.productImage.delete({
      where: {
        id: imageId,
      },
      select: {
        product: {
          select: {
            slug: true,
          },
        },
      },
    });

    // revalidate paths
    revalidatePath("/admin/products");
    revalidatePath(`/admin/products/${deletedImage.product.slug}`);
    revalidatePath(`/product/${deletedImage.product.slug}`);
  } catch (error) {
    return {
      ok: false,
      message: "Error deleting image",
    };
  }
};
