"use server";

import { auth } from "@/auth.config";
import { Address, Size } from "@/interfaces";
import prisma from "@/lib/prisma";

interface ProductToOrder {
  productId: string;
  quantity: number;
  size: Size;
}

export const placeOrder = async (
  productIds: ProductToOrder[],
  address: Address
) => {
  const session = await auth();
  const userId = session?.user.id;

  if (!userId) {
    return {
      ok: false,
      message: "No user session found",
    };
  }

  // get products info
  // note: we can have 2+ products with the same id but different sizes
  const products = await prisma.product.findMany({
    where: {
      id: {
        in: productIds.map((product) => product.productId),
      },
    },
  });

  // calculate amount
  const itemsInOrder = productIds.reduce((count, p) => count + p.quantity, 0);

  //get totals for tax, subtotal, and total
  const { subtotal, tax, total } = productIds.reduce(
    (totals, item) => {
      const productQuantity = item.quantity;
      const product = products.find((p) => p.id === item.productId);

      if (!product) throw new Error(`${item.productId} does not exist`);

      const subtotal = product.price * productQuantity;

      totals.subtotal += subtotal;
      totals.tax += subtotal * 0.15;
      totals.total += subtotal * 1.15;

      return totals;
    },
    { subtotal: 0, tax: 0, total: 0 }
  );

  // create transaction in database
  try {
    const prismaTx = await prisma.$transaction(async (tx) => {
      // step 1: update products stock
      const updatetProductsPromises = products.map(async (product) => {
        //accumulate quantity of product
        const productQuantity = productIds
          .filter((p) => p.productId === product.id)
          .reduce((acc, item) => acc + item.quantity, 0);

        if (productQuantity === 0) {
          throw new Error(`Product ${product.id} has a quantity of 0`);
        }

        return tx.product.update({
          where: {
            id: product.id,
          },
          data: {
            // inStock: product.inStock - productQuantity do not use this
            inStock: {
              decrement: productQuantity,
            },
          },
        });
      });

      const updatedProducts = await Promise.all(updatetProductsPromises);

      //verify negative stock
      updatedProducts.forEach((product) => {
        if (product.inStock < 0) {
          throw new Error(`Product ${product.title} is out of stock`);
        }
      });

      //step 2: create order header and order details
      const order = await tx.order.create({
        data: {
          userId,
          itemsInOrder,
          subtotal,
          tax,
          total,
          OrderItem: {
            createMany: {
              data: productIds.map((p) => ({
                quantity: p.quantity,
                size: p.size,
                productId: p.productId,
                price:
                  products.find((product) => product.id === p.productId)
                    ?.price ?? 0,
              })),
            },
          },
        },
      });

      //validate if price is 0 then throw error

      //step 3: create address
      const { country, ...rest } = address;
      const orderAddress = await tx.orderAddress.create({
        data: {
          ...rest,
          countryId: country,
          orderId: order.id,
        },
      });

      return {
        // TODO: change return value
        order: order,
        orderAddress: orderAddress,
        updatedProducts: updatedProducts,
      };
    });

    return {
      ok: true,
      order: prismaTx.order,
      prismaTx: prismaTx,
      message: "Order placed successfully",
    };
  } catch (error: any) {
    return {
      ok: false,
      message: error?.message,
    };
  }

  return {
    ok: true,
    message: "Order placed successfully",
  };
};
