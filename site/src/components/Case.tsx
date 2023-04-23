import Image from "next/image";
import React from "react";
import Link from "next/link";

type Props = {
  name: string;
  image: string;
  price: number;
  url: string;
};

export default function Case({ name, image, price, url: link }: Props) {
  return (
    <div className="rounded-lg bg-[#071215] p-4 shadow-lg">
      <Link href={link} target="_blank">
        <Image
          src={image}
          alt={name}
          className="mx-auto h-32 w-32"
          width={200}
          height={200}
        />
        <h2 className="text-center text-xl antialiased">{name}</h2>
        <p className="text-center text-lg antialiased">$ {price.toFixed(2)}</p>
      </Link>
    </div>
  );
}
