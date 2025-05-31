"use client";

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
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

export default function AddEmployeePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    position: "",
    department: "",
    hireDate: "",
    address: "",
    emergencyContact: "",
    skills: "",
    certifications: "",
    role: "member",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/team/employees", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to add employee");
      }

      toast.success("Ansatt lagt til", {
        description: "Den nye ansatte er lagt til i systemet.",
      });
      router.push("/dashboard/ansattregister");
    } catch (error) {
      console.error("Error adding employee:", error);
      toast.error("Kunne ikke legge til ansatt", {
        description: "Prøv igjen senere.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Link href="/dashboard/ansattregister">
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
                <Label htmlFor="firstName">Fornavn</Label>
                <Input
                  id="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Etternavn</Label>
                <Input
                  id="lastName"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-post</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefon</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="position">Stilling</Label>
                <Input
                  id="position"
                  value={formData.position}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Avdeling</Label>
                <Select
                  value={formData.department}
                  onValueChange={(value) =>
                    handleSelectChange("department", value)
                  }
                >
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
                <Label htmlFor="hireDate">Ansettelsesdato</Label>
                <Input
                  id="hireDate"
                  type="date"
                  value={formData.hireDate}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Rolle</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => handleSelectChange("role", value)}
                >
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Velg rolle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrator</SelectItem>
                    <SelectItem value="manager">Leder</SelectItem>
                    <SelectItem value="member">Medlem</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Adresse</Label>
              <Textarea
                id="address"
                rows={3}
                value={formData.address}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="emergencyContact">Nødkontakt</Label>
              <Input
                id="emergencyContact"
                placeholder="Navn - Telefonnummer"
                value={formData.emergencyContact}
                onChange={handleChange}
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
                value={formData.skills}
                onChange={handleChange}
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
                value={formData.certifications}
                onChange={handleChange}
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
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Legger til...
                </>
              ) : (
                "Legg til ansatt"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
