export const brand = {
  name: "AutoFlow Pro",
  shortName: "AutoFlow",
  supportName: "AutoFlow Support",
  operationsName: "AutoFlow Operations",
  sellerName: "AutoFlow Seller",
  logoPath: "/images/logo.png",
  description: "Professional car repair, fleet management, and marketplace platform",
};

export const brandInitials = brand.name
  .split(" ")
  .filter(Boolean)
  .slice(0, 2)
  .map((part) => part[0]?.toUpperCase())
  .join("");
