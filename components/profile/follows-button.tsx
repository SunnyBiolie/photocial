"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Account } from "@prisma/client";
import {
  getListFollowersIdByAccountId,
  getListFollowingIdByAccountId,
} from "@/action/follows/get";
import { getListAccountsByListAccountIds } from "@/action/account/get";
import { ButtonCloseFullView } from "../others/btn-close-full-view";
import { Loader } from "lucide-react";
import { AccountAvatar } from "../others/account-avatar";
import { ErrorMessage } from "../others/error-message";

interface Props {
  profileOwner: Account;
  type: "followers" | "following";
  counts: number;
}

export const FollowsButton = ({ profileOwner, type, counts }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [listAccountIds, setListAccountIds] = useState<string[] | null>();
  const [listFollowsAccounts, setListFollowsAccounts] = useState<
    Account[] | null
  >();

  useEffect(() => {
    if (isOpen) {
      if (listAccountIds === undefined) {
        console.log("fetch");
        const fetch = async () => {
          if (type === "followers") {
            const list = await getListFollowersIdByAccountId(profileOwner.id);
            if (list === undefined) {
              console.error("Fetch failed");
              setListFollowsAccounts([]);
            } else if (list === null) {
              setListAccountIds(null);
              setListFollowsAccounts(null);
            } else {
              setListAccountIds(list);
            }
          } else if (type === "following") {
            const list = await getListFollowingIdByAccountId(profileOwner.id);
            if (list === undefined) {
              console.error("Fetch failed");
              setListFollowsAccounts([]);
            } else if (list === null) {
              setListAccountIds(null);
              setListFollowsAccounts(null);
            } else {
              setListAccountIds(list);
            }
          }
        };
        fetch();
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    if (listAccountIds && listAccountIds.length !== 0) {
      const fetch = async () => {
        const list = await getListAccountsByListAccountIds(listAccountIds);
        if (list === undefined) {
        } else {
          setListFollowsAccounts(list);
        }
      };
      fetch();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listAccountIds]);

  const handleClick = () => {
    if (counts === 0) {
      setListAccountIds(null);
      setListFollowsAccounts(null);
    }
    setIsOpen(true);
  };

  return (
    <>
      <button onClick={handleClick}>
        <span className="font-semibold">{counts}</span>{" "}
        {type === "followers" ? <span>followers</span> : <span>following</span>}
      </button>
      {isOpen && (
        <div className="fixed top-0 left-0 size-full z-10">
          <div
            className="absolute size-full top-0 left-0 dark:bg-neutral-950/75"
            onClick={() => setIsOpen(false)}
          >
            <ButtonCloseFullView />
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-fade-in">
            <h5 className="py-3 text-center font-bold">
              {type === "followers" ? "Followers" : "Following"}
            </h5>
            <div className="w-[min(100vw-24px,400px)] p-6 border space-y-4 rounded-lg shadow-md dark:bg-coffee-bean dark:border-jet">
              {listFollowsAccounts === undefined ? (
                <div className="w-full">
                  <Loader className="mx-auto animate-slow-spin" />
                </div>
              ) : listFollowsAccounts === null ? (
                <p className="text-center text-sm text-neutral-400">
                  {type === "followers"
                    ? `${profileOwner.userName} has no followers.`
                    : `${profileOwner.userName} doesn't follow anyone yet.`}
                </p>
              ) : listFollowsAccounts.length === 0 ? (
                <ErrorMessage />
              ) : (
                listFollowsAccounts.map((account, id) => (
                  <FollowsItem key={id} account={account} />
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

interface ItemProps {
  account: Account;
}

const FollowsItem = ({ account }: ItemProps) => {
  return (
    <div className="flex items-center">
      <AccountAvatar
        account={account}
        sizes="80px"
        className="shrink-0 size-10 mr-3"
      />
      <div className="flex-1">
        <Link href={`@${account.userName}`} className="font-bold">
          {account.userName}
        </Link>
      </div>
      {/* <div className="shrink-0">
        <button className="p-2 rounded-md text-sm font-medium dark:bg-neutral-100 dark:text-neutral-800">
          Remove
        </button>
      </div> */}
    </div>
  );
};
