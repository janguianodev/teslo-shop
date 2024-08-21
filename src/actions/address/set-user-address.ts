"use server";

import { Address } from "@/interfaces";
import prisma from "@/lib/prisma";

export const setUserAddress = async (address: Address, userId: string) => {
  try {
    const saveAddress = await createOrReplaceUserAddress(address, userId);

    return {
      ok: true,
      message: "User address has been set successfully",
      address: saveAddress,
    };
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: "An error occurred while setting user address",
    };
  }
};

const createOrReplaceUserAddress = async (address: Address, userId: string) => {
  try {
    const storedAddress = await prisma.userAddress.findUnique({
      where: { userId },
    });

    const addressToSave = {
      userId: userId,
      address: address.address,
      address2: address.address2,
      countryId: address.country,
      firstName: address.firstName,
      lastName: address.lastName,
      phone: address.phone,
      postalCode: address.postalCode,
      city: address.city,
    };

    if (!storedAddress) {
      const newAddress = await prisma.userAddress.create({
        data: addressToSave,
      });
      return newAddress;
    }

    const updatedAddress = await prisma.userAddress.update({
      where: { userId: userId },
      data: addressToSave,
    });

    return updatedAddress;
  } catch (error) {
    console.log(error);
    throw new Error(
      "An error occurred while creating or replacing user address"
    );
  }
};
