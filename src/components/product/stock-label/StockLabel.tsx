"use client";

import { getStuckBySlug } from "@/actions/product/get-stock-by-slug";
import { titleFont } from "@/config/fonts";
import { useCallback, useEffect, useState } from "react";

interface Props {
  slug: string;
}

export const StockLabel = ({ slug }: Props) => {
  const [stock, setStock] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  const getStock = useCallback(async () => {
    const stock = await getStuckBySlug(slug);
    setStock(stock);
    setIsLoading(false);
  }, [slug]);

  useEffect(() => {
    getStock();
  }, [getStock]);

  return (
    <>
      {isLoading ? (
        // skeleton
        <h1
          className={`${titleFont.className} antialised font-bold text-lg bg-gray-200 animate-pulse`}
        >
          &nbsp;
        </h1>
      ) : (
        <h1 className={`${titleFont.className} antialised font-bold text-lg`}>
          Stock: {stock}
        </h1>
      )}
    </>
  );
};
