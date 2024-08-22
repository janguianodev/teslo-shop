"use client";

import { placeOrder } from "@/actions";
import { useAddressStore, useCartStore } from "@/store";
import { currencyFormatter } from "@/utils";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const PlaceOrder = () => {
  const [loaded, setLoaded] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const address = useAddressStore((state) => state.address);
  const cart = useCartStore((state) => state.cart);
  const clearCart = useCartStore((state) => state.clearCart);
  const router = useRouter();

  const { subtotal, tax, total, totalItems } = useCartStore((state) =>
    state.getCartSummary()
  );

  useEffect(() => {
    setLoaded(true);
  }, []);

  const onPlaceOrder = async () => {
    setIsPlacingOrder(true);

    const productsToOrder = cart.map((product) => ({
      productId: product.id,
      quantity: product.quantity,
      size: product.size,
    }));

    //call server action
    const response = await placeOrder(productsToOrder, address);
    if (!response.ok) {
      setIsPlacingOrder(false);
      setErrorMessage(response.message);
      return;
    }

    // * everything went well
    clearCart();
    router.replace(`/orders/${response.order?.id}`);

    setIsPlacingOrder(false);
  };

  if (!loaded) return <p>Loading...</p>;

  return (
    <div className="bg-white rounded-xl shadow-xl p-7">
      <h2 className="text-2xl mb-2">Shipping address</h2>
      <div className="mb-10">
        <p className="text-xl">
          {address.firstName} {address.lastName}
        </p>
        <p>{address.address}</p>
        <p>{address.address2}</p>
        <p>{address.postalCode}</p>
        <p>
          {address.city}, {address.country}
        </p>
        <p>{address.phone}</p>
      </div>

      {/* Divider */}
      <div className="w-full h-0.5 rounded bg-gray-200 mb-10" />

      <h2 className="text-2xl mb-2">Order details</h2>
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

      <div className="mt-5 mb-2 w-full">
        {/* Disclaimer */}
        <p className="mb-5">
          <span className="text-xs">
            By placing this order, you agree to our{" "}
            <a href="#" className="underline">
              terms and conditions{" "}
            </a>
            and our{" "}
            <a href="#" className="underline">
              privacy policy
            </a>
            .
          </span>
        </p>

        <p className="text-red-500">{errorMessage}</p>
        <button
          // href="/orders/123"
          onClick={onPlaceOrder}
          className={clsx({
            "btn-primary": !isPlacingOrder,
            "btn-disabled": isPlacingOrder,
          })}
        >
          Place Order
        </button>
      </div>
    </div>
  );
};
