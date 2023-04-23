import React from "react";

interface UnboxingCostProps {
  totalCost: number;
  keys: number;
}

export const UnboxingCost: React.FC<UnboxingCostProps> = ({
  totalCost,
  keys,
}) => {
  const KEY_COST_USD = 2.5;

  return (
    <div className="max-w-xs rounded-md bg-slate-700 p-4">
      <h2 className="mb-2 text-right text-xl font-bold underline">
        Total Cost
      </h2>
      <p className="break-words text-right text-2xl font-semibold text-green-500">
        ${totalCost.toFixed(2).toLocaleString()}
      </p>
      <p className="break-words text-right text-sm font-semibold text-[#b3b3b3]">
        cases | ${(totalCost - keys * KEY_COST_USD).toFixed(2).toLocaleString()}
      </p>
      <p className="break-words text-right text-sm font-semibold text-[#b3b3b3]">
        {keys === 1 ? "key" : "keys"} | $
        {(keys * KEY_COST_USD).toFixed(2).toLocaleString()}
      </p>
    </div>
  );
};
