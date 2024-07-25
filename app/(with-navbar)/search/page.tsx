"use client";

import { useState } from "react";
import { Account } from "@prisma/client";
import { SearchBar } from "@/components/search/search-bar";
import { SearchItem } from "@/components/search/search-item";
import { ErrorMessage } from "@/components/others/error-message";
import { Loading } from "@/components/others/loading";
import { RecommendedAccounts } from "@/components/search/recommend-accounts";
import { cn } from "@/lib/utils";

export default function SearchPage() {
  const [listAccounnts, setListAccounts] = useState<Account[] | null>();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="w-[min(100%-24px,600px)] mx-auto">
      <div className="min-h-screen flex flex-col">
        <div className="sticky top-0 bg-rich-black z-10">
          <div className="py-4">
            <h1 className="font-bold text-center">Search</h1>
          </div>
          <div className="px-6 py-4 rounded-t-2xl border-b dark:bg-coffee-bean dark:border-jet">
            <SearchBar
              setSearchResult={setListAccounts}
              setIsLoading={setIsLoading}
            />
          </div>
        </div>
        <div className="grow shrink-0 px-6 py-3 dark:bg-coffee-bean">
          {isLoading ? (
            <Loading containerClassName="py-6" className="size-5" />
          ) : (
            <>
              <RecommendedAccounts
                className={cn(listAccounnts === undefined ? "block" : "hidden")}
              />
              {listAccounnts !== undefined && (
                <>
                  {listAccounnts === null ? (
                    <p className="py-6 text-center text-sm font-semibold text-neutral-400">
                      No accounts were found.
                    </p>
                  ) : listAccounnts.length === 0 ? (
                    <ErrorMessage className="py-6" />
                  ) : (
                    listAccounnts.map((acc, i) => (
                      <SearchItem key={i} account={acc} />
                    ))
                  )}
                </>
              )}
            </>
          )}
        </div>
        <div className="h-[5vh] sticky bottom-0 bg-rich-black">
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
