import React from "react";

interface UnboxingCostProps {
  totalCost: number;
}

export const UnboxingCost: React.FC<UnboxingCostProps> = ({ totalCost }) => {
  return (
    <div className="rounded-md bg-slate-700 p-4">
      <h2 className="mb-2 text-xl font-bold underline">Total Cost</h2>
      <p className="text-lg font-semibold">${totalCost.toFixed(2)}</p>
    </div>
  );
};
