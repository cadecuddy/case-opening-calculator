import { useEffect, useState } from "react";
import TextTransition, { presets } from "react-text-transition";

export default function RotatingText() {
  const phrases = ["case", "souvenir", "capsule"];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => setIndex((index) => index + 1), 3000);
    return () => clearTimeout(intervalId);
  }, []);

  return (
    <h1 className="text-center text-2xl antialiased sm:text-3xl">
      Calculate the cost of your next{" "}
      <span className="text-green-500">
        <TextTransition inline springConfig={presets.gentle}>
          {phrases[index % phrases.length]}
        </TextTransition>
      </span>{" "}
      opening
    </h1>
  );
}
