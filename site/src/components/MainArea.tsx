/* eslint-disable @typescript-eslint/no-empty-interface */
import React from "react";
import { api } from "y/utils/api";
import Case from "./Case";
import { SelectedCases } from "./SelectedCases";
import { Controls } from "./Controls";
import { UnboxingCost } from "./Unboxing";

enum SortingState {
  PriceDescending,
  PriceAscending,
}

const KEY_COST_USD = 2.5;

interface MainAreaProps {}

export const MainArea: React.FC<MainAreaProps> = () => {
  const cases = api.cases.getCases.useQuery();

  const [selectedCases, setSelectedCases] = React.useState<number[]>([]);
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

  const handleCaseSelection = (caseId: number) => {
    setSelectedCases((prevSelectedCases) => {
      const caseIndex = prevSelectedCases.indexOf(caseId);
      if (caseIndex !== -1) {
        // Remove the case from the array
        const updatedSelectedCases = [...prevSelectedCases];
        updatedSelectedCases.splice(caseIndex, 1);
        return updatedSelectedCases;
      } else {
        // Add the case to the end of the array
        return [...prevSelectedCases, caseId];
      }
    });
  };

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

  const totalCost = React.useMemo(() => {
    if (!cases.data) {
      return 0;
    }

    return selectedCases
      .map((caseId) => cases.data.find((c) => c.id === caseId)?.price || 0)
      .reduce((acc, cur) => acc + cur, 0);
  }, [cases.data, selectedCases]);

  return (
    <div className="container mx-auto -mt-8 max-w-7xl">
      <h1 className="text-center text-3xl antialiased">
        Calculate the cost of your next CS:GO unboxing
      </h1>

      {cases.data && (
        <div className="my-4 flex flex-col-reverse space-y-4 lg:flex-row lg:items-start lg:justify-between lg:space-x-4 lg:space-y-0">
          <SelectedCases
            cases={cases.data
              ?.filter((c) => selectedCases.includes(c.id))
              .sort(
                (a, b) =>
                  selectedCases.indexOf(a.id) - selectedCases.indexOf(b.id)
              )}
            onCaseSelect={handleCaseSelection}
          />
          <UnboxingCost totalCost={totalCost} />
        </div>
      )}

      <Controls
        search={search}
        setSearch={setSearch}
        sortingState={sortingState}
        toggleSorting={toggleSorting}
        getSortingIcon={getSortingIcon}
      />

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
        {sortedCases
          ?.filter((c) => !selectedCases.includes(c.id))
          .map((c) => (
            <Case
              key={c.id}
              {...c}
              onSelect={() => handleCaseSelection(c.id)}
            />
          ))}
      </div>
    </div>
  );
};
