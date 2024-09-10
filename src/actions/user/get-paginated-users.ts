"use server";

import { auth } from "@/auth.config";
import prisma from "@/lib/prisma";

export const getPaginatedUsers = async () => {
  const session = await auth();

  if (session?.user.role !== "admin") {
    return {
      ok: false,
      message: "You are not authorized to perform this action",
    };
  }

  const users = await prisma.user.findMany({
    orderBy: {
      name: "desc",
    },
  });

  return {
    ok: true,
    users,
  };
};
