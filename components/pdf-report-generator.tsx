import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  companyEmail: string;
  companyOrgNumber: string;
}

export const generateProjectReport = (data: ProjectReportData) => {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  let yPosition = 30;
  let currentPage = 1;

  // Myke farger (Tripletex-stil)
  const softBlue = { r: 240, g: 248, b: 255 };
  const softGreen = { r: 245, g: 255, b: 245 };
  const softGray = { r: 248, g: 249, b: 250 };
  const softOrange = { r: 255, g: 250, b: 240 };
  const borderGray = { r: 220, g: 220, b: 220 };
  const textDark = { r: 33, g: 37, b: 41 };

  // Function to add footer to a page
  const addFooter = (pageNumber: number) => {
    const footerY = pageHeight - 40;
    pdf.setTextColor(108, 117, 125);
    pdf.setFontSize(8);

    // Add company information footer
    pdf.setFont("helvetica", "bold");
    pdf.text(data.companyName || "Bedrift", margin, footerY);

    pdf.setFont("helvetica", "normal");
    const addressLines = (data.companyAddress || "").split("\n");
    addressLines.forEach((line, index) => {
      pdf.text(line, margin, footerY + 6 + index * 4);
    });

    const contactInfo = [
      data.companyPhone ? `Tlf: ${data.companyPhone}` : null,
      data.companyEmail ? `E-post: ${data.companyEmail}` : null,
      data.companyOrgNumber ? `Org.nr: ${data.companyOrgNumber}` : null,
    ]
      .filter(Boolean)
      .join(" | ");

    if (contactInfo) {
      pdf.text(contactInfo, margin, footerY + 6 + addressLines.length * 4);
    }

    // Add page number and report generator text
    pdf.text(
      `Side ${pageNumber} | Rapport generert av Indirekte Kostnadskalkulator`,
      margin,
      pageHeight - 15
    );
  };

  // Function to check if we need a new page
  const checkNewPage = (requiredSpace: number) => {
    if (yPosition + requiredSpace > pageHeight - 60) {
      // Leave space for footer
      addFooter(currentPage);
      pdf.addPage();
      currentPage++;
      yPosition = 30;
      return true;
    }
    return false;
  };

  // Add footer to first page
  addFooter(currentPage);

  // Header - enkel og ren
  pdf.setTextColor(textDark.r, textDark.g, textDark.b);
  pdf.setFontSize(22);
  pdf.setFont("helvetica", "bold");
  pdf.text("Prosjektkostnadsrapport", margin, yPosition);

  yPosition += 8;
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(108, 117, 125); // Grå tekst
  pdf.text(
    `Generert ${new Date().toLocaleDateString("no-NO")}`,
    margin,
    yPosition
  );

  yPosition += 25;
  pdf.setTextColor(textDark.r, textDark.g, textDark.b);

  // Prosjektinformasjon - myk boks
  checkNewPage(30);
  pdf.setFillColor(softBlue.r, softBlue.g, softBlue.b);
  pdf.setDrawColor(borderGray.r, borderGray.g, borderGray.b);
  pdf.rect(margin, yPosition - 8, pageWidth - 2 * margin, 30, "FD");

  pdf.setFontSize(14);
  pdf.setFont("helvetica", "bold");
  pdf.text("Prosjektinformasjon", margin + 8, yPosition + 2);

  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  pdf.text(
    `Navn: ${data.projectName || "Ikke spesifisert"}`,
    margin + 8,
    yPosition + 12
  );
  pdf.text(
    `Timer: ${data.projectHours.toLocaleString()}`,
    margin + 8,
    yPosition + 20
  );
  pdf.text(
    `Sats: ${data.indirectCostRate.toFixed(2)} kr/time`,
    pageWidth - 100,
    yPosition + 12
  );

  yPosition += 40;

  // Hovedresultat - myk grønn boks
  checkNewPage(35);
  pdf.setFillColor(softGreen.r, softGreen.g, softGreen.b);
  pdf.setDrawColor(borderGray.r, borderGray.g, borderGray.b);
  pdf.rect(margin, yPosition, pageWidth - 2 * margin, 35, "FD");

  pdf.setFontSize(12);
  pdf.setFont("helvetica", "bold");
  pdf.text("Total indirekte kostnad", margin + 8, yPosition + 12);

  pdf.setFontSize(20);
  pdf.setTextColor(40, 167, 69); // Grønn farge for beløp
  pdf.text(
    `${data.projectIndirectCost.toLocaleString("no-NO", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} kr`,
    margin + 8,
    yPosition + 28
  );

  yPosition += 50;
  pdf.setTextColor(textDark.r, textDark.g, textDark.b);

  // Kostnadsfordeling som tabell
  const overheadProjectCost =
    (data.overheadTotal / data.totalAnnualHours) * data.projectHours;
  const equipmentProjectCost =
    (data.equipmentTotal / data.totalAnnualHours) * data.projectHours;
  const generalProjectCost =
    (data.generalTotal / data.totalAnnualHours) * data.projectHours;

  checkNewPage(30);
  pdf.setFontSize(14);
  pdf.setFont("helvetica", "bold");
  pdf.text("Kostnadsfordeling", margin, yPosition);
  yPosition += 8;

  autoTable(pdf, {
    startY: yPosition,
    head: [["Kategori", "Beløp (kr)", "Andel (%)"]],
    body: [
      [
        "Overhead",
        overheadProjectCost.toLocaleString("no-NO", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
        `${((data.overheadTotal / data.totalAnnualIndirectCosts) * 100).toFixed(
          1
        )}%`,
      ],
      [
        "Utstyr",
        equipmentProjectCost.toLocaleString("no-NO", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
        `${(
          (data.equipmentTotal / data.totalAnnualIndirectCosts) *
          100
        ).toFixed(1)}%`,
      ],
      [
        "Generelt",
        generalProjectCost.toLocaleString("no-NO", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
        `${((data.generalTotal / data.totalAnnualIndirectCosts) * 100).toFixed(
          1
        )}%`,
      ],
    ],
    theme: "plain",
    styles: {
      fontSize: 10,
      cellPadding: 6,
      lineColor: [borderGray.r, borderGray.g, borderGray.b],
      lineWidth: 0.5,
    },
    headStyles: {
      fillColor: [softGray.r, softGray.g, softGray.b],
      textColor: [textDark.r, textDark.g, textDark.b],
      fontStyle: "bold",
    },
    alternateRowStyles: {
      fillColor: [253, 253, 253],
    },
    margin: { left: margin, right: margin },
    didDrawPage: function (data) {
      // Add footer to each page after it's drawn
      addFooter(currentPage);
    },
  });

  yPosition = (pdf as any).lastAutoTable.finalY + 20;

  // Bedriftsparametere
  checkNewPage(30);
  pdf.setFontSize(14);
  pdf.setFont("helvetica", "bold");
  pdf.text("Bedriftsparametere", margin, yPosition);
  yPosition += 8;

  autoTable(pdf, {
    startY: yPosition,
    head: [["Parameter", "Verdi"]],
    body: [
      ["Antall ansatte", data.numberOfEmployees.toString()],
      ["Timer per ansatt/år", data.averageHoursPerEmployee.toLocaleString()],
      ["Totale årlige timer", data.totalAnnualHours.toLocaleString()],
      [
        "Totale indirekte kostnader",
        `${data.totalAnnualIndirectCosts.toLocaleString()} kr`,
      ],
    ],
    theme: "plain",
    styles: {
      fontSize: 10,
      cellPadding: 6,
      lineColor: [borderGray.r, borderGray.g, borderGray.b],
      lineWidth: 0.5,
    },
    headStyles: {
      fillColor: [softBlue.r, softBlue.g, softBlue.b],
      textColor: [textDark.r, textDark.g, textDark.b],
      fontStyle: "bold",
    },
    margin: { left: margin, right: margin },
    didDrawPage: function (data) {
      // Add footer to each page after it's drawn
      addFooter(currentPage);
    },
  });

  yPosition = (pdf as any).lastAutoTable.finalY + 25;

  // Detaljerte kostnader
  checkNewPage(30);
  pdf.setFontSize(14);
  pdf.setFont("helvetica", "bold");
  pdf.text("Detaljert kostnadssammendrag", margin, yPosition);
  yPosition += 15;

  // Overhead tabell
  checkNewPage(30);
  pdf.setFontSize(12);
  pdf.setFont("helvetica", "bold");
  pdf.text("Overheadkostnader", margin, yPosition);
  yPosition += 5;

  autoTable(pdf, {
    startY: yPosition,
    head: [["Beskrivelse", "Beløp (kr)"]],
    body: data.overheadCosts.map((item) => [
      item.name,
      item.amount.toLocaleString("no-NO"),
    ]),
    foot: [["Total overhead", data.overheadTotal.toLocaleString("no-NO")]],
    theme: "plain",
    styles: {
      fontSize: 9,
      cellPadding: 4,
      lineColor: [borderGray.r, borderGray.g, borderGray.b],
      lineWidth: 0.3,
    },
    headStyles: {
      fillColor: [255, 240, 240], // Lys rød
      textColor: [textDark.r, textDark.g, textDark.b],
      fontStyle: "bold",
      fontSize: 9,
    },
    footStyles: {
      fillColor: [softGray.r, softGray.g, softGray.b],
      fontStyle: "bold",
      fontSize: 9,
    },
    margin: { left: margin, right: margin },
    didDrawPage: function (data) {
      // Add footer to each page after it's drawn
      addFooter(currentPage);
    },
  });

  yPosition = (pdf as any).lastAutoTable.finalY + 15;

  // Utstyr tabell
  checkNewPage(30);
  pdf.setFontSize(12);
  pdf.setFont("helvetica", "bold");
  pdf.text("Utstyrskostnader", margin, yPosition);
  yPosition += 5;

  autoTable(pdf, {
    startY: yPosition,
    head: [["Beskrivelse", "Beløp (kr)"]],
    body: data.equipmentCosts.map((item) => [
      item.name,
      item.amount.toLocaleString("no-NO"),
    ]),
    foot: [["Total utstyr", data.equipmentTotal.toLocaleString("no-NO")]],
    theme: "plain",
    styles: {
      fontSize: 9,
      cellPadding: 4,
      lineColor: [borderGray.r, borderGray.g, borderGray.b],
      lineWidth: 0.3,
    },
    headStyles: {
      fillColor: [240, 240, 255], // Lys blå
      textColor: [textDark.r, textDark.g, textDark.b],
      fontStyle: "bold",
      fontSize: 9,
    },
    footStyles: {
      fillColor: [softGray.r, softGray.g, softGray.b],
      fontStyle: "bold",
      fontSize: 9,
    },
    margin: { left: margin, right: margin },
    didDrawPage: function (data) {
      // Add footer to each page after it's drawn
      addFooter(currentPage);
    },
  });

  yPosition = (pdf as any).lastAutoTable.finalY + 15;

  // Generelle kostnader tabell
  checkNewPage(30);
  pdf.setFontSize(12);
  pdf.setFont("helvetica", "bold");
  pdf.text("Generelle kostnader", margin, yPosition);
  yPosition += 5;

  autoTable(pdf, {
    startY: yPosition,
    head: [["Beskrivelse", "Beløp (kr)"]],
    body: data.generalCosts.map((item) => [
      item.name,
      item.amount.toLocaleString("no-NO"),
    ]),
    foot: [["Total generelt", data.generalTotal.toLocaleString("no-NO")]],
    theme: "plain",
    styles: {
      fontSize: 9,
      cellPadding: 4,
      lineColor: [borderGray.r, borderGray.g, borderGray.b],
      lineWidth: 0.3,
    },
    headStyles: {
      fillColor: [softOrange.r, softOrange.g, softOrange.b],
      textColor: [textDark.r, textDark.g, textDark.b],
      fontStyle: "bold",
      fontSize: 9,
    },
    footStyles: {
      fillColor: [softGray.r, softGray.g, softGray.b],
      fontStyle: "bold",
      fontSize: 9,
    },
    margin: { left: margin, right: margin },
    didDrawPage: function (data) {
      // Add footer to each page after it's drawn
      addFooter(currentPage);
    },
  });

  // Last ned PDF-en
  const fileName = data.projectName
    ? `${data.projectName
        .replace(/[^a-z0-9]/gi, "_")
        .toLowerCase()}_kostnadsrapport.pdf`
    : `prosjekt_kostnadsrapport_${new Date().toISOString().split("T")[0]}.pdf`;

  pdf.save(fileName);
};
