import React from "react";

interface UnboxingCostProps {
  totalCost: number;
  keys: number;
}

export const UnboxingCost: React.FC<UnboxingCostProps> = ({
  totalCost,
  keys,
}) => {
  const KEY_COST_USD = 2.49;

  return (
    <div className="my-4 w-full rounded-md bg-slate-700 p-4 shadow-md lg:max-w-xs">
      <h2 className="mb-2 text-right text-2xl font-bold underline">
        TOTAL COST
      </h2>
      <p className="break-words text-right text-2xl font-semibold text-green-500">
        ${totalCost.toLocaleString()}
      </p>
      <p className="break-words text-right text-sm font-semibold text-[#b3b3b3]">
        cases | ${(totalCost - keys * KEY_COST_USD).toLocaleString()}
      </p>
      <p className="break-words text-right text-sm font-semibold text-[#b3b3b3]">
        {keys === 1 ? "key" : "keys"} | $
        {(keys * KEY_COST_USD).toLocaleString()}
      </p>
    </div>
  );
};
