import { NextResponse } from "next/server";
import { getMarketAssets } from "@/lib/coingecko";

/**
 * Public market snapshot used by the landing page to refresh prices every
 * ~30 seconds without a full page reload. Upstream CoinGecko calls are
 * cached for 60 s inside getMarketAssets, so this is safe to poll often.
 */
export async function GET() {
  const assets = await getMarketAssets();
  return NextResponse.json(
    { assets, fetchedAt: new Date().toISOString() },
    {
      headers: {
        "Cache-Control": "public, max-age=20, s-maxage=30, stale-while-revalidate=60",
      },
    },
  );
}
