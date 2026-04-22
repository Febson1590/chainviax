import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Chainviax — Premium Crypto Brokerage",
    short_name: "Chainviax",
    description:
      "Trade Bitcoin, Ethereum, and the top cryptocurrencies. Trade on your own or copy top traders.",
    start_url: "/",
    display: "standalone",
    background_color: "#05060a",
    theme_color: "#f4c440",
    icons: [
      {
        src: "/chainviax-icon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/chainviax-icon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
