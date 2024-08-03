"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Account } from "@prisma/client";
import {
  getListFollowersIdByAccountId,
  getListFollowingIdByAccountId,
} from "@/action/follows/get";
import { getListAccountsByListAccountIds } from "@/action/account/get";
import { ButtonCloseFullView } from "../others/btn-close-full-view";
import { AccountAvatar } from "../others/account-avatar";
import { ErrorMessage } from "../others/error-message";
import { FollowButton } from "../others/follow-button";
import { RemoveFollowerButton } from "./remove-follower-button";
import { Loading } from "../others/loading";

interface Props {
  currentAccountId: string;
  profileOwner: Account;
  isYourProfile: boolean;
  type: "followers" | "following";
  counts: number;
}

export const FollowsButton = ({
  currentAccountId,
  profileOwner,
  isYourProfile,
  type,
  counts,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [listAccountIds, setListAccountIds] = useState<string[] | null>();
  const [listFollowsAccounts, setListFollowsAccounts] = useState<
    Account[] | null
  >();
  const [listIsFollowedByCurrentAccount, setListIsFollowedByCurrentAccount] =
    useState<boolean[] | null>();

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const fetch = async () => {
        if (type === "followers") {
          const list = await getListFollowersIdByAccountId(profileOwner.id);
          if (list === undefined) {
            setIsError(true);
          } else {
            setListAccountIds(list);
          }
        } else if (type === "following") {
          const list = await getListFollowingIdByAccountId(profileOwner.id);
          if (list === undefined) {
            setIsError(true);
          } else {
            setListAccountIds(list);
          }
        }
      };
      fetch();
    } else {
      setListAccountIds(undefined);
      setListFollowsAccounts(undefined);
      setListIsFollowedByCurrentAccount(undefined);
      setIsLoading(true);
      setIsError(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    if (listAccountIds === undefined) return;
    if (listAccountIds === null) {
      setListFollowsAccounts(null);
      setIsLoading(false);
    } else {
      if (type === "following") {
        const fetch = async () => {
          const list = await getListAccountsByListAccountIds(listAccountIds);
          if (list === undefined) {
            setIsError(true);
          } else {
            if (list === null) {
              setListIsFollowedByCurrentAccount(null);
            } else {
              const listFollowingId = await getListFollowingIdByAccountId(
                currentAccountId
              );
              if (listFollowingId === undefined) {
                setIsError(true);
              } else if (listFollowingId === null) {
                setListIsFollowedByCurrentAccount(null);
              } else {
                const listIds = list.map((acc) => {
                  return listFollowingId.some((id) => id === acc.id);
                });
                setListIsFollowedByCurrentAccount(listIds);
              }
            }
            setListFollowsAccounts(list);
          }
          setIsLoading(false);
        };
        fetch();
      } else {
        const fetch = async () => {
          const list = await getListAccountsByListAccountIds(listAccountIds);
          if (list === undefined) {
            setIsError(true);
          } else {
            setListFollowsAccounts(list);
          }
          setIsLoading(false);
        };
        fetch();
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listAccountIds]);

  const handleClick = () => {
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
            <div className="w-[min(100vw-24px,400px)] p-6 border rounded-lg shadow-md dark:bg-coffee-bean dark:border-jet">
              {isLoading ? (
                <Loading className="py-2" />
              ) : isError ? (
                <ErrorMessage className="py-2.5" />
              ) : listFollowsAccounts === null ? (
                <p className="py-2.5 text-center text-sm text-neutral-400">
                  {type === "followers"
                    ? isYourProfile
                      ? "You have no followers."
                      : `${profileOwner.userName} has no followers.`
                    : isYourProfile
                    ? "You don't follow anyone yet."
                    : `${profileOwner.userName} doesn't follow anyone yet.`}
                </p>
              ) : (
                <div className="space-y-4 animate-fade-in">
                  {listFollowsAccounts?.map((account, i) => (
                    <FollowsItem
                      key={account.id}
                      currentAccountId={currentAccountId}
                      targetAccount={account}
                      type={type}
                      isYourProfile={isYourProfile}
                      isFollowedByCurrentAccount={
                        listIsFollowedByCurrentAccount
                          ? listIsFollowedByCurrentAccount[i]
                          : false
                      }
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

interface ItemProps {
  currentAccountId: string;
  isYourProfile: boolean;
  targetAccount: Account;
  type: "followers" | "following";
  isFollowedByCurrentAccount: boolean;
}

const FollowsItem = ({
  currentAccountId,
  isYourProfile,
  targetAccount,
  type,
  isFollowedByCurrentAccount,
}: ItemProps) => {
  return (
    <div className="flex items-center">
      <AccountAvatar
        account={targetAccount}
        sizes="80px"
        className="shrink-0 size-10 mr-3"
      />
      <div className="flex-1">
        <Link href={`@${targetAccount.userName}`} className="font-semibold">
          {targetAccount.userName}
        </Link>
      </div>
      <div className="shrink-0">
        {isYourProfile && type === "followers" ? (
          <RemoveFollowerButton
            currentAccountId={currentAccountId}
            targetAccount={targetAccount}
          />
        ) : (
          <FollowButton
            currentAccountId={currentAccountId}
            targetAccount={targetAccount}
            isFollowedByCurrentAccount={isFollowedByCurrentAccount}
          />
        )}
      </div>
    </div>
  );
};
