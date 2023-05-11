/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React from "react";
import { SortingState } from "./MainArea";
import { ContainerType } from "./MainArea";
import { debounce } from "lodash";

interface ControlsProps {
  search: string;
  setSearch: (value: string) => void;
  sortingState: SortingState;
  toggleSorting: () => void;
  getSortingIcon: () => React.ReactNode;
  setActiveContainer: (type: ContainerType) => void;
}

export const Controls: React.FC<ControlsProps> = ({
  search,
  setSearch,
  sortingState,
  toggleSorting,
  getSortingIcon,
  setActiveContainer,
}) => {
  const [activeContainerLabel, setActiveContainerLabel] =
    React.useState<string>("Case");
  const handleActiveContainerChange = (type: ContainerType) => {
    setActiveContainer(type);
    switch (type) {
      case ContainerType.Case:
        setActiveContainerLabel("Case");
        break;
      case ContainerType.Capsule:
        setActiveContainerLabel("Capsule");
        break;
      case ContainerType.Package:
        setActiveContainerLabel("Package");
        break;
    }
  };

  const containerTypes = [
    { label: "Case  ", value: ContainerType.Case },
    { label: "Capsule", value: ContainerType.Capsule },
    { label: "Package", value: ContainerType.Package },
  ];

  const [inputValue, setInputValue] = React.useState(search);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    debouncedSetSearch(e.target.value);
  };

  const debouncedSetSearch = debounce((value: string) => {
    setSearch(value);
  }, 250);

  return (
    <div>
      <div className="mt-8 flex flex-col justify-start space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
        <input
          className="w-full min-w-[64] rounded-md bg-white px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:w-1/2"
          type="search"
          placeholder="Search for items"
          value={inputValue}
          onChange={handleSearchChange}
        />

        <div className="flex-grow" />
        <div className="dropdown">
          <label tabIndex={0} className="btn w-full sm:w-40">
            <span className="align-middle text-lg text-neutral-200">
              {activeContainerLabel}
            </span>
            <svg
              className="float-right ml-2 h-8 w-8 text-neutral-200"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M10.7071 13.7071C10.3166 14.0976 9.68342 14.0976 9.29289 13.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L10 11.5858L13.2929 8.29289C13.6834 7.90237 14.3166 7.90237 14.7071 8.29289C15.0976 8.68342 15.0976 9.31658 14.7071 9.70711L10.7071 13.7071Z"
                fill="currentColor"
              />
            </svg>
          </label>
          <ul
            tabIndex={0}
            className="dropdown-content menu rounded-box w-52 bg-base-100 p-2 shadow"
          >
            {containerTypes.map(({ label, value }) => (
              <li key={value}>
                <a
                  onClick={() => handleActiveContainerChange(value)}
                  className="p-2"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <button
          className="h-12 w-full rounded-md bg-steamDark px-4 py-2 text-center align-middle text-sm font-medium text-white hover:bg-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 sm:w-48"
          onClick={toggleSorting}
        >
          <div className="flex items-center justify-center text-base sm:justify-start">
            {sortingState == SortingState.PriceAscending ||
            sortingState == SortingState.PriceDescending ? (
              <p className="mr-2 inline-block">Price: </p>
            ) : (
              <p className="mr-2 inline-block">Alpha</p>
            )}
            {getSortingIcon()}
          </div>
        </button>
      </div>
    </div>
  );
};
