"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Account } from "@prisma/client";
import { useUser } from "@clerk/nextjs";
import { getAccountByAccountId } from "@/action/account/get";
import { createAccount } from "@/action/account/create";

const AccountContext = createContext<
  | {
      account: Account | undefined;
    }
  | undefined
>(undefined);

interface Props {
  [propName: string]: any;
}

export const AccountContextProvider = (props: Props) => {
  const { user } = useUser();

  const [account, setAccount] = useState<Account>();

  useEffect(() => {
    if (user) {
      const init = async () => {
        const account = await getAccountByAccountId(user.id);
        if (account === undefined)
          throw new Error(`Prisma error: getAccountByAccountId`);
        if (account === null) {
          const createdAccount = await createAccount({
            id: user.id,
            imageUrl: user.imageUrl,
            userName: user.username || user.id,
            biography: null,
            isPrivate: false,
          });
          setAccount(createdAccount);
        } else {
          setAccount(account);
        }
      };
      init();
    }
  }, [user]);

  const value = {
    account,
  };

  return <AccountContext.Provider value={value} {...props} />;
};

export const useAccount = () => {
  const context = useContext(AccountContext);
  if (context === undefined) {
    throw new Error(`useAccount must be used with AccountContextProvider`);
  }

  return context;
};
