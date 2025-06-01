"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Plus } from "lucide-react";

export function DashboardHeader() {
  const pathname = usePathname();

  return (
    <div className="border-b pb-4 mb-6">
      <div className="flex gap-4">
        <Link href="/dashboard/fakturaer">
          <Button
            variant={
              pathname === "/dashboard/fakturaer" ? "default" : "outline"
            }
            className="flex items-center gap-2"
          >
            <LayoutDashboard className="h-4 w-4" />
            <span>Dashboard</span>
          </Button>
        </Link>
        <Link href="/dashboard/fakturaer/invoice/new">
          <Button
            variant={
              pathname === "/dashboard/fakturaer/invoice/new"
                ? "default"
                : "outline"
            }
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            <span>Ny faktura</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
