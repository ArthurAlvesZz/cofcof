import React from "react";
import { Link } from "react-router-dom";

export interface BrandLogoProps {
  size?: "nav" | "footer" | "hero" | "admin" | "sidebar" | "custom";
  compact?: boolean;
  theme?: "dark" | "light" | "pure-white";
  className?: string;
  asLink?: boolean;
  to?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = "nav",
  compact = false,
  theme = "dark",
  className = "",
  asLink = true,
  to = "/",
}) => {
  const getStyleClasses = () => {
    const baseClasses =
      'font-["Montserrat",sans-serif] font-[800] tracking-[0.08em] uppercase leading-none';

    switch (size) {
      case "nav":
        return `${baseClasses} text-[15px] md:text-[16px]`;
      case "footer":
        return `${baseClasses} text-[clamp(32px,4.5vw,48px)]`;
      case "hero":
        return `${baseClasses} text-[48px] md:text-[64px]`;
      case "admin":
      case "sidebar":
        return `${baseClasses} text-lg md:text-xl`;
      case "custom":
        return baseClasses;
      default:
        return `${baseClasses} text-[15px]`;
    }
  };

  const textColor =
    theme === "pure-white"
      ? "text-white"
      : theme === "dark"
        ? "text-[#F6F1EB]"
        : "text-[#1C1A17]";
  const dotColor = theme === "pure-white" ? "text-white" : "text-[#c9a263]";

  const Content = (
    <span
      className={`${getStyleClasses()} flex items-baseline ${className}`.trim()}
    >
      <span className={textColor}>{compact ? "C" : "COFCOF"}</span>
      <span className={dotColor}>.CO</span>
    </span>
  );

  if (asLink) {
    return (
      <Link
        to={to}
        className="inline-block hover:opacity-80 transition-opacity"
      >
        {Content}
      </Link>
    );
  }

  return <div className="inline-block">{Content}</div>;
};
