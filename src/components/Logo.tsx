import Image from "next/image";

export function Logo({ size = 148 }: { size?: number }) {
  return (
    <Image
      src="/logo.png"
      alt="خل نلعب"
      width={size}
      height={size}
      priority
      className="mx-auto drop-shadow-2xl"
    />
  );
}