import Image from "next/image";
import React from "react";
import Link from "next/link";

type Props = {
  name: string;
  image: string;
  price: number;
  url: string;
  onSelect?: () => void;
  showQuantityInput?: boolean;
};

export default function Case({
  name,
  image,
  price,
  url,
  onSelect,
  showQuantityInput = false,
}: Props) {
  return (
    <div className="bg-st flex transform rounded-lg bg-steamDark p-4 font-extrabold shadow-lg transition duration-300 ease-in-out hover:-translate-y-1 hover:scale-105 hover:cursor-pointer hover:shadow-2xl sm:inline">
      <div onClick={onSelect}>
        <Image
          src={image}
          alt={name}
          className="mx-auto justify-start sm:justify-normal"
          width={200}
          height={100}
        />
        <div>
          <h2 className="text-center text-xl antialiased">{name}</h2>
          <p className="bottom-0 text-center font-mono text-xl text-neutral-50 antialiased">
            ${price.toFixed(2)}
          </p>
        </div>
      </div>
      {showQuantityInput && (
        <div className="flex justify-center pt-2">
          <input
            type="number"
            className="h-8 w-20 rounded-md border-2 border-neutral-50 bg-steamDark text-center text-xl"
            min="1"
            max="99999"
            defaultValue="1"
            style={{ appearance: "textfield" }}
          />
        </div>
      )}
    </div>
  );
}
