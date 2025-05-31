"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AddEmployeePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // I en virkelig applikasjon ville du lagre dette i en database
    // For nå simulerer vi bare en vellykket innsending
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Ansatt lagt til",
        description: "Den nye ansatte er lagt til i systemet.",
      });
      router.push("/employees");
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Link href="/employees">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">
          Legg til ny ansatt
        </h1>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Personlig informasjon</CardTitle>
            <CardDescription>
              Skriv inn den ansattes grunnleggende informasjon
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first-name">Fornavn</Label>
                <Input id="first-name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last-name">Etternavn</Label>
                <Input id="last-name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-post</Label>
                <Input id="email" type="email" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefon</Label>
                <Input id="phone" type="tel" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="position">Stilling</Label>
                <Input id="position" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Avdeling</Label>
                <Select required>
                  <SelectTrigger id="department">
                    <SelectValue placeholder="Velg avdeling" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="management">Ledelse</SelectItem>
                    <SelectItem value="operations">Drift</SelectItem>
                    <SelectItem value="finance">Økonomi</SelectItem>
                    <SelectItem value="hr">HR</SelectItem>
                    <SelectItem value="safety">HMS</SelectItem>
                    <SelectItem value="estimating">Kalkulasjon</SelectItem>
                    <SelectItem value="administration">
                      Administrasjon
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="hire-date">Ansettelsesdato</Label>
                <Input id="hire-date" type="date" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Adresse</Label>
              <Textarea id="address" rows={3} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="emergency-contact">Nødkontakt</Label>
              <Input
                id="emergency-contact"
                placeholder="Navn - Telefonnummer"
              />
            </div>
          </CardContent>

          <CardHeader>
            <CardTitle>Ferdigheter og sertifiseringer</CardTitle>
            <CardDescription>Skriv inn faglige kvalifikasjoner</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="skills">Ferdigheter (kommaseparert)</Label>
              <Textarea
                id="skills"
                placeholder="Prosjektplanlegging, Teamledelse, Budsjettstyring"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="certifications">
                Sertifiseringer (kommaseparert)
              </Label>
              <Textarea
                id="certifications"
                placeholder="Prosjektledersertifisering, HMS-kurs, Førstehjelp"
                rows={2}
              />
            </div>
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              type="button"
              onClick={() => router.back()}
            >
              Avbryt
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Legger til..." : "Legg til ansatt"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
