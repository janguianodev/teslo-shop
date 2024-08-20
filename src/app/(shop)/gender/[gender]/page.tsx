export const revalidate = 60; //seconds

import { getPaginatedProductsWithImages } from "@/actions";
import { Pagination, ProductGrid, Title } from "@/components";
import { initialData } from "@/seed/seed";
import { Gender } from "@prisma/client";
import { redirect } from "next/navigation";

// import { notFound } from "next/navigation";
const seedProducts = initialData.products;

interface Props {
  params: {
    gender: string;
  };
  searchParams: {
    page?: string;
  };
}

export default async function GenderPage({ params, searchParams }: Props) {
  const { gender } = params;

  const page = searchParams.page ? parseInt(searchParams.page) : 1;
  const { products, currentPage, totalPages } =
    await getPaginatedProductsWithImages({ page, gender: gender as Gender });

  if (products.length === 0) redirect(`/gender/${gender}`);

  const labels: Record<string, string> = {
    men: "Men",
    women: "Women",
    kid: "Kids",
    unisex: "All",
  };
  console.log("gender", gender);

  // if (id === "kids") {
  //   we'll change this validation later
  //   notFound();
  // }

  return (
    <>
      <Title
        title={`Products for ${labels[gender]}`}
        subtitle="All products"
        className="mb-2"
      />

      <ProductGrid products={products} />

      <Pagination totalPages={totalPages} />
    </>
  );
}
