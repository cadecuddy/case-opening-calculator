/* eslint-disable @typescript-eslint/no-empty-interface */
import React, { useEffect, useMemo, useState } from "react";
import { api } from "y/utils/api";
import { MemoizedCase } from "./Case";
import { SelectedItems } from "./SelectedItems";
import { Controls } from "./Controls";
import { UnboxingCost } from "./CostDisplay";
import { Listing } from "@prisma/client";
import Loading from "./Loading";
import TextTransition, { presets } from "react-text-transition";
import Link from "next/link";
import Image from "next/image";
import { getSortingIcon, toggleSorting } from "y/utils/sorting";
import RotatingText from "./RotatingText";
import { KEY_COST_USD, LOAD_INCREMENT } from "y/utils/constants";

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

export function MainArea() {
  // == State ==
  const [displayedItemsCount, setDisplayedItemsCount] =
    useState(LOAD_INCREMENT);
  const [activeContainer, setActiveContainer] = useState<ContainerType>(
    ContainerType.Case
  );
  const [sortingState, setSortingState] = useState<SortingState>(
    SortingState.PriceAscending
  );
  const [selectedItems, setSelectedItems] = useState<
    { listing: Listing; quantity: number }[]
  >([]);
  const [search, setSearch] = useState("");

  // == Data fetching ==
  const listings = api.listings.getListings.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  // == Memozation and calculations ==
  const totalCost = useMemo(() => {
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
  const sortedItems = useMemo(() => {
    let data: Listing[] = [];

    // filter by container
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

  const keys = useMemo(() => {
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

  const timeSince = Math.floor(
    (new Date().getTime() -
      new Date(listings.data?.[0]?.lastUpdated || "").getTime()) /
      1000 /
      60
  );

  // == HOOKS ==
  // Sets up intersection oberserver to load more cases as user scrolls down
  useEffect(() => {
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

  // == Functions ==
  const loadMoreItems = () => {
    setDisplayedItemsCount((prevCount) => prevCount + LOAD_INCREMENT * 2);
  };

  const resetSelectedItems = () => {
    setSelectedItems([]);
  };

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

  const handleQuantityChange = (itemId: string, quantity: number) => {
    setSelectedItems((prevSelectedItems) => {
      const itemIndex = prevSelectedItems.findIndex(
        (c) => c.listing.name === itemId
      );

      if (itemIndex !== -1 && quantity >= 0) {
        const updatedSelectedItems = [...prevSelectedItems];
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        updatedSelectedItems[itemIndex].quantity = quantity;
        return updatedSelectedItems;
      }

      return prevSelectedItems;
    });
  };

  return (
    <div className="container mx-auto -mt-8 max-w-7xl">
      <div className="mb-4 flex justify-center">
        <Link
          href="https://skinport.com/r/casecalc"
          target="_blank"
          className="inline-block"
        >
          <Image src="/sp.webp" alt="skinport" width={600} height={200} />
        </Link>
      </div>
      <RotatingText />
      <div className="text-center">
        <p className="text-lg text-gray-500">
          Prices last updated:{" "}
          {listings.data && listings.data[0]
            ? `${timeSince} minutes ago`
            : "loading..."}
        </p>
      </div>
      <div className="my-8 flex flex-col-reverse space-y-4 lg:flex-row lg:items-start lg:justify-between lg:space-x-4 lg:space-y-0">
        <SelectedItems
          cases={
            listings.data
              ? listings.data
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
                  )
              : []
          }
          onCaseSelect={handleItemSelection}
          onQuantityChange={handleQuantityChange}
        />
        <UnboxingCost
          totalCost={totalCost}
          keys={keys}
          items={
            listings.data
              ? selectedItems.map((selectedItem) => {
                  const listingData = listings.data.find(
                    (item) => item.name === selectedItem.listing.name
                  );
                  return {
                    name: selectedItem.listing.name,
                    price: listingData?.price || 0,
                    quantity: selectedItem.quantity,
                    type: selectedItem.listing.type,
                  };
                })
              : []
          }
          onReset={resetSelectedItems}
        />
      </div>
      <hr className="my-8" />
      <Controls
        search={search}
        setSearch={setSearch}
        sortingState={sortingState}
        toggleSorting={() => toggleSorting(sortingState, setSortingState)}
        getSortingIcon={() => getSortingIcon(sortingState)}
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
      {listings.isLoading && <Loading />}
    </div>
  );
}
