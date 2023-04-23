import React from "react";
import { api } from "y/utils/api";
import Case from "./Case";

interface MainAreaProps {}

export const MainArea: React.FC<MainAreaProps> = () => {
  const cases = api.cases.getCases.useQuery();

  // button that toggles sorting by price
  const [sortByPrice, setSortByPrice] = React.useState(false);

  // sort cases by price
  React.useEffect(() => {
    if (sortByPrice) {
      cases.data?.sort((a, b) => b.price - a.price);
    }
  }, [cases.data, sortByPrice]);

  return (
    <div className="container mx-auto -mt-8 max-w-7xl">
      <h1 className="text-center text-3xl antialiased">
        Calculate the cost of your next CS:GO unboxing
      </h1>

      <div className="mt-8 flex justify-center">
        <button
          className="rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
          onClick={() => setSortByPrice(!sortByPrice)}
        >
          Sort by price
        </button>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
        {cases.data?.map((c) => (
          <Case key={c.id} {...c} />
        ))}
      </div>
    </div>
  );
};
