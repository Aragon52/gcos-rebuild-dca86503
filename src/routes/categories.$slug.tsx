import { createFileRoute } from "@tanstack/react-router";
import MainLayout from "@/components/layout/MainLayout";
import CategoryDetail from "@/pages/CategoryDetail";

export const Route = createFileRoute("/categories/$slug")({
  head: () => ({
    meta: [
      { title: "Category — GCOS" },
      { name: "description", content: "Browse products in this category on GCOS." },
      { property: "og:title", content: "Category — GCOS" },
      { property: "og:description", content: "Browse products in this category on GCOS." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CategoriesSlugRoutePage,
});

function CategoriesSlugRoutePage() {
  return <MainLayout><CategoryDetail /></MainLayout>;
}
