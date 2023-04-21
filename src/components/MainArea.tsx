import React from "react";

interface MainAreaProps {}

export const MainArea: React.FC<MainAreaProps> = () => {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold">Hello, world!</h1>
      <p className="text-xl">This is a sample page.</p>
    </div>
  );
};
