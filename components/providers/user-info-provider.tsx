"use client";

import { UserInfoContextProvider } from "@/hooks/use-user-info";

export const UserInfoProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <UserInfoContextProvider>{children}</UserInfoContextProvider>;
};
