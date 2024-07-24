"use server";

import prisma from "@/lib/prisma";
import { Account } from "@prisma/client";

export const createAccount = async (data: Account) => {
  try {
    const account = await prisma.account.create({
      data,
    });

    return account;
  } catch (err) {
    return undefined;
  }
};
