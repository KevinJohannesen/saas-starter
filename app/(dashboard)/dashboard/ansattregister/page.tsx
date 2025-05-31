"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Search, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

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

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch employees from the API
  const fetchEmployees = async () => {
    try {
      const response = await fetch("/api/team/employees");
      if (!response.ok) {
        throw new Error("Failed to fetch employees");
      }
      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      console.error("Error fetching employees:", error);
      toast.error("Kunne ikke laste ansatte", {
        description: "Prøv å laste siden på nytt.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Load employees when component mounts
  useEffect(() => {
    fetchEmployees();
  }, []);

  // Filter employees based on search term
  const filteredEmployees = employees.filter((employee) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      employee.name?.toLowerCase().includes(searchLower) ||
      false ||
      employee.email?.toLowerCase().includes(searchLower) ||
      false ||
      employee.position?.toLowerCase().includes(searchLower) ||
      false ||
      employee.department?.toLowerCase().includes(searchLower) ||
      false
    );
  });

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ansattregister</h1>
          <p className="text-muted-foreground">
            Se og administrer bedriftens ansatte
          </p>
        </div>
        <Link href="/dashboard/ansattregister/add">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Legg til ansatt
          </Button>
        </Link>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Søk etter ansatte..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredEmployees.length > 0 ? (
          filteredEmployees.map((employee) => (
            <Link
              href={`/dashboard/ansattregister/${employee.id}`}
              key={employee.id}
            >
              <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="font-medium">
                        {getInitials(employee.name)}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-medium">{employee.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {employee.position || "Ingen stilling"}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Avdeling: </span>
                      {employee.department || "Ikke spesifisert"}
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">E-post: </span>
                      {employee.email}
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Telefon: </span>
                      {employee.phone || "Ikke spesifisert"}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center py-10">
            <p className="text-muted-foreground">
              {searchTerm
                ? "Ingen ansatte funnet som matcher søket."
                : "Ingen ansatte funnet. Legg til noen ansatte for å komme i gang."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
