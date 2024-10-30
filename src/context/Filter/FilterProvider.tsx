import React, { createContext, useState, ReactNode } from "react";
import { FilterInterface } from "../../interfaces/FilterInterface";

interface FilterContextType {
  filter: FilterInterface;
  setFilter: React.Dispatch<React.SetStateAction<FilterInterface>>;
  searchText: string;
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
  onResetFilter: () => void;
}

export const FilterContext = createContext<FilterContextType | undefined>(
  undefined
);

export const FilterProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [filter, setFilter] = useState<FilterInterface>({});
  const [searchText, setSearchText] = useState<string>("");

  const onResetFilter = () => {
    setSearchText("");
    setFilter({});
  };

  return (
    <FilterContext.Provider
      value={{ filter, setFilter, searchText, setSearchText, onResetFilter }}
    >
      {children}
    </FilterContext.Provider>
  );
};
