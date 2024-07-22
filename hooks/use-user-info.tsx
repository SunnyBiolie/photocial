"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { UserInfo } from "@prisma/client";
import { useUser } from "@clerk/nextjs";
import { getUserInfoByUserId } from "@/action/user-info/get";
import { createUserInfo } from "@/action/user-info/create";

const UserInfoContext = createContext<
  | {
      userInfo: UserInfo | undefined;
    }
  | undefined
>(undefined);

interface Props {
  [propName: string]: any;
}

export const UserInfoContextProvider = (props: Props) => {
  const { user } = useUser();

  const [userInfo, setUserInfo] = useState<UserInfo>();

  useEffect(() => {
    if (user) {
      getUserInfoByUserId(user.id)
        .then((userInfo) => {
          if (!userInfo) {
            createUserInfo({
              id: user.id,
              imageUrl: user.imageUrl,
              userName: user.username || user.id,
              followes: [],
              followings: [],
            }).then((userInfo) => {
              console.log("Tạo một userInfo mới thành công!");
              setUserInfo(userInfo);
            });
          } else {
            console.log("userInfo đã tồn tại trong cơ sở dữ liệu!");
            setUserInfo(userInfo);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [user]);

  const value = {
    userInfo,
  };

  return <UserInfoContext.Provider value={value} {...props} />;
};

export const useUserInfo = () => {
  const context = useContext(UserInfoContext);
  if (context === undefined) {
    throw new Error(`useCustomUser must be used with UserInfoContextProvider`);
  }

  return context;
};
