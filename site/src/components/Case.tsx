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
    <Link href={link} target="_blank">
      <div className="bg-st rounded-lg bg-steamDark p-4 font-mono font-extrabold shadow-lg">
        <Image
          src={image}
          alt={name}
          className="mx-auto transition duration-75 ease-in hover:animate-pulse"
          width={200}
          height={100}
        />
        <h2 className="text-center text-xl antialiased">{name}</h2>
        <p className="text-center text-lg antialiased">$ {price.toFixed(2)}</p>
      </div>
    </Link>
  );
}
