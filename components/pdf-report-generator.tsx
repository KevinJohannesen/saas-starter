import jsPDF from "jspdf";

interface CostItem {
  name: string;
  amount: number;
}

interface ProjectReportData {
  projectName: string;
  projectHours: number;
  projectIndirectCost: number;
  indirectCostRate: number;
  numberOfEmployees: number;
  averageHoursPerEmployee: number;
  totalAnnualHours: number;
  totalAnnualIndirectCosts: number;
  overheadCosts: CostItem[];
  equipmentCosts: CostItem[];
  generalCosts: CostItem[];
  overheadTotal: number;
  equipmentTotal: number;
  generalTotal: number;
}

export const generateProjectReport = (data: ProjectReportData) => {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 20;
  let yPosition = 30;

  // Header
  pdf.setFontSize(20);
  pdf.setFont("helvetica", "bold");
  pdf.text("Prosjektkostnadsrapport", margin, yPosition);

  yPosition += 15;
  pdf.setFontSize(12);
  pdf.setFont("helvetica", "normal");
  pdf.text(
    `Generert: ${new Date().toLocaleDateString("no-NO")}`,
    margin,
    yPosition
  );

  yPosition += 20;

  // Prosjektinformasjon
  pdf.setFontSize(16);
  pdf.setFont("helvetica", "bold");
  pdf.text("Prosjektinformasjon", margin, yPosition);

  yPosition += 10;
  pdf.setFontSize(12);
  pdf.setFont("helvetica", "normal");
  pdf.text(
    `Prosjektnavn: ${data.projectName || "Ikke spesifisert"}`,
    margin,
    yPosition
  );

  yPosition += 8;
  pdf.text(
    `Estimerte timer: ${data.projectHours.toLocaleString()} timer`,
    margin,
    yPosition
  );

  yPosition += 8;
  pdf.text(
    `Indirekte kostnadssats: ${data.indirectCostRate.toFixed(2)} kr/time`,
    margin,
    yPosition
  );

  yPosition += 20;

  // Hovedresultat
  pdf.setFontSize(16);
  pdf.setFont("helvetica", "bold");
  pdf.text("Prosjektets indirekte kostnad", margin, yPosition);

  yPosition += 15;
  pdf.setFontSize(24);
  pdf.setTextColor(0, 100, 0); // Grønn farge
  pdf.text(
    `${data.projectIndirectCost.toLocaleString("no-NO", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} kr`,
    margin,
    yPosition
  );

  yPosition += 10;
  pdf.setFontSize(10);
  pdf.setTextColor(128, 128, 128); // Grå farge
  pdf.text(
    `Basert på ${data.projectHours} timer til ${data.indirectCostRate.toFixed(
      2
    )} kr/time`,
    margin,
    yPosition
  );

  pdf.setTextColor(0, 0, 0); // Tilbake til svart
  yPosition += 25;

  // Kostnadsfordeling
  pdf.setFontSize(14);
  pdf.setFont("helvetica", "bold");
  pdf.text("Kostnadsfordeling", margin, yPosition);

  yPosition += 15;
  pdf.setFontSize(11);
  pdf.setFont("helvetica", "normal");

  const overheadProjectCost =
    (data.overheadTotal / data.totalAnnualHours) * data.projectHours;
  const equipmentProjectCost =
    (data.equipmentTotal / data.totalAnnualHours) * data.projectHours;
  const generalProjectCost =
    (data.generalTotal / data.totalAnnualHours) * data.projectHours;

  pdf.text(
    `Overhead: ${overheadProjectCost.toLocaleString("no-NO", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} kr`,
    margin,
    yPosition
  );

  yPosition += 8;
  pdf.text(
    `Utstyr: ${equipmentProjectCost.toLocaleString("no-NO", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} kr`,
    margin,
    yPosition
  );

  yPosition += 8;
  pdf.text(
    `Generelt: ${generalProjectCost.toLocaleString("no-NO", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} kr`,
    margin,
    yPosition
  );

  yPosition += 20;

  // Prosentvis fordeling
  pdf.setFontSize(14);
  pdf.setFont("helvetica", "bold");
  pdf.text("Prosentvis fordeling", margin, yPosition);

  yPosition += 15;
  pdf.setFontSize(11);
  pdf.setFont("helvetica", "normal");

  pdf.text(
    `Overhead: ${(
      (data.overheadTotal / data.totalAnnualIndirectCosts) *
      100
    ).toFixed(1)}%`,
    margin,
    yPosition
  );

  yPosition += 8;
  pdf.text(
    `Utstyr: ${(
      (data.equipmentTotal / data.totalAnnualIndirectCosts) *
      100
    ).toFixed(1)}%`,
    margin,
    yPosition
  );

  yPosition += 8;
  pdf.text(
    `Generelt: ${(
      (data.generalTotal / data.totalAnnualIndirectCosts) *
      100
    ).toFixed(1)}%`,
    margin,
    yPosition
  );

  yPosition += 25;

  // Bedriftsparametere
  pdf.setFontSize(14);
  pdf.setFont("helvetica", "bold");
  pdf.text("Bedriftsparametere", margin, yPosition);

  yPosition += 15;
  pdf.setFontSize(11);
  pdf.setFont("helvetica", "normal");

  pdf.text(`Antall ansatte: ${data.numberOfEmployees}`, margin, yPosition);

  yPosition += 8;
  pdf.text(
    `Gjennomsnittlige timer per ansatt/år: ${data.averageHoursPerEmployee.toLocaleString()}`,
    margin,
    yPosition
  );

  yPosition += 8;
  pdf.text(
    `Totale årlige produksjonstimer: ${data.totalAnnualHours.toLocaleString()}`,
    margin,
    yPosition
  );

  yPosition += 8;
  pdf.text(
    `Totale årlige indirekte kostnader: ${data.totalAnnualIndirectCosts.toLocaleString()} kr`,
    margin,
    yPosition
  );

  // Ny side hvis nødvendig
  if (yPosition > 250) {
    pdf.addPage();
    yPosition = 30;
  } else {
    yPosition += 25;
  }

  // Detaljert kostnadssammendrag
  pdf.setFontSize(14);
  pdf.setFont("helvetica", "bold");
  pdf.text("Detaljert kostnadssammendrag", margin, yPosition);

  yPosition += 15;
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "bold");
  pdf.text("Overheadkostnader:", margin, yPosition);

  yPosition += 8;
  pdf.setFont("helvetica", "normal");
  data.overheadCosts.forEach((item) => {
    pdf.text(
      `• ${item.name}: ${item.amount.toLocaleString()} kr`,
      margin + 5,
      yPosition
    );
    yPosition += 6;
  });

  yPosition += 5;
  pdf.setFont("helvetica", "bold");
  pdf.text("Utstyrskostnader:", margin, yPosition);

  yPosition += 8;
  pdf.setFont("helvetica", "normal");
  data.equipmentCosts.forEach((item) => {
    pdf.text(
      `• ${item.name}: ${item.amount.toLocaleString()} kr`,
      margin + 5,
      yPosition
    );
    yPosition += 6;
  });

  yPosition += 5;
  pdf.setFont("helvetica", "bold");
  pdf.text("Generelle kostnader:", margin, yPosition);

  yPosition += 8;
  pdf.setFont("helvetica", "normal");
  data.generalCosts.forEach((item) => {
    pdf.text(
      `• ${item.name}: ${item.amount.toLocaleString()} kr`,
      margin + 5,
      yPosition
    );
    yPosition += 6;
  });

  // Footer
  const pageHeight = pdf.internal.pageSize.getHeight();
  pdf.setFontSize(8);
  pdf.setTextColor(128, 128, 128);
  pdf.text(
    `Rapport generert av Indirekte Kostnadskalkulator - ${new Date().toLocaleDateString(
      "no-NO"
    )}`,
    margin,
    pageHeight - 15
  );

  // Last ned PDF-en
  const fileName = data.projectName
    ? `${data.projectName
        .replace(/[^a-z0-9]/gi, "_")
        .toLowerCase()}_kostnadsrapport.pdf`
    : `prosjekt_kostnadsrapport_${new Date().toISOString().split("T")[0]}.pdf`;

  pdf.save(fileName);
};
