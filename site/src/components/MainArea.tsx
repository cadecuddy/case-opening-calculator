import React from "react";
import { api } from "y/utils/api";
import Case from "./Case";

enum SortingState {
  PriceDescending,
  PriceAscending,
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface MainAreaProps {}

export const MainArea: React.FC<MainAreaProps> = () => {
  const cases = api.cases.getCases.useQuery();

  const [sortingState, setSortingState] = React.useState<SortingState>(
    SortingState.PriceAscending
  );

  const [search, setSearch] = React.useState("");

  // get sorted and filtered cases
  const sortedCases = React.useMemo(() => {
    if (!cases.data) {
      return cases.data;
    }

    // filter by search
    const filteredData = cases.data.filter((c) =>
      c.name.toLowerCase().includes(search.toLowerCase())
    );

    // sort by price
    const sortedData = filteredData.slice();
    switch (sortingState) {
      case SortingState.PriceDescending:
        return sortedData.sort((a, b) => b.price - a.price);
      case SortingState.PriceAscending:
        return sortedData.sort((a, b) => a.price - b.price);
      default:
        return sortedData;
    }
  }, [cases.data, sortingState, search]);

  // toggle between sorting states
  const toggleSorting = () => {
    setSortingState((prevSortingState) =>
      prevSortingState === SortingState.PriceAscending
        ? SortingState.PriceDescending
        : SortingState.PriceAscending
    );
  };

  const getSortingIcon = () => {
    switch (sortingState) {
      case SortingState.PriceDescending:
        return (
          <>
            Descending
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="ml-2 inline-block h-6 w-6 text-right"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </>
        );
      case SortingState.PriceAscending:
        return (
          <>
            Ascending
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="ml-2 inline-block h-6 w-6 text-right"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 15l7-7 7 7"
              />
            </svg>
          </>
        );
    }
  };

  return (
    <div className="container mx-auto -mt-8 max-w-7xl">
      <h1 className="text-center text-3xl antialiased">
        Calculate the cost of your next CS:GO unboxing
      </h1>

      <div className="mt-8 flex justify-start space-x-4">
        <input
          className="w-64 rounded-md bg-white px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
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

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
        {sortedCases?.map((c) => (
          <Case key={c.id} {...c} />
        ))}
      </div>
    </div>
  );
};
