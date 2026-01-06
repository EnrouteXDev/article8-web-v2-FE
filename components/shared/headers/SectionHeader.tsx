import React from "react";

interface SectionHeaderProps {
  smallHeader: string;
  mainHeader: string;
  alignment?: "left" | "center" | "right";
  className?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  smallHeader,
  mainHeader,
  alignment = "left",
  className = "",
}) => {
  const alignmentClasses = {
    left: "items-start text-left",
    center: "items-center text-center",
    right: "items-end text-right",
  };

  return (
    <div className={`flex flex-col gap-2 ${alignmentClasses[alignment]} ${className}`}>
      <h3 className="font-satoshi font-medium text-xl text-primary">
        {smallHeader}
      </h3>
      <h2 className="font-baloo font-bold text-4xl lg:text-[72px] text-primary">
        {mainHeader}
      </h2>
    </div>
  );
};

export default SectionHeader;
