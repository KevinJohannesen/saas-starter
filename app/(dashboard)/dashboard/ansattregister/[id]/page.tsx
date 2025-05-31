"use client";

import { useState, useEffect } from "react";
import { use } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Mail,
  Phone,
  Edit,
  Trash,
  Building,
  Briefcase,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Define the type for an employee
interface Employee {
  id: number;
  userId: number;
  teamId: number;
  role: string;
  position: string | null;
  department: string | null;
  phone: string | null;
  address: string | null;
  hireDate: string | null;
  emergencyContact: string | null;
  skills: string[];
  certifications: string[];
  joinedAt: string;
  updatedAt: string;
  name: string | null;
  email: string;
}

export default function EmployeeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { id } = use(params);

  // Fetch employee details
  const fetchEmployee = async () => {
    try {
      const response = await fetch(`/api/team/employees/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch employee");
      }
      const data = await response.json();
      setEmployee(data);
    } catch (error) {
      console.error("Error fetching employee:", error);
      toast.error("Kunne ikke laste ansattdetaljer", {
        description: "Prøv å laste siden på nytt.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Load employee when component mounts
  useEffect(() => {
    fetchEmployee();
  }, [id]);

  // Delete employee
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/team/employees/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete employee");
      }

      toast.success("Ansatt fjernet", {
        description: `${employee?.name} er fjernet fra teamet.`,
      });
      router.push("/dashboard/ansattregister");
    } catch (error) {
      console.error("Error deleting employee:", error);
      toast.error("Kunne ikke fjerne ansatt", {
        description: "Prøv igjen senere.",
      });
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  // Get initials for avatar
  const getInitials = (name: string | null) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // Get department name in Norwegian
  const getDepartmentName = (department: string | null) => {
    if (!department) return "Ikke spesifisert";

    switch (department) {
      case "management":
        return "Ledelse";
      case "operations":
        return "Drift";
      case "finance":
        return "Økonomi";
      case "hr":
        return "HR";
      case "safety":
        return "HMS";
      case "estimating":
        return "Kalkulasjon";
      case "administration":
        return "Administrasjon";
      default:
        return department;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">Ansatt ikke funnet.</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => router.push("/dashboard/ansattregister")}
        >
          Tilbake til ansattregister
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Link href="/dashboard/ansattregister">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Ansattprofil</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-2xl font-medium">
                  {getInitials(employee.name)}
                </span>
              </div>
              <div className="text-center">
                <h2 className="text-xl font-bold">{employee.name}</h2>
                <p className="text-muted-foreground">
                  {employee.position || "Ingen stilling"}
                </p>
              </div>
              <div className="w-full space-y-2">
                <div className="flex items-center">
                  <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">
                    {getDepartmentName(employee.department)}
                  </span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">{employee.email}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">
                    {employee.phone || "Ikke spesifisert"}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Link href={`/dashboard/ansattregister/${id}/edit`}>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Rediger
              </Button>
            </Link>
            <Dialog
              open={isDeleteDialogOpen}
              onOpenChange={setIsDeleteDialogOpen}
            >
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-destructive"
                >
                  <Trash className="h-4 w-4 mr-2" />
                  Slett
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Er du sikker?</DialogTitle>
                  <DialogDescription>
                    Dette vil fjerne {employee.name} fra teamet. Denne
                    handlingen kan ikke angres.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsDeleteDialogOpen(false)}
                  >
                    Avbryt
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sletter...
                      </>
                    ) : (
                      "Slett ansatt"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>

        <div className="space-y-6 md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Personlig informasjon</CardTitle>
              <CardDescription>
                Ansattdetaljer og kontaktinformasjon
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Adresse
                  </h3>
                  <p>{employee.address || "Ikke spesifisert"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Ansettelsesdato
                  </h3>
                  <p>
                    {employee.hireDate
                      ? new Date(employee.hireDate).toLocaleDateString("no-NO")
                      : "Ikke spesifisert"}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Nødkontakt
                  </h3>
                  <p>{employee.emergencyContact || "Ikke spesifisert"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ferdigheter og sertifiseringer</CardTitle>
              <CardDescription>Faglige kvalifikasjoner</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  Ferdigheter
                </h3>
                {employee.skills && employee.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {employee.skills.map((skill, index) => (
                      <div
                        key={index}
                        className="bg-muted px-3 py-1 rounded-full text-sm"
                      >
                        {skill}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    Ingen ferdigheter registrert
                  </p>
                )}
              </div>
              <Separator />
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  Sertifiseringer
                </h3>
                {employee.certifications &&
                employee.certifications.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {employee.certifications.map((cert, index) => (
                      <div
                        key={index}
                        className="bg-muted px-3 py-1 rounded-full text-sm"
                      >
                        {cert}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    Ingen sertifiseringer registrert
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
