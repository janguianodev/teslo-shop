import { QuantitySelector, Title } from "@/components";
import { initialData } from "@/seed/seed";
import Image from "next/image";
import Link from "next/link";

const productsInCart = initialData.products.slice(0, 3);

export default function CartPage() {
  return (
    <div className="flex justify-center items-center mb-72 px-10 sm:px-0">
      <div className="flex flex-col w-[1000px]">
        <Title title="Verify Order" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          {/* Cart */}
          <div className="flex flex-col mt-5">
            <span className="text-xl">Verify items</span>
            <Link href="/cart" className="underline mb-5">
              Edit Cart
            </Link>

            {/* Cart Items */}
            {productsInCart.map((product) => (
              <div key={product.slug} className="flex mb-5">
                <Image
                  src={`/products/${product.images[0]}`}
                  width={100}
                  height={100}
                  alt={product.title}
                  className="mr-5 rounded"
                />
                <div>
                  <p>{product.title}</p>
                  <p>{product.price} x 3</p>
                  <p className="font-bold">Subtotal: ${product.price * 3}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Checkout */}
          <div className="bg-white rounded-xl shadow-xl p-7">
            <h2 className="text-2xl mb-2">Shipping address</h2>
            <div className="mb-10">
              <p className="text-xl">Josue Anguiano</p>
              <p>Nogal Poniente 511</p>
              <p>Fraccionamiento Valle de los Almendros</p>
              <p>Saltillo</p>
              <p>Coahuila</p>
              <p>844 341 75 60</p>
            </div>

            {/* Divider */}
            <div className="w-full h-0.5 rounded bg-gray-200 mb-10" />

            <h2 className="text-2xl mb-2">Order details</h2>
            <div className="grid grid-cols-2">
              <span># of products</span>
              <span className="text-right">3 items</span>

              <span>Subtotal</span>
              <span className="text-right">$100</span>

              <span>Taxes (15%)</span>
              <span className="text-right">$100</span>

              <span className="mt-5 text-2xl">Total:</span>
              <span className="mt-5 text-right text-2xl">$100</span>
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

              <Link
                href="/orders/123"
                className="flex btn-primary justify-center"
              >
                Place Order
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
