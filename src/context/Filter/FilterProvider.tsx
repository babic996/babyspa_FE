import React, { createContext, useState, ReactNode } from "react";
import { FilterInterface } from "../../interfaces/FilterInterface";

interface FilterContextType {
  filter: FilterInterface;
  setFilter: React.Dispatch<React.SetStateAction<FilterInterface>>;
}

export const FilterContext = createContext<FilterContextType | undefined>(
  undefined
);

export const FilterProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [filter, setFilter] = useState<FilterInterface>({});

  return (
    <FilterContext.Provider value={{ filter, setFilter }}>
      {children}
    </FilterContext.Provider>
  );
};
