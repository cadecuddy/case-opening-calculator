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

export interface ExchangeRateResponse {
  result: string;
  provider: string;
  documentation: string;
  terms_of_use: string;
  time_last_update_unix: number;
  time_last_update_utc: string;
  time_next_update_unix: number;
  time_next_update_utc: string;
  base_code: string;
  rates: {
    [key: string]: number;
  };
}

const CurrencyDisplay: React.FC<{ amount: number; currency: string }> = ({
  amount,
  currency = "USD",
}) => (
  <div className="w-1/2 rounded-md bg-steamDark p-1 text-center text-neutral-200">
    {Intl.NumberFormat(undefined, {
      style: "currency",
      currency: currency,
    }).format(amount)}
  </div>
);

const KEY_COST_USD = 2.49;
const US_SALES_TAX = 0.0712;

export const UnboxingCost: React.FC<UnboxingCostProps> = ({
  totalCost,
  keys,
  items,
  onReset,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [applySalesTax, setApplySalesTax] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState<string>("USD");
  const [exchangeRates, setExchangeRates] = useState<{ [key: string]: number }>(
    {}
  );

  const salesTaxAmount = useMemo(() => {
    return applySalesTax ? keys * KEY_COST_USD * US_SALES_TAX : 0;
  }, [applySalesTax, keys]);
  const adjustedKeyCost = useMemo(() => {
    return (
      keys * KEY_COST_USD * (exchangeRates[selectedCurrency] || 1) +
      salesTaxAmount
    ).toFixed(2);
  }, [keys, salesTaxAmount, exchangeRates, selectedCurrency]);
  const adjustedTotalCost = useMemo(() => {
    return (
      totalCost * (exchangeRates[selectedCurrency] || 1) +
      salesTaxAmount
    ).toFixed(2);
  }, [totalCost, salesTaxAmount, exchangeRates, selectedCurrency]);
  const sortedItems = useMemo(
    () =>
      items.sort(
        (a: Item, b: Item) => b.quantity * b.price - a.quantity * a.price
      ),
    [items]
  );

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  const handleSalesTaxCheck = () => {
    setApplySalesTax(!applySalesTax);
  };

  // check local storage for currency exchange rates and selected currency
  // if not found, fetch from api and store in local storage
  // if found, check if it's been more than 24 hours since last fetch
  // if so, fetch from api and store in local storage
  React.useEffect(() => {
    const fetchExchangeRates = async () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const response = await fetch(
        "https://open.er-api.com/v6/latest/USD"
      ).then((res) => res.json());
      if (response) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const responseObj: ExchangeRateResponse = JSON.parse(
          JSON.stringify(response)
        );
        localStorage.setItem("exchangeRates", JSON.stringify(responseObj));
        setExchangeRates(responseObj.rates);
      }
    };

    const storedExchangeRates = localStorage.getItem("exchangeRates");
    if (!storedExchangeRates) {
      fetchExchangeRates().catch((err) => {
        console.error(err);
      });

      localStorage.setItem("selectedCurrency", "USD");
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const parsedExchangeRates: ExchangeRateResponse =
        JSON.parse(storedExchangeRates);
      const lastUpdate = parsedExchangeRates.time_last_update_unix;
      const now = Math.floor(Date.now() / 1000);
      const twentyFourHours = 86400;
      if (now - lastUpdate > twentyFourHours) {
        fetchExchangeRates().catch((err) => console.error(err));
      }
      setExchangeRates(parsedExchangeRates.rates);
    }

    const storedSelectedCurrency = localStorage.getItem("selectedCurrency");
    if (storedSelectedCurrency) {
      setSelectedCurrency(storedSelectedCurrency);
    }
  }, []);

  const handleCurrencyChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newSelectedCurrency = event.target.value;
    setSelectedCurrency(newSelectedCurrency);
    localStorage.setItem("selectedCurrency", newSelectedCurrency);
  };

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
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              {" "}
              <g
                fill="none"
                fillRule="evenodd"
                stroke="#FFFFFF"
                strokeLinecap="round"
                strokeLinejoin="round"
                transform="matrix(0 1 1 0 2.5 2.5)"
              >
                {" "}
                <path d="m3.98652376 1.07807068c-2.38377179 1.38514556-3.98652376 3.96636605-3.98652376 6.92192932 0 4.418278 3.581722 8 8 8s8-3.581722 8-8-3.581722-8-8-8"></path>{" "}
                <path d="m4 1v4h-4" transform="matrix(1 0 0 -1 0 6)"></path>{" "}
              </g>{" "}
            </g>
          </svg>
        </span>
        <span className="float-right mr-1 inline align-middle text-base">
          <select
            value={selectedCurrency}
            onChange={handleCurrencyChange}
            className="rounded-sm bg-steamMarket p-1 font-mono text-neutral-200"
          >
            {exchangeRates &&
              Object.keys(exchangeRates).map((currency) => (
                <option value={currency} key={currency}>
                  {currency}
                </option>
              ))}
          </select>
        </span>
      </h2>

      <p className="break-words pb-2 text-left text-2xl font-semibold text-green-500 sm:text-left">
        {Intl.NumberFormat(undefined, {
          style: "currency",
          currency: selectedCurrency,
        }).format(adjustedTotalCost as unknown as number)}
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
            <CurrencyDisplay
              currency={selectedCurrency}
              amount={
                // use memo
                (adjustedTotalCost as unknown as number) -
                (adjustedKeyCost as unknown as number)
              }
            />
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
                    {Intl.NumberFormat(undefined, {
                      style: "currency",
                      currency: selectedCurrency,
                    }).format(
                      caseItem.price *
                        caseItem.quantity *
                        (exchangeRates[selectedCurrency] || 1)
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
            <CurrencyDisplay
              currency={selectedCurrency}
              amount={adjustedKeyCost as unknown as number}
            />
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
