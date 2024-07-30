"use client";

import { useEffect, useState } from "react";
import { Account } from "@prisma/client";
import { getListAccountsByPrivateStatus } from "@/action/account/get";
import { DummyItem, SearchItem, SearchItemSkeleton } from "./search-item";
import { ErrorMessage } from "../others/error-message";
import { useSearchPageData } from "@/hooks/use-search-page-data";
import { useCurrentAccount } from "@/hooks/use-current-account";
import { getListFollowingIdByAccountId } from "@/action/follows/get";

interface Props {
  className?: string;
}

export const RecommendedAccounts = ({ className }: Props) => {
  const { currentAccount } = useCurrentAccount();

  const { recommended, setRecommended } = useSearchPageData();

  const [listAccounts, setListAccounts] = useState<
    Account[] | null | undefined
  >(recommended);
  const [listIsFollowedByCurrentAccount, setListIsFollowedByCurrentAccount] =
    useState<boolean[] | null>();
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (currentAccount && recommended === undefined) {
      const fetch = async () => {
        const list = await getListAccountsByPrivateStatus(false);

        if (list === undefined) {
          setIsError(true);
          setRecommended(undefined);
        } else {
          setListAccounts(list);
          setRecommended(list);
        }
      };
      fetch();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentAccount]);

  useEffect(() => {
    if (!currentAccount) return;

    if (listAccounts !== undefined) {
      if (listAccounts === null) {
        setListIsFollowedByCurrentAccount(null);
      } else {
        const fetch = async () => {
          const listFollowingId = await getListFollowingIdByAccountId(
            currentAccount.id
          );
          if (listFollowingId === undefined) {
            setIsError(true);
            setRecommended(undefined);
          } else if (listFollowingId === null) {
            setListIsFollowedByCurrentAccount(null);
          } else {
            const listIds = listAccounts.map((acc) => {
              return listFollowingId.some((id) => acc.id === id);
            });

            setListIsFollowedByCurrentAccount(listIds);
          }
        };
        fetch();
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listAccounts]);

  if (!currentAccount) return;

  if (isError) return <ErrorMessage className="py-4" />;

  return (
    <>
      <div className={className}>
        <h6 className="py-4 font-bold">Recommend</h6>
        {listAccounts === undefined ||
        listIsFollowedByCurrentAccount === undefined ? (
          <div>
            <SearchItemSkeleton />
            <SearchItemSkeleton />
            <SearchItemSkeleton />
            <SearchItemSkeleton />
          </div>
        ) : listAccounts === null || listIsFollowedByCurrentAccount === null ? (
          <p className="py-4 text-center text-sm font-semibold text-neutral-400">
            No recommend for you.
          </p>
        ) : (
          <div>
            {listAccounts.map((acc, i) => {
              if (currentAccount.id === acc.id) return;
              return (
                <SearchItem
                  key={acc.id}
                  account={acc}
                  isFollowedByCurrentAccount={
                    listIsFollowedByCurrentAccount
                      ? listIsFollowedByCurrentAccount[i]
                      : false
                  }
                />
              );
            })}
          </div>
        )}
      </div>
      <div className={className}>
        <h6 className="py-4 font-bold">Dummy Accounts</h6>
        <div>
          <DummyItem />
          <DummyItem />
          <DummyItem />
          <DummyItem />
          <DummyItem />
          <DummyItem />
          <DummyItem />
          <DummyItem />
          <DummyItem />
          <DummyItem />
        </div>
      </div>
    </>
  );
};
