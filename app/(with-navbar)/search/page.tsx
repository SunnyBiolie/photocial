"use client";

import { useEffect, useState } from "react";
import { Account } from "@prisma/client";
import { cn } from "@/lib/utils";
import { getListFollowingIdByAccountId } from "@/action/follows/get";
import { useCurrentAccount } from "@/hooks/use-current-account";
import { SearchBar } from "@/components/search/search-bar";
import { SearchItem } from "@/components/search/search-item";
import { ErrorMessage } from "@/components/others/error-message";
import { Loading } from "@/components/others/loading";
import { RecommendedAccounts } from "@/components/search/recommend-accounts";

export default function SearchPage() {
  const { currentAccount } = useCurrentAccount();

  const [listAccounts, setListAccounts] = useState<Account[] | null>();
  const [listIsFollowedByCurrentAccount, setListIsFollowedByCurrentAccount] =
    useState<boolean[] | null>();
  const [isSearching, setIsSearching] = useState(false);
  const [isError, setIsError] = useState(false);

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

  return (
    <div className="w-[min(100%-24px,560px)] mx-auto -mb-[var(--app-navbar-horizontal-height)]">
      <div className="min-h-screen flex flex-col">
        <div className="sticky top-0 bg-rich-black z-10">
          <div className="py-4">
            <h1 className="font-bold text-center">Search</h1>
          </div>
          <div className="px-6 py-4 rounded-t-2xl border-b dark:bg-coffee-bean dark:border-jet">
            <SearchBar
              setSearchResult={setListAccounts}
              setIsSearching={setIsSearching}
              setIsError={setIsError}
            />
          </div>
        </div>
        <div className="grow shrink-0 px-6 py-3 dark:bg-coffee-bean">
          {isSearching ||
          (listAccounts !== undefined &&
            listIsFollowedByCurrentAccount === undefined) ? (
            <Loading />
          ) : (
            listAccounts !== undefined &&
            listIsFollowedByCurrentAccount !== undefined &&
            (listAccounts === null ? (
              <p className="py-6 text-center text-sm font-semibold text-neutral-400">
                No accounts were found.
              </p>
            ) : (
              listAccounts.map((acc, i) => (
                <SearchItem
                  key={acc.id}
                  account={acc}
                  isFollowedByCurrentAccount={
                    listIsFollowedByCurrentAccount
                      ? listIsFollowedByCurrentAccount[i]
                      : false
                  }
                />
              ))
            ))
          )}
          <RecommendedAccounts
            className={cn(
              !isSearching && listAccounts === undefined ? "block" : "hidden"
            )}
          />
        </div>
        <div className="h-[var(--app-navbar-horizontal-height)] md:h-[5vh] sticky bottom-0 bg-rich-black">
          <div className="absolute size-8 -left-4 -top-4 bg-rich-black overflow-hidden">
            <div className="absolute bottom-1/2 left-1/2 size-8 rounded-full bg-coffee-bean" />
          </div>
          <div className="absolute size-8 -right-4 -top-4 bg-rich-black overflow-hidden">
            <div className="absolute bottom-1/2 right-1/2 size-8 rounded-full bg-coffee-bean" />
          </div>
        </div>
      </div>
    </div>
  );
}
