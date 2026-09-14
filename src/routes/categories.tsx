import { createFileRoute } from "@tanstack/react-router";
import MainLayout from "@/components/layout/MainLayout";
import Categories from "@/pages/Categories";

export const Route = createFileRoute("/categories")({
  head: () => ({
    meta: [
      { title: "Categories — GCOS" },
      { name: "description", content: "Browse all product categories on GCOS." },
      { property: "og:title", content: "Categories — GCOS" },
      { property: "og:description", content: "Browse all product categories on GCOS." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CategoriesRoutePage,
});

function CategoriesRoutePage() {
  return <MainLayout><Categories /></MainLayout>;
}
