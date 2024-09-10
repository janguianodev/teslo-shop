"use server";

import prisma from "@/lib/prisma";

export const setTransactionId = async (
  orderId: string,
  transactionId: string
) => {
  try {
    const order = await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        transactionId,
      },
    });

    if (!order) {
      return {
        ok: false,
        message: `No order found with the ID: ${orderId}`,
      };
    }

    return { ok: true };
  } catch (error) {
    console.error(error);

    return {
      ok: false,
      message: "Something went wrong while setting the transaction ID",
    };
  }
};
