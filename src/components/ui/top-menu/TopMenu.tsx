"use client";

import { titleFont } from "@/config/fonts";
import { useCartStore, useUIStore } from "@/store";
import Link from "next/link";
import { useEffect, useState } from "react";
import { IoCartOutline, IoSearchOutline } from "react-icons/io5";

export const TopMenu = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const openSidebar = useUIStore((state) => state.openSidebar);
  const totalItemsInCart = useCartStore((state) => state.getTotalItems());

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <nav className="flex px-5 justify-between items-center w-full">
      {/* Logo */}
      <div>
        <Link href="/">
          <span className={`${titleFont.className} antialiased font-bold`}>
            Teslo
          </span>
          <span> | Shop</span>
        </Link>
      </div>

      {/* center menu */}
      <div className="hidden sm:block">
        <Link
          href="/gender/men"
          className="m-2 p-2 rounded-md transition-all hover:bg-gray-100"
        >
          Men
        </Link>
        <Link
          href="/gender/women"
          className="m-2 p-2 rounded-md transition-all hover:bg-gray-100"
        >
          Women
        </Link>
        <Link
          href="/gender/kid"
          className="m-2 p-2 rounded-md transition-all hover:bg-gray-100"
        >
          Kids
        </Link>
      </div>

      {/* search, cart, menu */}
      <div className="flex items-center">
        <Link href="/search" className="mx-2">
          <IoSearchOutline className="w-5 h-5" />
        </Link>
        <Link
          href={totalItemsInCart === 0 && isLoaded ? "empty" : "/cart"}
          className="mx-2"
        >
          <div className="relative">
            {isLoaded && totalItemsInCart > 0 && (
              <span className="fade-in absolute text-xs px-1 rounded-full font-bold -top-2 -right-2 bg-blue-700 text-white">
                {totalItemsInCart}
              </span>
            )}
          </div>
          <IoCartOutline className="w-5 h-5" />
        </Link>

        <button
          onClick={openSidebar}
          className="m-2 p-2 rounded-md transition-all hover:bg-gray-100"
        >
          Menu
        </button>
      </div>
    </nav>
  );
};
