"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AddLinkPage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Link href="/links">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Legg til ny lenke</h1>
      </div>

      <div className="p-8 text-center">
        <p className="text-muted-foreground mb-4">
          Denne siden er nå erstattet med en dialog direkte på hovedsiden for
          lenkeadministrasjon.
        </p>
        <p className="text-muted-foreground mb-8">
          Vennligst gå tilbake til lenkeadministrasjon og bruk "Legg til ny
          lenke"-knappen der.
        </p>
        <Link href="/links">
          <Button>Gå til lenkeadministrasjon</Button>
        </Link>
      </div>
    </div>
  );
}
