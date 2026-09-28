import { useParams } from "react-router";

import { StockCurvePool } from "@/components/stockcurve-pool";

export function meta() {
  return [{ title: "Pool — curv" }];
}

export default function PoolRoute() {
  const { symbol } = useParams();
  return <StockCurvePool symbol={symbol ?? "moss"} />;
}
