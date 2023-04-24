import React from "react";
import type { CaseListing } from "@prisma/client";
import Case from "./Case";

interface SelectedCasesProps {
  cases: CaseListing[];
  onCaseSelect: (caseId: string) => void;
  onQuantityChange: (caseId: string, quantity: number) => void;
}

export const SelectedCases: React.FC<SelectedCasesProps> = ({
  cases,
  onCaseSelect,
  onQuantityChange,
}) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
      {cases.map((c) => (
        <Case
          key={c.name}
          name={c.name}
          image={c.image}
          price={c.price}
          url={c.url}
          onSelect={() => onCaseSelect(c.name)}
          showQuantityInput={true}
          onQuantityChange={(quantity) => onQuantityChange(c.name, quantity)}
        />
      ))}
    </div>
  );
};