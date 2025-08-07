import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { searchTermAtom } from "../atoms";
import { useDebounce } from "../utils/hooks/useDebounce";

export const useDebouncedSearch = () => {
  const [searchTerm, setSearchTerm] = useAtom(searchTermAtom);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  const debouncedValue = useDebounce(searchTerm, 300);

  useEffect(() => {
    setDebouncedSearchTerm(debouncedValue);
  }, [debouncedValue]);

  return {
    searchTerm,
    setSearchTerm,
    debouncedSearchTerm,
  };
};
