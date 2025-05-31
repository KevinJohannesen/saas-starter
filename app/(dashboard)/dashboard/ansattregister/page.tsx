import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import Link from "next/link";

// Eksempeldata for ansatte
const employees = [
  {
    id: "1",
    name: "Jan Dahl",
    position: "Prosjektleder",
    department: "Ledelse",
    email: "jan.dahl@byggebedrift.no",
    phone: "922 33 444",
    avatar: "JD",
  },
  {
    id: "2",
    name: "Anne Solberg",
    position: "Anleggsleder",
    department: "Drift",
    email: "anne.solberg@byggebedrift.no",
    phone: "933 44 555",
    avatar: "AS",
  },
  {
    id: "3",
    name: "Robert Jensen",
    position: "HMS-ansvarlig",
    department: "HMS",
    email: "robert.jensen@byggebedrift.no",
    phone: "944 55 666",
    avatar: "RJ",
  },
  {
    id: "4",
    name: "Emma Danielsen",
    position: "Regnskapsfører",
    department: "Økonomi",
    email: "emma.danielsen@byggebedrift.no",
    phone: "955 66 777",
    avatar: "ED",
  },
  {
    id: "5",
    name: "Morten Wilhelmsen",
    position: "Utstyrsansvarlig",
    department: "Drift",
    email: "morten.wilhelmsen@byggebedrift.no",
    phone: "966 77 888",
    avatar: "MW",
  },
  {
    id: "6",
    name: "Sara Berntsen",
    position: "HR-spesialist",
    department: "HR",
    email: "sara.berntsen@byggebedrift.no",
    phone: "977 88 999",
    avatar: "SB",
  },
  {
    id: "7",
    name: "David Mikkelsen",
    position: "Kalkulator",
    department: "Kalkulasjon",
    email: "david.mikkelsen@byggebedrift.no",
    phone: "988 99 000",
    avatar: "DM",
  },
  {
    id: "8",
    name: "Jenny Thoresen",
    position: "Administrasjonsassistent",
    department: "Administrasjon",
    email: "jenny.thoresen@byggebedrift.no",
    phone: "999 00 111",
    avatar: "JT",
  },
];

export default function EmployeesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ansattregister</h1>
          <p className="text-muted-foreground">
            Se og administrer bedriftens ansatte
          </p>
        </div>
        <Link href="/employees/add">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Legg til ansatt
          </Button>
        </Link>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Søk etter ansatte..." className="pl-8" />
        </div>
        <Button variant="outline">Filter</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {employees.map((employee) => (
          <Link href={`/employees/${employee.id}`} key={employee.id}>
            <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="font-medium">{employee.avatar}</span>
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-medium">{employee.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {employee.position}
                    </p>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Avdeling: </span>
                    {employee.department}
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">E-post: </span>
                    {employee.email}
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Telefon: </span>
                    {employee.phone}
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
