import React from "react";
import { SortingState } from "./MainArea";

interface ControlsProps {
  search: string;
  setSearch: (value: string) => void;
  sortingState: SortingState;
  toggleSorting: () => void;
  getSortingIcon: () => React.ReactNode;
}

export const Controls: React.FC<ControlsProps> = ({
  search,
  setSearch,
  toggleSorting,
  getSortingIcon,
}) => {
  return (
    <div className="mt-8 flex justify-start space-x-4">
      <input
        className="w-1/2 min-w-[64] rounded-md bg-white px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
        type="search"
        placeholder="Search for cases"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <button
        className="h-11 w-48 rounded-md bg-blue-500 px-4 py-2 text-center text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
        onClick={toggleSorting}
      >
        <div className="flex items-center justify-start text-sm">
          <p className="mr-2 hidden sm:inline-block">Price: </p>
          {getSortingIcon()}
        </div>
      </button>
    </div>
  );
};
