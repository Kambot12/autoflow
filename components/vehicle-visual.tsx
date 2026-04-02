"use client";

type VehicleVisualProps = {
  image?: string;
  label?: string;
  className?: string;
};

export function VehicleVisual({
  image,
  label = "Vehicle",
  className = "",
}: VehicleVisualProps) {
  if (image) {
    return (
      <img
        src={image}
        alt={label}
        className={`h-44 w-full rounded-[28px] object-cover border border-[color:var(--border)] ${className}`}
      />
    );
  }

  return (
    <div
      className={`vehicle-stage h-44 w-full rounded-[28px] border border-[color:var(--border)] bg-[linear-gradient(160deg,#0f172a_0%,#1e293b_45%,#334155_100%)] overflow-hidden ${className}`}
      aria-label={`${label} placeholder visual`}
    >
      <div className="vehicle-glow" />
      <div className="vehicle-road" />
      <div className="vehicle-placeholder">
        <div className="vehicle-roof" />
        <div className="vehicle-body" />
        <div className="vehicle-light vehicle-light-front" />
        <div className="vehicle-light vehicle-light-back" />
        <div className="vehicle-wheel vehicle-wheel-front" />
        <div className="vehicle-wheel vehicle-wheel-back" />
      </div>
    </div>
  );
}
