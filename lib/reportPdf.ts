import type { ReportPayload } from "@/lib/types";

export async function downloadReportPdf(element: HTMLElement, report: ReportPayload) {
  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([import("html2canvas"), import("jspdf")]);

  const canvas = await html2canvas(element, {
    scale: 2,
    backgroundColor: "#ffffff",
    useCORS: true,
    logging: false,
  });

  const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 36;
  const contentWidth = pageWidth - margin * 2;

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(16);
  pdf.setTextColor(18, 18, 18);
  pdf.text("Solomon Stays", margin, 48);

  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(118, 118, 118);
  pdf.text(`${report.hotelName} | ${report.title}`, margin, 64);
  pdf.text(`${report.startDate} to ${report.endDate}`, margin, 78);
  pdf.text(`Generated ${new Date(report.generatedAt).toLocaleString("en-KE")}`, margin, 92);

  pdf.setDrawColor(255, 9, 9);
  pdf.setLineWidth(2);
  pdf.line(margin, 102, pageWidth - margin, 102);

  const imageHeight = (canvas.height * contentWidth) / canvas.width;
  const imageData = canvas.toDataURL("image/png");
  const availableHeight = pdf.internal.pageSize.getHeight() - 150;

  if (imageHeight <= availableHeight) {
    pdf.addImage(imageData, "PNG", margin, 118, contentWidth, imageHeight);
  } else {
    const scale = availableHeight / imageHeight;
    pdf.addImage(imageData, "PNG", margin, 118, contentWidth, imageHeight * scale);
  }

  pdf.setFontSize(8);
  pdf.setTextColor(118, 118, 118);
  pdf.text(
    "Solomon Stays, hotel occupancy and revenue analytics. WhatsApp +254 112 272 061.",
    margin,
    pdf.internal.pageSize.getHeight() - 24,
  );

  pdf.save(`solomon-stays-${report.type}-${report.endDate}.pdf`);
}

export function downloadCsv(content: string, filename: string) {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
