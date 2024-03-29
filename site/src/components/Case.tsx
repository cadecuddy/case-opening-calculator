import Image from "next/image";
import React from "react";
import Link from "next/link";
import { useState } from "react";
import type { ExchangeRateResponse } from "./CostDisplay";

type Props = {
  name: string;
  image: string;
  price: number;
  url: string;
  onSelect?: () => void;
  showQuantityInput?: boolean;
  onQuantityChange?: (quantity: number) => void;
};

// export case as memoized component
export default function Case({
  name,
  image,
  price,
  url,
  onSelect,
  showQuantityInput = false,
  onQuantityChange,
}: Props) {
  const [convertedPrice, setConvertedPrice] = useState<number>(price);
  const [selectedCurrency, setSelectedCurrency] = useState<string>("USD");
  const [, setQuantity] = useState<number>(1);
  const [inputValue, setInputValue] = useState<string>("1");
  const IMAGE_BASE =
    "https://community.cloudflare.steamstatic.com/economy/image/";

  React.useEffect(() => {
    const selectedCurrency = localStorage.getItem("selectedCurrency");
    setSelectedCurrency(selectedCurrency || "USD");
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const exchangeRates: ExchangeRateResponse = JSON.parse(
      localStorage.getItem("exchangeRates") || "{}"
    );

    if (selectedCurrency && exchangeRates) {
      const exchangeRate = exchangeRates.rates[selectedCurrency];
      setConvertedPrice(
        (price * (exchangeRate || 1)).toFixed(2) as unknown as number
      );
    }
  }, [price]);

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const regex = /^([0-9]*\s*)$/;

    if (regex.test(value)) {
      setInputValue(value);
      const newQuantity = value === "" ? 0 : Number(value);
      setQuantity(newQuantity);
      onQuantityChange?.(newQuantity);
    }
  };

  return (
    <div className="flex transform flex-col justify-between rounded-lg bg-steamDark p-4 font-extrabold shadow-lg transition duration-300 ease-in-out hover:-translate-y-1 hover:scale-105 hover:cursor-pointer hover:shadow-2xl">
      <div onClick={onSelect}>
        <Image
          src={IMAGE_BASE + image}
          alt={name}
          className="mx-auto justify-start sm:justify-normal"
          width={200}
          height={200}
        />
        <div>
          <h2 className="text-center text-xl antialiased">{name}</h2>
        </div>
      </div>
      <div>
        <p className="bottom-0 text-center font-mono text-xl text-neutral-300 antialiased">
          <Link href={url} target="_blank">
            <span className="bottom-0 hover:underline">
              <Image
                className="mr-2 inline-block rounded-sm"
                src="/steam.svg"
                alt="Steam"
                width={16}
                height={16}
              />
              {Intl.NumberFormat(undefined, {
                style: "currency",
                currency: selectedCurrency,
              }).format(convertedPrice as unknown as number)}
            </span>
          </Link>
        </p>
        {showQuantityInput && (
          <div className="flex justify-center pt-2">
            <input
              type="number"
              className="h-8 w-20 rounded-md border-2 border-neutral-50 bg-steamDark text-center text-xl"
              min="0"
              max="99999"
              value={inputValue}
              style={{ appearance: "textfield" }}
              onChange={handleQuantityChange}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export const MemoizedCase = React.memo(Case);
