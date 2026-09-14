import { createFileRoute } from "@tanstack/react-router";
import MainLayout from "@/components/layout/MainLayout";
import HomePage from "@/pages/Index";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Home — GCOS" },
      { name: "description", content: "Shop the GCOS marketplace — products, deals and reseller stores." },
      { property: "og:title", content: "Home — GCOS" },
      { property: "og:description", content: "Shop the GCOS marketplace — products, deals and reseller stores." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomeRoutePage,
});

function HomeRoutePage() {
  return <MainLayout><HomePage /></MainLayout>;
}
