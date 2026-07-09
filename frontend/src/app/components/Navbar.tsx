import React from "react";
import Link from "next/link";
import Image from "next/image";

const Navbar: React.FC = () => {
  return (
    <div className="flex justify-between items-center py-2">
      <Link href="/" className="flex items-center space-x-2">
        <div className="relative w-[30px] h-[30px]">
          <Image
            src="/logoipsum.svg"
            alt="logo"
            fill
            className="object-cover"
          />
        </div>
        <span className="text-2xl font-bold non md:block">VISION 11</span>
      </Link>
    </div>
  );
};

export default Navbar;
