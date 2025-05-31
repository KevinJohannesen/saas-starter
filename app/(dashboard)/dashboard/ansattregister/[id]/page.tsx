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
} from "lucide-react";
import Link from "next/link";

// Dette ville normalt komme fra en database
const employee = {
  id: "1",
  name: "Jan Dahl",
  position: "Prosjektleder",
  department: "Ledelse",
  email: "jan.dahl@byggebedrift.no",
  phone: "922 33 444",
  address: "Byggeveien 123, 0123 Oslo",
  hireDate: "2018-05-12",
  emergencyContact: "Kari Dahl - 988 77 666",
  skills: [
    "Prosjektplanlegging",
    "Teamledelse",
    "Budsjettstyring",
    "Risikovurdering",
    "Kunderelasjoner",
  ],
  certifications: [
    "Prosjektledersertifisering",
    "HMS-kurs 40 timer",
    "Førstehjelp",
  ],
  projects: [
    "Sentrum Kontorbygg",
    "Elvebredden Leiligheter",
    "Riksvei 7 Utvidelse",
  ],
};

export default function EmployeeDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Link href="/employees">
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
                <span className="text-2xl font-medium">JD</span>
              </div>
              <div className="text-center">
                <h2 className="text-xl font-bold">{employee.name}</h2>
                <p className="text-muted-foreground">{employee.position}</p>
              </div>
              <div className="w-full space-y-2">
                <div className="flex items-center">
                  <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">{employee.department}</span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">{employee.email}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">{employee.phone}</span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Link href={`/employees/${params.id}/edit`}>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Rediger
              </Button>
            </Link>
            <Button variant="outline" size="sm" className="text-destructive">
              <Trash className="h-4 w-4 mr-2" />
              Slett
            </Button>
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
                  <p>{employee.address}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Ansettelsesdato
                  </h3>
                  <p>
                    {new Date(employee.hireDate).toLocaleDateString("no-NO")}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Nødkontakt
                  </h3>
                  <p>{employee.emergencyContact}</p>
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
              </div>
              <Separator />
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  Sertifiseringer
                </h3>
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
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Nåværende prosjekter</CardTitle>
              <CardDescription>
                Prosjekter den ansatte jobber med
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {employee.projects.map((project, index) => (
                  <div key={index} className="flex items-center">
                    <Briefcase className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{project}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
