import React, { useMemo, useState } from "react";

interface Item {
  name: string;
  price: number;
  quantity: number;
  type: string;
}

interface UnboxingCostProps {
  totalCost: number;
  keys: number;
  items: Item[];
  onReset: () => void;
}

const CurrencyDisplay: React.FC<{ amount: number }> = ({ amount }) => (
  <div className="w-1/2 rounded-md bg-steamDark p-1 text-center text-neutral-200">
    $
    {amount.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}
  </div>
);

export const UnboxingCost: React.FC<UnboxingCostProps> = ({
  totalCost,
  keys,
  items,
  onReset,
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

  const sortedItems = useMemo(
    () =>
      items.sort(
        (a: Item, b: Item) => b.quantity * b.price - a.quantity * a.price
      ),
    [items]
  );

  return (
    <div className="mx-auto my-4 w-full rounded-md bg-slate-700 p-4 text-left shadow-md sm:max-w-xs">
      <h2 className="mb-2 text-2xl font-bold underline sm:text-left">
        TOTAL COST
        <span className="z-10 inline" onClick={() => onReset()}>
          <svg
            viewBox="0 0 21 21"
            xmlns="http://www.w3.org/2000/svg"
            fill="#FFFFFF"
            className="float-right ml-1 inline-block h-6 w-6 align-middle text-white hover:cursor-pointer"
          >
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              {" "}
              <g
                fill="none"
                fill-rule="evenodd"
                stroke="#FFFFFF"
                stroke-linecap="round"
                stroke-linejoin="round"
                transform="matrix(0 1 1 0 2.5 2.5)"
              >
                {" "}
                <path d="m3.98652376 1.07807068c-2.38377179 1.38514556-3.98652376 3.96636605-3.98652376 6.92192932 0 4.418278 3.581722 8 8 8s8-3.581722 8-8-3.581722-8-8-8"></path>{" "}
                <path d="m4 1v4h-4" transform="matrix(1 0 0 -1 0 6)"></path>{" "}
              </g>{" "}
            </g>
          </svg>
        </span>
      </h2>

      <p className="break-words pb-2 text-left text-2xl font-semibold text-green-500 sm:text-left">
        $
        {adjustedTotalCost.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </p>
      {items.length > 0 && (
        <>
          <div className="mb-2 flex items-center justify-center space-x-2 sm:justify-start">
            <label
              className="w-28 cursor-pointer font-semibold text-neutral-200 hover:text-green-200"
              onClick={handleExpandClick}
            >
              {expanded ? "−" : "+"} containers
            </label>
            <CurrencyDisplay amount={totalCost - keys * KEY_COST_USD} />
          </div>

          {expanded && (
            <ul className="list-inside list-disc space-y-1 pb-2 text-neutral-400">
              {sortedItems.map((caseItem) => (
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
            <label className="w-28 font-semibold text-neutral-200">
              {keys === 1 ? "key" : "keys"}:
            </label>
            <CurrencyDisplay amount={adjustedKeyCost} />
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
