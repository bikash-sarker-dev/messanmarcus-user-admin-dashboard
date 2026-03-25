import darkLogo from "@/assets/logos/dark.svg";
// import logo from "@/assets/logos/main.svg";
import logo from "@/assets/logo_messan.png";
import Image from "next/image";

export function Logo() {
  return (
    <div className="relative h-14 max-w-[9.847rem]">
      <Image
        src={logo}
        fill
        className="dark:hidden"
        alt="NextAdmin logo"
        role="presentation"
        quality={200}
      />

      <Image
        src={logo}
        fill
        className="hidden dark:block"
        alt="NextAdmin logo"
        role="presentation"
        quality={200}
      />
    </div>
  );
}
