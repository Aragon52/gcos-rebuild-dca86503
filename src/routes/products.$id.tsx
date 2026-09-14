import { createFileRoute } from "@tanstack/react-router";
import MainLayout from "@/components/layout/MainLayout";
import ProductDetail from "@/pages/ProductDetail";

export const Route = createFileRoute("/products/$id")({
  head: () => ({
    meta: [
      { title: "Product — GCOS" },
      { name: "description", content: "Product details on GCOS." },
      { property: "og:title", content: "Product — GCOS" },
      { property: "og:description", content: "Product details on GCOS." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProductsIdRoutePage,
});

function ProductsIdRoutePage() {
  return <MainLayout><ProductDetail /></MainLayout>;
}
