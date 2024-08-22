"use server";

import { auth } from "@/auth.config";
import prisma from "@/lib/prisma";

export const getOrderById = async (orderId: string) => {
  const session = await auth();

  if (!session) {
    return {
      ok: false,
      message: "You must be logged in to perform this action",
    };
  }

  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        orderAddress: true,
        OrderItem: {
          select: {
            price: true,
            quantity: true,
            size: true,
            product: {
              select: {
                title: true,
                slug: true,
                ProductImage: {
                  select: {
                    url: true,
                  },
                  take: 1,
                },
              },
            },
          },
        },
      },
    });

    if (!order) {
      throw `${orderId} does not exist`;
    }

    if (session.user.role === "user") {
      if (session.user.id !== order.userId) {
        throw `You are not authorized to view this order`;
      }
    }

    return {
      ok: true,
      order,
    };
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: "An error occurred while fetching order",
    };
  }
};
