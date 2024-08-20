"use client";

import { useCartStore } from "@/store";
import { currencyFormatter } from "@/utils";
import { useEffect, useState } from "react";

export const OrderSummary = () => {
  const [loaded, setLoaded] = useState(false);
  const { subtotal, tax, total, totalItems } = useCartStore((state) =>
    state.getCartSummary()
  );

  useEffect(() => {
    setLoaded(true);
  }, []);

  if (!loaded) {
    return <p>Loading...</p>;
  }
  return (
    <>
      <div className="grid grid-cols-2">
        <span># of products</span>
        <span className="text-right">
          {totalItems === 1 ? "1 item" : `${totalItems} items`}
        </span>

        <span>Subtotal</span>
        <span className="text-right">{currencyFormatter(subtotal)}</span>

        <span>Taxes (15%)</span>
        <span className="text-right">{currencyFormatter(tax)}</span>

        <span className="mt-5 text-2xl">Total:</span>
        <span className="mt-5 text-right text-2xl">
          {currencyFormatter(total)}
        </span>
      </div>
    </>
  );
};
