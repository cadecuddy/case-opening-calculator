import { SortingState } from "y/components/MainArea";

export function toggleSorting(
  sortingState: SortingState,
  setSortingState: any
) {
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
}

export function getSortingIcon(sortingState: SortingState): JSX.Element {
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
    default:
      return <></>;
  }
}
