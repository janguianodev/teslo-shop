"use client";

import { ProductImage, QuantitySelector } from "@/components";
import { useCartStore } from "@/store";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export const ProductsInCart = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const updateProductQuantity = useCartStore(
    (state) => state.updateProductQuantity
  );
  const removeProduct = useCartStore((state) => state.removeProduct);
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
          <ProductImage
            src={product.image}
            width={100}
            height={100}
            alt={product.title}
            className="mr-5 rounded"
          />
          <div>
            <Link
              className="hover:underline cursor-pointer"
              href={`/product/${product.slug}`}
            >
              {product.size} - {product.title}
            </Link>
            <p>{product.price}</p>
            <QuantitySelector
              quantity={product.quantity}
              onQuantityChange={(quantity) =>
                updateProductQuantity(product, quantity)
              }
            />

            <button
              className="underline mt-3"
              onClick={() => removeProduct(product)}
            >
              Remove
            </button>
          </div>
        </div>
      ))}
    </>
  );
};
