"use client";

import { AccountContextProvider } from "@/hooks/use-current-account";

export const AccountProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <AccountContextProvider>{children}</AccountContextProvider>;
};
