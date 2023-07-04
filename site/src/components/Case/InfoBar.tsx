import Link from "next/link";
import React from "react";
import Image from "next/image";
import ChartModal from "./ChartModal";

type Props = {
  selectedCurrency: string;
  price: number;
  url: string;
  name: string;
  image: string;
};

export default function InfoBar({
  selectedCurrency,
  price,
  url,
  name,
  image,
}: Props) {
  const [showChart, setShowChart] = React.useState(false);

  return (
    <div className="bg-red-500">
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
            }).format(price)}
          </span>
        </Link>
        <button
          type="button"
          className="inline-flex items-center rounded-md border border-transparent bg-blue-500 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          onClick={() => setShowChart(true)}
        >
          OPEN
        </button>
        <ChartModal
          showModal={showChart}
          setShowModal={setShowChart}
          image={image}
          name={name}
        />
      </p>
    </div>
  );
}
