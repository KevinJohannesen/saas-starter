import Link from "next/link";
import {
  Users,
  Settings,
  Shield,
  Activity,
  CalculatorIcon,
  Link as LinkIcon,
  FileText,
} from "lucide-react";

export default function DashboardPage() {
  const dashboardItems = [
    {
      href: "/dashboard/kalkulator",
      icon: CalculatorIcon,
      title: "Kalkulator",
      description: "Beregn indirekte kostnader for dine prosjekter",
      color: "bg-blue-50 border-blue-200 hover:bg-blue-100",
    },
    {
      href: "/dashboard/fakturaer",
      icon: FileText,
      title: "Fakturaer",
      description: "Opprett og administrer fakturaer",
      color: "bg-green-50 border-green-200 hover:bg-green-100",
    },
    {
      href: "/dashboard/team",
      icon: Users,
      title: "Team",
      description: "Administrer teammedlemmer og tilganger",
      color: "bg-purple-50 border-purple-200 hover:bg-purple-100",
    },
    {
      href: "/dashboard/lenker",
      icon: LinkIcon,
      title: "Lenker",
      description: "Administrer nyttige lenker og ressurser",
      color: "bg-orange-50 border-orange-200 hover:bg-orange-100",
    },
    {
      href: "/dashboard/selskapsinformasjon",
      icon: Settings,
      title: "Bedriftsinformasjon",
      description: "Oppdater bedriftsinformasjon og innstillinger",
      color: "bg-gray-50 border-gray-200 hover:bg-gray-100",
    },
    {
      href: "/dashboard/activity",
      icon: Activity,
      title: "Aktivitet",
      description: "Se aktivitetslogg og statistikk",
      color: "bg-indigo-50 border-indigo-200 hover:bg-indigo-100",
    },
    {
      href: "/dashboard/security",
      icon: Shield,
      title: "Sikkerhet",
      description: "Administrer sikkerhetsinnstillinger",
      color: "bg-red-50 border-red-200 hover:bg-red-100",
    },
    {
      href: "/dashboard/general",
      icon: Settings,
      title: "Generelle innstillinger",
      description: "Konfigurer generelle systeminnstillinger",
      color: "bg-yellow-50 border-yellow-200 hover:bg-yellow-100",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Velkommen til dashboard. Velg en modul for å komme i gang.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {dashboardItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <div
              className={`rounded-lg border p-6 transition-colors cursor-pointer ${item.color}`}
            >
              <div className="flex items-center space-x-3 mb-3">
                <item.icon className="h-6 w-6 text-gray-700" />
                <h3 className="text-lg font-semibold text-gray-900">
                  {item.title}
                </h3>
              </div>
              <p className="text-sm text-gray-600">{item.description}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 p-6 bg-gray-50 rounded-lg border">
        <h2 className="text-xl font-semibold mb-2">Kom i gang</h2>
        <p className="text-gray-600 mb-4">
          Her er noen forslag til hva du kan gjøre:
        </p>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>
            • Start med <strong>Kalkulatoren</strong> for å beregne
            prosjektkostnader
          </li>
          <li>
            • Opprett din første <strong>Faktura</strong> i faktura-modulen
          </li>
          <li>
            • Legg til teammedlemmer i <strong>Team</strong>-seksjonen
          </li>
          <li>
            • Oppdater <strong>Bedriftsinformasjon</strong> med dine detaljer
          </li>
        </ul>
      </div>
    </div>
  );
}
