/* eslint-disable @typescript-eslint/no-empty-interface */
import React from "react";
import { api } from "y/utils/api";
import Case from "./Case";
import { SelectedCases } from "./SelectedCases";
import { Controls } from "./Controls";
import { UnboxingCost } from "./Unboxing";

interface MainAreaProps {}
enum SortingState {
  PriceDescending,
  PriceAscending,
}

export const MainArea: React.FC<MainAreaProps> = () => {
  const KEY_COST_USD = 2.5;
  const cases = api.cases.getCases.useQuery();

  const [sortingState, setSortingState] = React.useState<SortingState>(
    SortingState.PriceAscending
  );
  const [selectedCases, setSelectedCases] = React.useState<
    { id: number; quantity: number }[]
  >([]);
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
      const caseIndex = prevSelectedCases.findIndex((c) => c.id === caseId);

      if (caseIndex !== -1) {
        // Remove the case
        const updatedSelectedCases = [...prevSelectedCases];
        updatedSelectedCases.splice(caseIndex, 1);
        return updatedSelectedCases;
      } else {
        // Add the case with an initial quantity of 1
        return [...prevSelectedCases, { id: caseId, quantity: 1 }];
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

  const keys = React.useMemo(() => {
    if (!cases.data) {
      return 0;
    }

    return selectedCases
      .map((selectedCase) => {
        return selectedCase.quantity;
      })
      .reduce((acc, cur) => acc + cur, 0);
  }, [cases.data, selectedCases]);

  const totalCost = React.useMemo(() => {
    if (!cases.data) {
      return 0;
    }

    return selectedCases
      .map((selectedCase) => {
        const caseData = cases.data.find((c) => c.id === selectedCase.id);
        const casePrice = caseData?.price || 0;
        const keyPrice = KEY_COST_USD;
        return (casePrice + keyPrice) * selectedCase.quantity;
      })
      .reduce((acc, cur) => acc + cur, 0);
  }, [cases.data, selectedCases]);

  const handleQuantityChange = (caseId: number, quantity: number) => {
    setSelectedCases((prevSelectedCases) => {
      const caseIndex = prevSelectedCases.findIndex((c) => c.id === caseId);

      if (caseIndex !== -1 || quantity > 0) {
        // Update the case quantity
        const updatedSelectedCases = [...prevSelectedCases];
        updatedSelectedCases[caseIndex].quantity = quantity;
        return updatedSelectedCases;
      }

      return prevSelectedCases;
    });
  };

  return (
    <div className="container mx-auto -mt-8 max-w-7xl">
      <h1 className="text-center text-3xl antialiased">
        Calculate the cost of your next CS:GO unboxing
      </h1>

      {cases.data && (
        <div className="my-4 flex flex-col-reverse space-y-4 lg:flex-row lg:items-start lg:justify-between lg:space-x-4 lg:space-y-0">
          <SelectedCases
            cases={cases.data
              ?.filter((c) => selectedCases.map(({ id }) => id).includes(c.id))
              .sort(
                (a, b) =>
                  selectedCases.findIndex(({ id }) => id === a.id) -
                  selectedCases.findIndex(({ id }) => id === b.id)
              )}
            onCaseSelect={handleCaseSelection}
            onQuantityChange={handleQuantityChange}
          />
          <UnboxingCost totalCost={totalCost} keys={keys} />
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
          ?.filter((c) => !selectedCases.map((s) => s.id).includes(c.id))
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
