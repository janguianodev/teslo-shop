export const revalidate = 0;
// https://tailwindcomponents.com/component/hoverable-table
import { getPaginatedOrders } from "@/actions";
import { Title } from "@/components";

import Link from "next/link";
import { redirect } from "next/navigation";
import { IoCardOutline } from "react-icons/io5";

export default async function OrdersPage() {
  const { ok, orders = [] } = await getPaginatedOrders();

  if (!ok) {
    redirect("/auth/login");
  }

  return (
    <>
      <Title title="All orders" />

      <div className="mb-10">
        <table className="min-w-full">
          <thead className="bg-gray-200 border-b">
            <tr>
              <th
                scope="col"
                className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
              >
                #ID
              </th>
              <th
                scope="col"
                className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
              >
                Full name
              </th>
              <th
                scope="col"
                className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
              >
                Payment status
              </th>
              <th
                scope="col"
                className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {orders?.map((order) => (
              <tr
                key={order.id}
                className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {order.id.split("-").at(-1)}
                </td>
                <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                  {order.orderAddress?.firstName} {order.orderAddress?.lastName}
                </td>
                <td className="flex items-center text-sm  text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                  {order.isPaid ? (
                    <>
                      <IoCardOutline className="text-green-800" />
                      <span className="mx-2 text-green-800">Payed</span>
                    </>
                  ) : (
                    <>
                      <IoCardOutline className="text-red-800" />
                      <span className="mx-2 text-red-800">Not Payed</span>
                    </>
                  )}
                </td>
                <td className="text-sm text-gray-900 font-light px-6 ">
                  <Link
                    href={`/orders/${order.id}`}
                    className="hover:underline"
                  >
                    See order details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
