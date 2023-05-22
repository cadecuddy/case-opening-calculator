/* eslint-disable @typescript-eslint/no-empty-interface */
import React from "react";
import { api } from "y/utils/api";
import { MemoizedCase } from "./Case";
import { SelectedItems } from "./SelectedItems";
import { Controls } from "./Controls";
import { UnboxingCost } from "./CostDisplay";
import { Listing } from "@prisma/client";
import Loading from "./Loading";
import TextTransition, { presets } from "react-text-transition";

interface MainAreaProps {}

export enum SortingState {
  PriceDescending,
  PriceAscending,
  NameDescending,
}

export enum ContainerType {
  Case,
  Capsule,
  Package,
}

const KEY_COST_USD = 2.49;
const LOAD_INCREMENT = 20;
const phrases = ["case", "souvenir", "capsule"];

export const MainArea: React.FC<MainAreaProps> = () => {
  const [displayedItemsCount, setDisplayedItemsCount] =
    React.useState(LOAD_INCREMENT);
  const loadMoreItems = () => {
    setDisplayedItemsCount((prevCount) => prevCount + LOAD_INCREMENT * 2);
  };

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        if (entries[0] && entries[0].isIntersecting) {
          loadMoreItems();
        }
      },
      { threshold: 1 }
    );

    const target = document.getElementById("load-more-target");
    if (target) {
      observer.observe(target);
    }

    return () => {
      if (target) {
        observer.unobserve(target);
      }
    };
  }, []);

  const listings = api.listings.getListings.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  const [activeContainer, setActiveContainer] = React.useState<ContainerType>(
    ContainerType.Case
  );
  const [sortingState, setSortingState] = React.useState<SortingState>(
    SortingState.PriceAscending
  );
  const [selectedItems, setSelectedItems] = React.useState<
    { listing: Listing; quantity: number }[]
  >([]);
  const [search, setSearch] = React.useState("");
  const [index, setIndex] = React.useState(0);

  const resetSelectedItems = () => {
    setSelectedItems([]);
  };

  const keys = React.useMemo(() => {
    if (!listings.data) {
      return 0;
    }

    return selectedItems
      .map((selectedItem) => {
        if (selectedItem.listing.type == "CASE") {
          return selectedItem.quantity;
        } else {
          return 0;
        }
      })
      .reduce((acc, cur) => acc + cur, 0);
  }, [listings.data, selectedItems]);

  console.log(selectedItems);

  // The total cost of the selected cases
  const totalCost = React.useMemo(() => {
    if (!listings.data) {
      return 0;
    }

    return selectedItems
      .map((selectedItem) => {
        const itemData = listings.data.find(
          (item) => item.name === selectedItem.listing.name
        );
        const casePrice = itemData?.price || 0;
        const keyPrice =
          itemData?.type === "CASE"
            ? KEY_COST_USD
            : itemData?.name == "Sticker Capsule" ||
              itemData?.name == "Sticker Capsule 2" ||
              itemData?.name == "Community Sticker Capsule 1"
            ? 1
            : 0;
        return (casePrice + keyPrice) * selectedItem.quantity;
      })
      .reduce((acc, cur) => acc + cur, 0);
  }, [listings.data, selectedItems]);

  // get sorted and filtered cases
  const sortedItems = React.useMemo(() => {
    let data: Listing[] = [];

    if (listings?.data) {
      switch (activeContainer) {
        case ContainerType.Case:
          data = listings.data.filter((item) => item.type === "CASE");
          setDisplayedItemsCount(LOAD_INCREMENT);
          break;
        case ContainerType.Capsule:
          data = listings.data.filter((item) => item.type === "CAPSULE");
          setDisplayedItemsCount(LOAD_INCREMENT);
          break;
        case ContainerType.Package:
          data = listings.data.filter((item) => item.type === "PACKAGE");
          setDisplayedItemsCount(LOAD_INCREMENT);
          break;
      }
    }

    // filter by search
    const filteredData = data.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase())
    );

    // sort items
    const sortedData = filteredData.slice();
    switch (sortingState) {
      case SortingState.PriceDescending:
        return sortedData.sort((a, b) => b.price - a.price);
      case SortingState.PriceAscending:
        return sortedData.sort((a, b) => a.price - b.price);
      case SortingState.NameDescending:
        return sortedData.sort((a, b) => a.name.localeCompare(b.name));
      default:
        return sortedData;
    }
  }, [listings.data, sortingState, search, activeContainer]);

  const handleItemSelection = (itemId: string) => {
    setSelectedItems((prevSelectedItems) => {
      const caseIndex = prevSelectedItems.findIndex(
        (c) => c.listing.name === itemId
      );

      if (caseIndex !== -1) {
        // Remove the case
        const updatedSelectedCases = [...prevSelectedItems];
        updatedSelectedCases.splice(caseIndex, 1);
        return updatedSelectedCases;
      } else {
        const itemListing = sortedItems.find((c) => c.name === itemId);
        if (itemListing) {
          // Add the case with an initial quantity of 1
          return [...prevSelectedItems, { listing: itemListing, quantity: 1 }];
        } else {
          return prevSelectedItems;
        }
      }
    });
  };

  // toggle between sorting states
  const toggleSorting = () => {
    switch (sortingState) {
      case SortingState.PriceDescending:
        setSortingState(SortingState.PriceAscending);
        break;
      case SortingState.PriceAscending:
        setSortingState(SortingState.NameDescending);
        break;
      case SortingState.NameDescending:
        setSortingState(SortingState.PriceDescending);
        break;
    }
  };

  const getSortingIcon = () => {
    switch (sortingState) {
      case SortingState.PriceDescending:
        return (
          <>
            Hi → Lo
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
            Lo → Hi
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
      case SortingState.NameDescending:
        return <>[A-Z]</>;
    }
  };

  const handleQuantityChange = (itemId: string, quantity: number) => {
    setSelectedItems((prevSelectedItems) => {
      const itemIndex = prevSelectedItems.findIndex(
        (c) => c.listing.name === itemId
      );

      if (itemIndex !== -1 && quantity >= 0) {
        // Update the case quantity
        const updatedSelectedItems = [...prevSelectedItems];
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        updatedSelectedItems[itemIndex].quantity = quantity;
        return updatedSelectedItems;
      }

      return prevSelectedItems;
    });
  };

  React.useEffect(() => {
    const intervalId = setInterval(() => setIndex((index) => index + 1), 3000);
    return () => clearTimeout(intervalId);
  }, []);

  return (
    <div className="container mx-auto -mt-8 max-w-7xl">
      <h1 className="text-center text-2xl antialiased sm:text-3xl">
        Calculate the cost of your next{" "}
        <span className="text-green-500">
          <TextTransition inline springConfig={presets.gentle}>
            {phrases[index % phrases.length]}
          </TextTransition>
        </span>{" "}
        opening
      </h1>
      <p className="text-center text-lg text-gray-500">
        Prices last updated:{" "}
        {listings.data && listings.data[0]
          ? listings.data?.[0].lastUpdated.getTime() - new Date().getTime() > 0
            ? "just now"
            : `${Math.floor(
                (new Date().getTime() -
                  listings.data?.[0].lastUpdated.getTime()) /
                  1000 /
                  60
              )} minutes ago`
          : "loading..."}
      </p>

      <div className="my-8 flex flex-col-reverse space-y-4 lg:flex-row lg:items-start lg:justify-between lg:space-x-4 lg:space-y-0">
        {listings.data ? (
          <>
            <SelectedItems
              cases={listings.data
                ?.filter((item) =>
                  selectedItems
                    .map(({ listing }) => listing.name)
                    .includes(item.name)
                )
                .sort(
                  (a, b) =>
                    selectedItems.findIndex(
                      ({ listing }) => listing.name === a.name
                    ) -
                    selectedItems.findIndex(
                      ({ listing }) => listing.name === b.name
                    )
                )}
              onCaseSelect={handleItemSelection}
              onQuantityChange={handleQuantityChange}
            />
            <UnboxingCost
              totalCost={totalCost}
              keys={keys}
              items={selectedItems.map((selectedItem) => {
                const listingData = listings.data.find(
                  (item) => item.name === selectedItem.listing.name
                );
                return {
                  name: selectedItem.listing.name,
                  price: listingData?.price || 0,
                  quantity: selectedItem.quantity,
                  type: selectedItem.listing.type,
                };
              })}
              onReset={resetSelectedItems}
            />
          </>
        ) : (
          <>
            <SelectedItems
              cases={[]}
              onCaseSelect={handleItemSelection}
              onQuantityChange={handleQuantityChange}
            />
            <UnboxingCost
              totalCost={totalCost}
              keys={keys}
              items={[]}
              onReset={resetSelectedItems}
            />
          </>
        )}
      </div>

      <hr className="my-8" />

      <Controls
        search={search}
        setSearch={setSearch}
        sortingState={sortingState}
        toggleSorting={toggleSorting}
        getSortingIcon={getSortingIcon}
        setActiveContainer={setActiveContainer}
      />

      {sortedItems && (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
          {sortedItems
            ?.slice(0, displayedItemsCount)
            .filter(
              (item) =>
                !selectedItems.map((s) => s.listing.name).includes(item.name)
            )
            .map((item) => (
              <MemoizedCase
                key={item.name}
                {...item}
                onSelect={() => handleItemSelection(item.name)}
              />
            ))}
          <div id="load-more-target" className="h-0 w-full"></div>
        </div>
      )}

      {sortedItems.length == 0 && (
        <div className="flex items-center justify-center">
          <Loading />
        </div>
      )}
    </div>
  );
};
