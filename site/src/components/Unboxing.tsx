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
  const SALES_TAX = 0.0712;
  const [expanded, setExpanded] = useState(false);
  const [applySalesTax, setApplySalesTax] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleSalesTaxCheck = () => {
    setApplySalesTax(!applySalesTax);
  };

  const salesTaxAmount = applySalesTax ? keys * KEY_COST_USD * SALES_TAX : 0;
  const adjustedKeyCost = keys * KEY_COST_USD + salesTaxAmount;
  const adjustedTotalCost = totalCost + salesTaxAmount;

  return (
    <div className="mx-auto my-4 w-full rounded-md bg-slate-700 p-4 text-left shadow-md sm:max-w-xs">
      <h2 className="mb-2 text-center text-2xl font-bold underline sm:text-left">
        TOTAL COST
      </h2>
      <p className="break-words pb-2 text-center text-2xl font-semibold text-green-500 sm:text-left">
        $
        {adjustedTotalCost.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </p>
      {cases.length > 0 && (
        <>
          <div className="mb-2 flex items-center justify-center space-x-2 sm:justify-start">
            <label
              className="w-16 cursor-pointer font-semibold text-neutral-200 hover:text-green-200"
              onClick={handleExpandClick}
            >
              {expanded ? "−" : "+"} cases
            </label>
            <div className="w-1/2 rounded-md bg-steamDark p-1 text-center text-neutral-200">
              $
              {(totalCost - keys * KEY_COST_USD).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
          </div>
          {expanded && (
            <ul className="list-inside list-disc space-y-1 pb-2 text-neutral-400">
              {cases.map((caseItem) => (
                <div
                  key={caseItem.name}
                  className="flex justify-between text-left text-sm"
                >
                  <span>
                    {caseItem.quantity} × {caseItem.name}
                  </span>
                  <span className="text-green-500">
                    $
                    {(caseItem.price * caseItem.quantity).toLocaleString(
                      undefined,
                      {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }
                    )}
                  </span>
                </div>
              ))}
            </ul>
          )}
          <div className="flex items-center justify-center space-x-2 sm:justify-start">
            <label className="w-16 font-semibold text-neutral-200">
              {keys === 1 ? "key" : "keys"}:
            </label>
            <div className="w-1/2 rounded-md bg-steamDark p-1 text-center text-neutral-200">
              $
              {adjustedKeyCost.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
          </div>
          <div className="mt-2 flex items-center justify-center sm:justify-start">
            <input
              type="checkbox"
              className="mr-2"
              checked={applySalesTax}
              onChange={handleSalesTaxCheck}
            />
            <label className="font-semibold text-neutral-200">
              US sales tax (~7.12%)
            </label>
          </div>
        </>
      )}
    </div>
  );
};
