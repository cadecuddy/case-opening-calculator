import React, { useState } from "react";

interface UnboxingCostProps {
  totalCost: number;
  keys: number;
  cases: Array<{ name: string; price: number; quantity: number }>;
}

export const UnboxingCost: React.FC<UnboxingCostProps> = ({
  totalCost,
  keys,
  cases,
}) => {
  const KEY_COST_USD = 2.49;
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <div className="my-4 w-full rounded-md bg-slate-700 p-4 text-left shadow-md lg:max-w-xs">
      <h2 className="mb-2 text-2xl font-bold underline">TOTAL COST</h2>
      <p className="break-words text-2xl font-semibold text-green-500">
        ${totalCost.toLocaleString()}
      </p>
      {cases.length > 0 && (
        <>
          <div className="mb-2 flex items-center space-x-2">
            <label
              className="w-16 cursor-pointer font-semibold text-neutral-200"
              onClick={handleExpandClick}
            >
              <span className="text-white hover:text-green-200">
                {expanded ? "−" : "+"} cases
              </span>
            </label>
            <div className="w-1/2 break-words rounded-md bg-steamDark p-1 text-center text-neutral-200">
              ${(totalCost - keys * KEY_COST_USD).toLocaleString()}
            </div>
          </div>
          {expanded && (
            <ul className="list-inside list-disc space-y-1 p-2 text-neutral-400">
              {cases
                .sort((a, b) => {
                  const aPrice = a.price * a.quantity;
                  const bPrice = b.price * b.quantity;
                  return bPrice - aPrice;
                })
                .map((caseItem) => (
                  <div
                    key={caseItem.name}
                    className="flex justify-between text-left text-sm"
                  >
                    <span>
                      {caseItem.quantity} × {caseItem.name}
                    </span>
                    <span className="text-green-500">
                      ${(caseItem.price * caseItem.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
            </ul>
          )}
          <div className="flex items-center space-x-2">
            <label className="w-16 font-semibold text-neutral-200">
              {keys === 1 ? "key" : "keys"}:
            </label>
            <div className="w-1/2 break-words rounded-md bg-steamDark p-1 text-center text-neutral-200">
              ${(keys * KEY_COST_USD).toLocaleString()}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
