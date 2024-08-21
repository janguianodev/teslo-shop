"use server";

import prisma from "@/lib/prisma";

export const deleteUserAddress = async (userId: string) => {
  try {
    const deletedAddress = await prisma.userAddress.delete({
      where: { userId },
    });

    return {
      ok: true,
      message: "Address deleted successfully",
    };
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: "Was not possible to delete the address",
    };
  }
};
