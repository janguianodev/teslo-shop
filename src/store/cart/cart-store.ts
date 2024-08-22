import type { CartProduct } from "@/interfaces";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface State {
  cart: CartProduct[];
  getTotalItems: () => number;
  getCartSummary: () => {
    subtotal: number;
    tax: number;
    total: number;
    totalItems: number;
  };
  addProductToCart: (product: CartProduct) => void;
  updateProductQuantity: (product: CartProduct, quantity: number) => void;
  removeProduct: (product: CartProduct) => void;
  clearCart: () => void;
}

export const useCartStore = create<State>()(
  persist(
    (set, get) => ({
      cart: [],

      //methods
      getTotalItems: () => {
        const { cart } = get();

        return cart.reduce((total, item) => total + item.quantity, 0);
      },
      addProductToCart: (product: CartProduct) => {
        const { cart } = get();

        // 1. Check if the product is already in the cart with the size selected
        const productInCart = cart.some(
          (item) => item.id === product.id && item.size === product.size
        );

        if (!productInCart) {
          set({ cart: [...cart, product] });
          return;
        }

        // when product is already in the cart, increase the quantity
        const updatedCart = cart.map((item) => {
          if (item.id === product.id && item.size === product.size) {
            return { ...item, quantity: item.quantity + product.quantity };
          }

          return item;
        });

        set({ cart: updatedCart });
      },
      updateProductQuantity: (product: CartProduct, quantity: number) => {
        const { cart } = get();

        const updatedCartProduct = cart.map((item) => {
          if (item.id === product.id && item.size === product.size) {
            return { ...item, quantity: quantity };
          }

          return item;
        });

        set({ cart: updatedCartProduct });
      },
      removeProduct: (product: CartProduct) => {
        const { cart } = get();

        const updatedCartProducts = cart.filter(
          (item) => item.id !== product.id || item.size !== product.size
        );

        set({ cart: updatedCartProducts });
      },
      getCartSummary: () => {
        const { cart } = get();

        const subtotal = cart.reduce(
          (total, product) => product.quantity * product.price + total,
          0
        );
        const tax = subtotal * 0.15;
        const total = subtotal + tax;
        const totalItems = cart.reduce(
          (total, item) => total + item.quantity,
          0
        );

        return {
          subtotal,
          tax,
          total,
          totalItems,
        };
      },
      clearCart: () => {
        set({ cart: [] });
      },
    }),
    {
      name: "shopping-cart",
    }
  )
);
