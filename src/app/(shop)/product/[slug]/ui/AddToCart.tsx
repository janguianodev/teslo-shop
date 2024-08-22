"use client";

import { QuantitySelector, SizeSelector } from "@/components";
import { CartProduct, Product, Size } from "@/interfaces";
import { useCartStore } from "@/store";
import React, { useState } from "react";

interface Props {
  product: Product;
}

export const AddToCart = ({ product }: Props) => {
  const [size, setSize] = useState<Size | undefined>();
  const [quantity, setQuantity] = useState<number>(1);
  const [postToCart, setPostToCart] = useState<boolean>(false);
  const addProductToCart = useCartStore((state) => state.addProductToCart);

  const addToCart = () => {
    setPostToCart(true);
    if (!size) {
      return;
    }

    // TODO: add to cart
    const cartProduct: CartProduct = {
      id: product.id,
      slug: product.slug,
      title: product.title,
      price: product.price,
      quantity,
      size,
      image: product.images[0],
    };

    addProductToCart(cartProduct);
    setPostToCart(false);
    setSize(undefined);
    setQuantity(1);
  };

  return (
    <>
      {postToCart && !size && (
        <span className="mt-2 text-red-500 fade-in">
          You need to select a size
        </span>
      )}
      {/* Size selector */}
      <SizeSelector
        selectedSize={size}
        availableSizes={product.sizes}
        onSizeChange={setSize}
      />

      {/* Quantity selector */}
      <QuantitySelector quantity={quantity} onQuantityChange={setQuantity} />

      {/* Button */}
      <button className="btn-primary my-5" onClick={addToCart}>
        Add to cart
      </button>
    </>
  );
};
