import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/reseller/profile")({
  component: ResellerProfileLayout,
});

function ResellerProfileLayout() {
  return <Outlet />;
}
