"use client";

import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { Account } from "@prisma/client";
import { useUser } from "@clerk/nextjs";
import { getAccountByAccountId } from "@/action/account/get";
import { createAccount } from "@/action/account/create";

const AccountContext = createContext<
  | {
      currentAccount: Account | undefined;
      setRequestCurrentAccount: Dispatch<SetStateAction<never[]>>;
    }
  | undefined
>(undefined);

interface Props {
  [propName: string]: any;
}

export const AccountContextProvider = (props: Props) => {
  const { user } = useUser();

  const [currentAccount, setCurrentAccount] = useState<Account>();

  const [requestCurrentAccount, setRequestCurrentAccount] = useState([]);

  useEffect(() => {
    if (user) {
      const init = async () => {
        const currentAccount = await getAccountByAccountId(user.id);
        if (currentAccount === undefined)
          throw new Error(`Prisma error: getAccountByAccountId`);
        if (currentAccount === null) {
          const createdAccount = await createAccount({
            id: user.id,
            imageUrl: user.imageUrl,
            userName: user.username || user.id,
            biography: null,
            isPrivate: false,
          });
          setCurrentAccount(createdAccount);
        } else {
          setCurrentAccount(currentAccount);
        }
      };
      init();
    }
  }, [user, requestCurrentAccount]);

  const value = {
    currentAccount,
    setRequestCurrentAccount,
  };

  return <AccountContext.Provider value={value} {...props} />;
};

export const useCurrentAccount = () => {
  const context = useContext(AccountContext);
  if (context === undefined) {
    throw new Error(`useAccount must be used with AccountContextProvider`);
  }

  return context;
};
