"use client";
import { useState, useEffect } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Download,
  Plus,
  Save,
  Trash,
  Calculator,
  FileText,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface CostItem {
  name: string;
  amount: number;
}

export default function CalculatorPage() {
  // Bedriftsomfattende innstillinger
  const [numberOfEmployees, setNumberOfEmployees] = useState(5);
  const [averageHoursPerEmployee, setAverageHoursPerEmployee] = useState(1800);
  const [totalAnnualHours, setTotalAnnualHours] = useState(
    numberOfEmployees * averageHoursPerEmployee
  );

  // Årlige indirekte kostnader
  const [overheadCosts, setOverheadCosts] = useState<CostItem[]>([
    { name: "Kontorlokaler", amount: 120000 },
    { name: "Administrative lønninger", amount: 350000 },
    { name: "Strøm og kommunale avgifter", amount: 45000 },
    { name: "Forsikringer", amount: 85000 },
  ]);

  const [equipmentCosts, setEquipmentCosts] = useState<CostItem[]>([
    { name: "Utstyrsavskrivninger", amount: 180000 },
    { name: "Utstyrsvedlikehold", amount: 65000 },
    { name: "Småverktøy", amount: 30000 },
  ]);

  const [generalCosts, setGeneralCosts] = useState<CostItem[]>([
    { name: "Opplæring", amount: 40000 },
    { name: "HMS-programmer", amount: 55000 },
    { name: "IT-systemer", amount: 70000 },
    { name: "Profesjonelle tjenester", amount: 90000 },
  ]);

  // Prosjektspesifikk kalkulator
  const [projectHours, setProjectHours] = useState(140);
  const [projectName, setProjectName] = useState("");
  const [savedProjects, setSavedProjects] = useState<
    { name: string; hours: number; cost: number }[]
  >([
    { name: "Sentrum Kontorbygg", hours: 1200, cost: 0 },
    { name: "Riksvei Brureparasjon", hours: 850, cost: 0 },
    { name: "Boligkompleks", hours: 2400, cost: 0 },
  ]);

  // Beregn totaler
  const calculateTotal = (items: CostItem[]) => {
    return items.reduce((sum, item) => sum + item.amount, 0);
  };

  const overheadTotal = calculateTotal(overheadCosts);
  const equipmentTotal = calculateTotal(equipmentCosts);
  const generalTotal = calculateTotal(generalCosts);
  const totalAnnualIndirectCosts =
    overheadTotal + equipmentTotal + generalTotal;

  // Beregn totale årlige timer når input endres
  useEffect(() => {
    setTotalAnnualHours(numberOfEmployees * averageHoursPerEmployee);
  }, [numberOfEmployees, averageHoursPerEmployee]);

  // Beregn indirekte kostnadssats (per time)
  const indirectCostRate =
    totalAnnualHours > 0 ? totalAnnualIndirectCosts / totalAnnualHours : 0;

  // Beregn prosjektspesifikk indirekte kostnad
  const projectIndirectCost = projectHours * indirectCostRate;

  // Oppdater lagrede prosjekter med gjeldende sats
  useEffect(() => {
    const updatedProjects = savedProjects.map((project) => ({
      ...project,
      cost: project.hours * indirectCostRate,
    }));
    setSavedProjects(updatedProjects);
  }, [indirectCostRate]);

  // Håndter inputendringer for kostnadselementer
  const handleCostItemChange = (
    index: number,
    value: number,
    category: "overhead" | "equipment" | "general"
  ) => {
    switch (category) {
      case "overhead":
        const updatedOverhead = [...overheadCosts];
        updatedOverhead[index].amount = value;
        setOverheadCosts(updatedOverhead);
        break;
      case "equipment":
        const updatedEquipment = [...equipmentCosts];
        updatedEquipment[index].amount = value;
        setEquipmentCosts(updatedEquipment);
        break;
      case "general":
        const updatedGeneral = [...generalCosts];
        updatedGeneral[index].amount = value;
        setGeneralCosts(updatedGeneral);
        break;
    }
  };

  // Legg til nytt kostnadselement
  const addCostItem = (category: "overhead" | "equipment" | "general") => {
    const newItem = { name: "Nytt element", amount: 0 };
    switch (category) {
      case "overhead":
        setOverheadCosts([...overheadCosts, newItem]);
        break;
      case "equipment":
        setEquipmentCosts([...equipmentCosts, newItem]);
        break;
      case "general":
        setGeneralCosts([...generalCosts, newItem]);
        break;
    }
  };

  // Fjern kostnadselement
  const removeCostItem = (
    index: number,
    category: "overhead" | "equipment" | "general"
  ) => {
    switch (category) {
      case "overhead":
        const updatedOverhead = [...overheadCosts];
        updatedOverhead.splice(index, 1);
        setOverheadCosts(updatedOverhead);
        break;
      case "equipment":
        const updatedEquipment = [...equipmentCosts];
        updatedEquipment.splice(index, 1);
        setEquipmentCosts(updatedEquipment);
        break;
      case "general":
        const updatedGeneral = [...generalCosts];
        updatedGeneral.splice(index, 1);
        setGeneralCosts(updatedGeneral);
        break;
    }
  };

  // Håndter navneendring for kostnadselementer
  const handleNameChange = (
    index: number,
    name: string,
    category: "overhead" | "equipment" | "general"
  ) => {
    switch (category) {
      case "overhead":
        const updatedOverhead = [...overheadCosts];
        updatedOverhead[index].name = name;
        setOverheadCosts(updatedOverhead);
        break;
      case "equipment":
        const updatedEquipment = [...equipmentCosts];
        updatedEquipment[index].name = name;
        setEquipmentCosts(updatedEquipment);
        break;
      case "general":
        const updatedGeneral = [...generalCosts];
        updatedGeneral[index].name = name;
        setGeneralCosts(updatedGeneral);
        break;
    }
  };

  // Lagre gjeldende prosjekt
  const saveProject = () => {
    if (!projectName) return;

    const newProject = {
      name: projectName,
      hours: projectHours,
      cost: projectIndirectCost,
    };

    setSavedProjects([...savedProjects, newProject]);
    setProjectName("");
    setProjectHours(140);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Indirekte Kostnadskalkulator
        </h1>
        <p className="text-muted-foreground">
          Beregn indirekte kostnader for prosjektene dine
        </p>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">
                Totale årlige indirekte kostnader
              </div>
              <div className="text-2xl font-bold">
                {totalAnnualIndirectCosts.toLocaleString()} kr
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">
                Totale årlige produksjonstimer
              </div>
              <div className="text-2xl font-bold">
                {totalAnnualHours.toLocaleString()}
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">
                Indirekte kostnadssats
              </div>
              <div className="text-2xl font-bold">
                {indirectCostRate.toFixed(2)} kr
                <span className="text-sm font-normal text-muted-foreground">
                  /time
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="calculator" className="w-full">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="calculator" className="flex items-center">
            <Calculator className="mr-2 h-4 w-4" />
            Prosjektkalkulator
          </TabsTrigger>
          <TabsTrigger value="projects" className="flex items-center">
            <FileText className="mr-2 h-4 w-4" />
            Lagrede prosjekter
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center">
            <Settings className="mr-2 h-4 w-4" />
            Bedriftsinnstillinger
          </TabsTrigger>
        </TabsList>

        {/* PROSJEKTKALKULATOR-FANE */}
        <TabsContent value="calculator" className="space-y-6 mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Prosjektinformasjon</CardTitle>
                <CardDescription>
                  Skriv inn prosjektdetaljer for kostnadsestimering
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="project-name">Prosjektnavn</Label>
                  <Input
                    id="project-name"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="Skriv inn prosjektnavn"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="project-hours">Prosjekttimer</Label>
                  <Input
                    id="project-hours"
                    type="number"
                    min="1"
                    value={projectHours}
                    onChange={(e) => setProjectHours(Number(e.target.value))}
                  />
                  <p className="text-xs text-muted-foreground">
                    Totale fakturerbare timer for dette prosjektet
                  </p>
                </div>
              </CardContent>
              <CardFooter className="justify-end">
                <Button onClick={saveProject} disabled={!projectName}>
                  <Save className="mr-2 h-4 w-4" />
                  Lagre prosjekt
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Prosjektkostnadsestimat</CardTitle>
                <CardDescription>
                  Indirekte kostnadsberegning for dette prosjektet
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="rounded-md bg-primary/10 p-4">
                  <div className="font-medium">
                    Prosjektets indirekte kostnad
                  </div>
                  <div className="text-3xl font-bold">
                    {projectIndirectCost.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}{" "}
                    kr
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Basert på {projectHours} timer til{" "}
                    {indirectCostRate.toFixed(2)} kr/time
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="text-sm font-medium">Kostnadsfordeling</div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Overhead:</span>
                      <span>
                        {(
                          (overheadTotal / totalAnnualHours) *
                          projectHours
                        ).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}{" "}
                        kr
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Utstyr:</span>
                      <span>
                        {(
                          (equipmentTotal / totalAnnualHours) *
                          projectHours
                        ).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}{" "}
                        kr
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Generelt:</span>
                      <span>
                        {(
                          (generalTotal / totalAnnualHours) *
                          projectHours
                        ).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}{" "}
                        kr
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="text-sm font-medium">
                    Prosentvis fordeling
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Overhead:</span>
                      <span>
                        {(
                          (overheadTotal / totalAnnualIndirectCosts) *
                          100
                        ).toFixed(1)}
                        %
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Utstyr:</span>
                      <span>
                        {(
                          (equipmentTotal / totalAnnualIndirectCosts) *
                          100
                        ).toFixed(1)}
                        %
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Generelt:</span>
                      <span>
                        {(
                          (generalTotal / totalAnnualIndirectCosts) *
                          100
                        ).toFixed(1)}
                        %
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="justify-end">
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Eksporter rapport
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        {/* LAGREDE PROSJEKTER-FANE */}
        <TabsContent value="projects" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Lagrede prosjekter</CardTitle>
              <CardDescription>
                Se og administrer dine lagrede prosjektberegninger
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Prosjektnavn</TableHead>
                    <TableHead className="text-right">Timer</TableHead>
                    <TableHead className="text-right">
                      Indirekte kostnad
                    </TableHead>
                    <TableHead className="text-right">Sats</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {savedProjects.map((project, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {project.name}
                      </TableCell>
                      <TableCell className="text-right">
                        {project.hours.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        {project.cost.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}{" "}
                        kr
                      </TableCell>
                      <TableCell className="text-right">
                        {indirectCostRate.toFixed(2)} kr/t
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* BEDRIFTSINNSTILLINGER-FANE */}
        <TabsContent value="settings" className="space-y-6 mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Bedriftsparametere</CardTitle>
                <CardDescription>
                  Konfigurer bedriftsinnstillingene dine
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="employees">Antall ansatte</Label>
                    <Input
                      id="employees"
                      type="number"
                      min="1"
                      value={numberOfEmployees}
                      onChange={(e) =>
                        setNumberOfEmployees(Number(e.target.value))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="avg-hours">
                      Gj.snitt timer per ansatt/år
                    </Label>
                    <Input
                      id="avg-hours"
                      type="number"
                      min="1"
                      value={averageHoursPerEmployee}
                      onChange={(e) =>
                        setAverageHoursPerEmployee(Number(e.target.value))
                      }
                    />
                  </div>
                </div>

                <div className="rounded-md bg-muted p-4">
                  <div className="font-medium">
                    Totale årlige produksjonstimer
                  </div>
                  <div className="text-2xl font-bold">
                    {totalAnnualHours.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Basert på {numberOfEmployees} ansatte med{" "}
                    {averageHoursPerEmployee} timer hver
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Årlig indirekte kostnadssammendrag</CardTitle>
                <CardDescription>
                  Oversikt over alle indirekte kostnader
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Overheadkostnader:
                    </span>
                    <span>{overheadTotal.toLocaleString()} kr</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Utstyrskostnader:
                    </span>
                    <span>{equipmentTotal.toLocaleString()} kr</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Generelle kostnader:
                    </span>
                    <span>{generalTotal.toLocaleString()} kr</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-medium">
                    <span>Totale indirekte kostnader:</span>
                    <span>{totalAnnualIndirectCosts.toLocaleString()} kr</span>
                  </div>
                </div>

                <div className="pt-4">
                  <div className="rounded-md bg-muted p-4">
                    <div className="font-medium">Indirekte kostnadssats</div>
                    <div className="text-2xl font-bold">
                      {indirectCostRate.toFixed(2)} kr
                    </div>
                    <div className="text-xs text-muted-foreground">
                      per produksjonstime
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="overhead" className="w-full">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="overhead">Overheadkostnader</TabsTrigger>
              <TabsTrigger value="equipment">Utstyrskostnader</TabsTrigger>
              <TabsTrigger value="general">Generelle kostnader</TabsTrigger>
            </TabsList>

            <TabsContent value="overhead" className="space-y-4 mt-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Overheadkostnader</CardTitle>
                    <CardDescription>
                      Administrative og kontorrelaterte utgifter
                    </CardDescription>
                  </div>
                  <Button size="sm" onClick={() => addCostItem("overhead")}>
                    <Plus className="h-4 w-4 mr-2" />
                    Legg til element
                  </Button>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Element</TableHead>
                        <TableHead className="text-right">Beløp (kr)</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {overheadCosts.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Input
                              value={item.name}
                              onChange={(e) =>
                                handleNameChange(
                                  index,
                                  e.target.value,
                                  "overhead"
                                )
                              }
                              className="w-full"
                            />
                          </TableCell>
                          <TableCell className="text-right">
                            <Input
                              type="number"
                              min="0"
                              value={item.amount}
                              onChange={(e) =>
                                handleCostItemChange(
                                  index,
                                  Number(e.target.value),
                                  "overhead"
                                )
                              }
                              className="w-32 ml-auto"
                            />
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeCostItem(index, "overhead")}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
                <CardFooter className="justify-between">
                  <div className="font-medium">Total</div>
                  <div className="font-medium">
                    {overheadTotal.toLocaleString()} kr
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="equipment" className="space-y-4 mt-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Utstyrskostnader</CardTitle>
                    <CardDescription>Utstyrsrelaterte utgifter</CardDescription>
                  </div>
                  <Button size="sm" onClick={() => addCostItem("equipment")}>
                    <Plus className="h-4 w-4 mr-2" />
                    Legg til element
                  </Button>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Element</TableHead>
                        <TableHead className="text-right">Beløp (kr)</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {equipmentCosts.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Input
                              value={item.name}
                              onChange={(e) =>
                                handleNameChange(
                                  index,
                                  e.target.value,
                                  "equipment"
                                )
                              }
                              className="w-full"
                            />
                          </TableCell>
                          <TableCell className="text-right">
                            <Input
                              type="number"
                              min="0"
                              value={item.amount}
                              onChange={(e) =>
                                handleCostItemChange(
                                  index,
                                  Number(e.target.value),
                                  "equipment"
                                )
                              }
                              className="w-32 ml-auto"
                            />
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeCostItem(index, "equipment")}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
                <CardFooter className="justify-between">
                  <div className="font-medium">Total</div>
                  <div className="font-medium">
                    {equipmentTotal.toLocaleString()} kr
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="general" className="space-y-4 mt-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Generelle kostnader</CardTitle>
                    <CardDescription>Andre indirekte utgifter</CardDescription>
                  </div>
                  <Button size="sm" onClick={() => addCostItem("general")}>
                    <Plus className="h-4 w-4 mr-2" />
                    Legg til element
                  </Button>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Element</TableHead>
                        <TableHead className="text-right">Beløp (kr)</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {generalCosts.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Input
                              value={item.name}
                              onChange={(e) =>
                                handleNameChange(
                                  index,
                                  e.target.value,
                                  "general"
                                )
                              }
                              className="w-full"
                            />
                          </TableCell>
                          <TableCell className="text-right">
                            <Input
                              type="number"
                              min="0"
                              value={item.amount}
                              onChange={(e) =>
                                handleCostItemChange(
                                  index,
                                  Number(e.target.value),
                                  "general"
                                )
                              }
                              className="w-32 ml-auto"
                            />
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeCostItem(index, "general")}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
                <CardFooter className="justify-between">
                  <div className="font-medium">Total</div>
                  <div className="font-medium">
                    {generalTotal.toLocaleString()} kr
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>
    </div>
  );
}
