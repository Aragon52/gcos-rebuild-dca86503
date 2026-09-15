import { useState } from "react";
import { Link, useLocation } from "@/lib/router-compat";
import { LayoutDashboard, ShoppingBag, Package, MessageSquare, UserCog, LogOut, Home } from "lucide-react";
import { useReseller } from "@/lib/reseller-context-hooks";
import LogoIcon from "@/components/brand/LogoIcon";
import ThemeSwitcher from "./ThemeSwitcher";
import { resellerPath } from "@/lib/subdomain";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

export default function ResellerSidebar() {
  const { pathname } = useLocation();
  const { reseller, logout } = useReseller();
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);

  const menuItems = [
    { icon: LayoutDashboard, label: t("reseller.dashboard"), href: "/reseller/dashboard" },
    { icon: ShoppingBag, label: t("reseller.myShop"), href: "/reseller/shop" },
    { icon: Package, label: t("reseller.orders"), href: "/reseller/orders" },
    { icon: MessageSquare, label: t("reseller.messages"), href: "/reseller/messages" },
    { icon: UserCog, label: t("reseller.profile"), href: "/reseller/profile" },
  ].map(item => ({ ...item, href: resellerPath(item.href) }));

  if (!reseller) return null;

  return (
    <aside
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      className={cn(
        "hidden md:flex md:flex-col border-r border-border bg-sidebar min-h-screen sticky top-0 overflow-hidden transition-[width] duration-300 ease-in-out",
        expanded ? "md:w-64" : "md:w-16"
      )}
    >
      {/* Brand */}
      <div className="flex items-center gap-2 px-4 py-5 border-b border-border h-[69px]">
        <LogoIcon size={28} />
        <span
          className={cn(
            "font-semibold text-sm text-foreground whitespace-nowrap transition-opacity duration-200",
            expanded ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
        >
          {t("reseller.resellerPortal")}
        </span>
      </div>

      {/* Reseller info — only meaningful when expanded */}
      {expanded && (
        <div className="px-4 py-3 border-b border-border">
          <p className="text-xs text-muted-foreground">{t("reseller.shop")}</p>
          <p className="font-medium text-sm text-foreground truncate">{reseller.shopName}</p>
          <span className={`inline-block mt-1 text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${
            reseller.verified ? "bg-primary/10 text-primary" : "bg-secondary/10 text-secondary"
          }`}>
            {reseller.verified ? `${reseller.level} • ${t("reseller.verified")}` : t("reseller.unverified")}
          </span>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 space-y-0.5">
        {menuItems.map(({ icon: Icon, label, href }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              to={href}
              onClick={() => setExpanded(false)}
              title={!expanded ? label : undefined}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                active
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-sidebar-foreground hover:bg-sidebar-accent"
              )}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              <span
                className={cn(
                  "whitespace-nowrap transition-opacity duration-200",
                  expanded ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-2 py-3 border-t border-border">
        {expanded ? (
          <div className="px-2 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{t("reseller.theme")}</span>
              <ThemeSwitcher />
            </div>
            <div className="flex gap-2">
              <Link to="/" className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                <Home className="h-3.5 w-3.5" /> {t("reseller.mainSite")}
              </Link>
              <button onClick={logout} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive transition-colors ml-auto">
                <LogOut className="h-3.5 w-3.5" /> {t("common.logout")}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <Link to="/" title={t("reseller.mainSite")} className="text-muted-foreground hover:text-foreground transition-colors">
              <Home className="h-4 w-4" />
            </Link>
            <button onClick={logout} title={t("common.logout")} className="text-muted-foreground hover:text-destructive transition-colors">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
