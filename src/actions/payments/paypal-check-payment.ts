"use server";

import { PayPalOrderStatusResponse } from "@/interfaces";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const paypalCheckPayment = async (paypalTransactionId: string) => {
  const bearerToken = await getPaypalBearerToken();

  if (!bearerToken) {
    return {
      ok: false,
      message: "There was an error while getting the PayPal token",
    };
  }

  const response = await verifyPayPalPayment(paypalTransactionId, bearerToken);

  if (!response) {
    return {
      ok: false,
      message: "There was an error while verifying the PayPal payment",
    };
  }

  const { status, purchase_units } = response;
  const { invoice_id: orderId } = purchase_units[0];

  if (!status) {
    return {
      ok: false,
      message: "Not payed yet in PayPal",
    };
  }

  // update order status in the database

  try {
    await prisma.order.update({
      where: { id: orderId },
      data: { isPaid: true, paidAt: new Date() },
    });

    //revalidate path
    revalidatePath(`/orders/${orderId}`);

    return {
      ok: true,
      message: "Order status updated successfully",
    };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      message: "There was an error while updating the order status",
    };
  }

  console.log({ status, purchase_units });
};

const getPaypalBearerToken = async (): Promise<string | null> => {
  const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const PAYPAL_SECRET = process.env.PAYPAL_SECRET;
  const oAuth2URL = process.env.PAYPAL_OAUTH_URL ?? "";

  const base64Token = Buffer.from(
    `${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`,
    "utf-8"
  ).toString("base64");

  const requestOptions = {
    method: "POST",
    headers: {
      Authorization: `Basic ${base64Token}`,
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
    }),
  };

  try {
    const response = await fetch(oAuth2URL, {
      ...requestOptions,
      cache: "no-store",
    }).then((res) => res.json());

    return response.access_token;
  } catch (err) {
    console.error(err);
    return null;
  }
};

const verifyPayPalPayment = async (
  payPalTransactionId: string,
  bearerToken: string
): Promise<PayPalOrderStatusResponse | null> => {
  const paypalOrderUrl = `${process.env.PAYPAL_ORDERS_URL}/${payPalTransactionId}`;

  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${bearerToken}`,
    },
  };

  try {
    const response = await fetch(paypalOrderUrl, {
      ...requestOptions,
      cache: "no-store",
    }).then((res) => res.json());

    return response;
  } catch (err) {
    console.error(err);
    return null;
  }
};
