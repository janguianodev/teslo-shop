"use client";

import { useCartStore } from "@/store";
import { currencyFormatter } from "@/utils";
import Image from "next/image";
import { useEffect, useState } from "react";

export const ProductsInCart = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const productsInCart = useCartStore((state) => state.cart);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  if (!isLoaded) {
    return <p>Loading...</p>;
  }
  return (
    <>
      {productsInCart.map((product) => (
        <div key={`${product.slug}-${product.size}`} className="flex mb-5">
          <Image
            src={`/products/${product.image}`}
            width={100}
            height={100}
            alt={product.title}
            className="mr-5 rounded"
          />
          <div>
            <span>
              {product.size} - {product.title} {product.quantity}
            </span>
            <p className="font-bold">
              {currencyFormatter(product.price * product.quantity)}
            </p>
          </div>
        </div>
      ))}
    </>
  );
};
