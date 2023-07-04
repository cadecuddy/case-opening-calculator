import Image from "next/image";
import React from "react";
import ReactModal from "react-modal";
import { api } from "y/utils/api";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  Tooltip,
  YAxis,
} from "recharts";

type Props = {
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
  name: string;
  image: string;
};

export default function ChartModal({
  showModal,
  setShowModal,
  name,
  image,
}: Props) {
  const { isLoading, error, data } = api.historical.getPriceHistory.useQuery(
    name,
    {
      refetchOnWindowFocus: false,
      cacheTime: Infinity,
      staleTime: Infinity,
      enabled: showModal,
    }
  );

  return (
    <ReactModal
      isOpen={showModal}
      shouldCloseOnEsc={true}
      preventScroll={true}
      className="relative mx-auto h-3/5 w-1/2 rounded-md bg-steamDark p-4 text-neutral-300 opacity-100 shadow-md transition-opacity duration-1000 ease-in-out"
      overlayClassName="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" // These classes apply to modal overlay
    >
      <button
        className="absolute right-2 top-2 border-none bg-transparent text-2xl focus:outline-none"
        onClick={() => setShowModal(false)}
      >
        <svg
          className="h-8 w-8 text-red-500 hover:scale-110 hover:text-red-700"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
      {isLoading ? (
        <>
          <span className="loading-lg loading"></span>
          loading..
        </>
      ) : (
        <div className="mx-auto items-center">
          <div className="flex justify-center space-x-2 text-center text-lg">
            <Image src={image} alt={name} width={32} height={32} />
            <p>{name} Price History</p>
          </div>
          <div></div>
          <LineChart
            width={700}
            height={400}
            data={data}
            margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
          >
            <Line
              type="monotone"
              dataKey="price"
              stroke="#00FF00"
              dot={false}
            />
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="date" label="Date" scale="log" />
            <YAxis />
            <Tooltip />
          </LineChart>
        </div>
      )}
    </ReactModal>
  );
}
