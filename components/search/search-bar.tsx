"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { getListAccountsBySearchUserName } from "@/action/account/get";
import { Account } from "@prisma/client";
import { SearchIcon } from "lucide-react";

interface Props {
  setSearchResult: Dispatch<SetStateAction<Account[] | null | undefined>>;
  setIsSearching: Dispatch<SetStateAction<boolean>>;
  setIsError: Dispatch<SetStateAction<boolean>>;
}

export const SearchBar = ({
  setSearchResult,
  setIsSearching,
  setIsError,
}: Props) => {
  const [searchText, setSearchText] = useState<string>("");

  const debounceValue = useDebounce(searchText);

  useEffect(() => {
    if (!debounceValue) {
      setSearchResult(undefined);
      return;
    }

    const fetch = async () => {
      setIsSearching(true);
      const list = await getListAccountsBySearchUserName(debounceValue);
      if (list === undefined) {
        setIsError(true);
      } else {
        setSearchResult(list);
      }
      setIsSearching(false);
    };
    fetch();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounceValue]);

  return (
    <div className="w-full py-2.5 px-4 rounded-xl border dark:bg-black-chocolate dark:border-neutral-800">
      <div className="flex items-center gap-2.5">
        <SearchIcon strokeWidth={2.5} className="size-5 text-unselected" />
        <input
          id="search-bar"
          value={searchText}
          type="search"
          placeholder="Search"
          className="w-full bg-transparent focus:outline-none placeholder:text-unselected"
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>
    </div>
  );
};
