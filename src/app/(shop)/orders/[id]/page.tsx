import { getOrderById } from "@/actions";
import { QuantitySelector, Title } from "@/components";
import { initialData } from "@/seed/seed";
import { currencyFormatter } from "@/utils";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { IoCartOutline } from "react-icons/io5";

const productsInCart = initialData.products.slice(0, 3);

interface Props {
  params: {
    id: string;
  };
}

export default async function Order({ params }: Props) {
  const { id } = params;
  const { order, ok } = await getOrderById(id);

  if (!ok) {
    redirect("/");
  }

  const address = order?.orderAddress;

  return (
    <div className="flex justify-center items-center mb-72 px-10 sm:px-0">
      <div className="flex flex-col w-[1000px]">
        <Title title={`Order #${id.split("-").at(-1)}`} />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          {/* Cart */}
          <div className="flex flex-col mt-5">
            <div
              className={clsx(
                "flex items-center rounded-lg py-2 px-3.5 text-xs font-bold text-white mb-5",
                {
                  "bg-red-500": !order?.isPaid,
                  "bg-green-700": order?.isPaid,
                }
              )}
            >
              <IoCartOutline size={30} />
              <span className="mx-2">
                {order?.isPaid ? "Payed" : "Payment pending"}
              </span>
            </div>

            {/* Cart Items */}
            {order?.OrderItem.map((item) => (
              <div
                key={item.product.slug + "-" + item.size}
                className="flex mb-5"
              >
                <Image
                  src={`/products/${item.product.ProductImage[0].url}`}
                  width={100}
                  height={100}
                  alt={item.product.title}
                  className="mr-5 rounded"
                />
                <div>
                  <p>{item.product.title}</p>
                  <p>
                    {item.price} x {item.quantity}
                  </p>
                  <p className="font-bold">
                    Subtotal: {currencyFormatter(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Checkout */}
          <div className="bg-white rounded-xl shadow-xl p-7">
            <h2 className="text-2xl mb-2">Shipping address</h2>
            <div className="mb-10">
              <p className="text-xl">
                {address!.firstName} {address!.lastName}
              </p>
              <p>{address!.address}</p>
              <p>{address!.address2}</p>
              <p>{address!.postalCode}</p>
              <p>
                {address!.city}, {address!.countryId}
              </p>
              <p>{address!.phone}</p>
            </div>

            {/* Divider */}
            <div className="w-full h-0.5 rounded bg-gray-200 mb-10" />

            <h2 className="text-2xl mb-2">Order details</h2>
            <div className="grid grid-cols-2">
              <span># of products</span>
              <span className="text-right">
                {order?.itemsInOrder === 1
                  ? "1 item"
                  : `${order?.itemsInOrder} items`}
              </span>

              <span>Subtotal</span>
              <span className="text-right">
                {currencyFormatter(order!.subtotal)}
              </span>

              <span>Taxes (15%)</span>
              <span className="text-right">
                {currencyFormatter(order!.tax)}
              </span>

              <span className="mt-5 text-2xl">Total:</span>
              <span className="mt-5 text-right text-2xl">
                {currencyFormatter(order!.total)}
              </span>
            </div>

            <div className="mt-5 mb-2 w-full">
              <div
                className={clsx(
                  "flex items-center rounded-lg py-2 px-3.5 text-xs font-bold text-white mb-5",
                  {
                    "bg-red-500": !order?.isPaid,
                    "bg-green-700": order?.isPaid,
                  }
                )}
              >
                <IoCartOutline size={30} />
                <span className="mx-2">
                  {order?.isPaid ? "Payed" : "Payment pending"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
