import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import logoImage from "@/assets/metrolane-logo.png";
import type { CourseRecord } from "@/features/calculator/types";
import type { StudentInformationFormValues } from "@/features/calculator/utils/validation";
import { PLACEHOLDER_VALUE } from "@/lib/utils";

import type { ResultSheetSummary } from "../types";
import {
  buildResultFilename,
  computeTotalScore,
  formatDisplayDate,
  getCoursePerformance,
} from "../utils/resultHelpers";

const ORANGE: [number, number, number] = [249, 115, 22];
const DARK_GRAY: [number, number, number] = [55, 65, 81];
const MEDIUM_GRAY: [number, number, number] = [156, 163, 175];
const LIGHT_GRAY: [number, number, number] = [243, 244, 246];
const WHITE: [number, number, number] = [255, 255, 255];

interface GeneratePdfOptions {
  student: StudentInformationFormValues;
  courses: CourseRecord[];
  summary: ResultSheetSummary;
  generatedAt?: Date;
}

function drawPlaceholderBox(
  doc: jsPDF,
  x: number,
  y: number,
  width: number,
  height: number,
  label: string,
) {
  doc.setDrawColor(...MEDIUM_GRAY);
  doc.setLineWidth(0.4);
  doc.setFillColor(...LIGHT_GRAY);
  doc.rect(x, y, width, height, "FD");
  doc.setFontSize(7);
  doc.setTextColor(...MEDIUM_GRAY);
  doc.text(label, x + width / 2, y + height / 2, { align: "center" });
}

function drawSectionTitle(doc: jsPDF, title: string, y: number): number {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(...DARK_GRAY);
  doc.text(title, 10, y);
  doc.setDrawColor(...ORANGE);
  doc.setLineWidth(0.5);
  doc.line(10, y + 2, 200, y + 2);
  return y + 6;
}

function drawCompactMetricCard(
  doc: jsPDF,
  x: number,
  y: number,
  width: number,
  height: number,
  title: string,
  value: string,
  subtitle?: string,
  accent = false,
) {
  doc.setFillColor(...(accent ? ORANGE : WHITE));
  doc.setDrawColor(...MEDIUM_GRAY);
  doc.roundedRect(x, y, width, height, 1.8, 1.8, "FD");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.2);
  doc.setTextColor(...(accent ? WHITE : MEDIUM_GRAY));
  doc.text(title, x + 2.5, y + 4.2);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.8);
  doc.setTextColor(...(accent ? WHITE : DARK_GRAY));
  doc.text(value, x + 2.5, y + 10.5, { maxWidth: width - 5 });

  if (subtitle) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(5.6);
    doc.setTextColor(...(accent ? WHITE : MEDIUM_GRAY));
    doc.text(subtitle, x + 2.5, y + 13.8, { maxWidth: width - 5 });
  }
}

async function loadImageAsDataUrl(url: string): Promise<string | null> {
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    const blob = await response.blob();
    return await new Promise<string | null>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

export async function generateResultPdf({
  student,
  courses,
  summary,
  generatedAt = new Date(),
}: GeneratePdfOptions): Promise<{ blob: Blob; filename: string }> {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const generatedDate = formatDisplayDate(generatedAt);

  try {
    const logoDataUrl = await loadImageAsDataUrl(logoImage);
    if (logoDataUrl) {
      doc.addImage(logoDataUrl, "PNG", 10, 8, 18, 18);
    } else {
      drawPlaceholderBox(doc, 10, 8, 18, 18, "Logo");
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11.5);
    doc.setTextColor(...ORANGE);
    doc.text("METROLANE College of Health Sciences", 32, 13);
    doc.text("and Technology", 32, 18);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...DARK_GRAY);
    doc.text("Official Semester Result", 32, 24);
    doc.text("Academic Records Unit", 32, 28);

    const photoDataUrl = student.photoUrl
      ? await loadImageAsDataUrl(student.photoUrl)
      : null;
    if (photoDataUrl) {
      doc.addImage(photoDataUrl, 170, 8, 28, 28);
    } else {
      drawPlaceholderBox(doc, 170, 8, 28, 28, "Passport Photo");
    }

    let cursorY = 44;

    cursorY = drawSectionTitle(doc, "Student Information", cursorY);

    const studentRows = [
      ["Student Name", student.studentName],
      ["Matric Number", student.matricNumber],
      ["Department", student.department],
      ["Level", `Level ${student.level}`],
      ["Semester", student.semester],
      ["Academic Session", student.academicSession],
      ["Current GPA", student.currentGpa || PLACEHOLDER_VALUE],
      ["Total Credit Units", student.totalCreditUnits || PLACEHOLDER_VALUE],
      ["Date Generated", generatedDate],
    ];

    const pairedStudentRows = studentRows.reduce<
      Array<[string, string, string, string]>
    >((rows, current, index) => {
      if (index % 2 === 0) {
        rows.push([current[0], current[1], "", ""]);
      } else {
        const last = rows[rows.length - 1];
        last[2] = current[0];
        last[3] = current[1];
      }
      return rows;
    }, []);

    autoTable(doc, {
      startY: cursorY,
      body: pairedStudentRows,
      theme: "plain",
      styles: {
        fontSize: 7.4,
        cellPadding: 1.2,
        textColor: DARK_GRAY,
        overflow: "linebreak",
      },
      columnStyles: {
        0: { fontStyle: "bold", cellWidth: 39, textColor: MEDIUM_GRAY },
        1: { cellWidth: 67, overflow: "linebreak" },
        2: { fontStyle: "bold", cellWidth: 39, textColor: MEDIUM_GRAY },
        3: { cellWidth: 67, overflow: "linebreak" },
      },
      margin: { left: 10, right: 10 },
    });

    cursorY = doc.lastAutoTable.finalY + 5;
    cursorY = drawSectionTitle(doc, "Academic Record", cursorY);

    autoTable(doc, {
      startY: cursorY,
      head: [
        [
          "Course Code",
          "Course Title",
          "Credit Unit",
          "CA",
          "Exam",
          "Total",
          "Grade",
          "GP",
          "QP",
        ],
      ],
      body: courses.map((course) => {
        const performance = getCoursePerformance(course);

        return [
          course.courseCode,
          course.courseTitle,
          course.creditUnit,
          course.continuousAssessment,
          course.examinationScore,
          computeTotalScore(
            course.continuousAssessment,
            course.examinationScore,
          ),
          performance.grade || PLACEHOLDER_VALUE,
          performance.gradePoint.toFixed(2),
          performance.qualityPoints.toFixed(2),
        ];
      }),
      theme: "grid",
      headStyles: {
        fillColor: ORANGE,
        textColor: WHITE,
        fontStyle: "bold",
        fontSize: 7.2,
      },
      bodyStyles: {
        fontSize: 7.2,
        textColor: DARK_GRAY,
        cellPadding: 1.4,
      },
      alternateRowStyles: {
        fillColor: LIGHT_GRAY,
      },
      margin: { left: 10, right: 10 },
    });

    cursorY = doc.lastAutoTable.finalY + 5;

    if (cursorY > 230) {
      doc.addPage();
      cursorY = 20;
    }

    cursorY = drawSectionTitle(doc, "Semester Summary", cursorY);

    const summaryItems = [
      ["Total Registered Courses", String(summary.totalCourses)],
      ["Total Credit Units", String(summary.totalCreditUnits)],
      ["Total Grade Points", summary.totalGradePoints],
      ["Semester GPA", summary.semesterGpa],
    ];

    summaryItems.forEach((item, index) => {
      const column = index % 2;
      const row = Math.floor(index / 2);
      const x = 10 + column * 92;
      const y = cursorY + row * 16;
      drawCompactMetricCard(
        doc,
        x,
        y,
        88,
        13,
        item[0],
        item[1],
        undefined,
        false,
      );
    });

    cursorY += 34;
    cursorY = drawSectionTitle(doc, "CGPA Summary", cursorY);

    const cardWidth = 56;
    const cardHeight = 18;
    const cardGap = 6;
    const cardStartX = 10;

    const cards = [
      {
        title: "Semester GPA",
        value: summary.semesterGpa,
        fill: WHITE as [number, number, number],
        text: DARK_GRAY,
      },
      {
        title: "Cumulative GPA (CGPA)",
        value: summary.cumulativeGpa,
        fill: WHITE as [number, number, number],
        text: DARK_GRAY,
        sub: `Academic Standing: ${summary.academicStanding}`,
      },
      {
        title: "Degree Classification",
        value: summary.degreeClassification,
        fill: ORANGE,
        text: WHITE,
      },
    ];

    cards.forEach((card, index) => {
      const x = cardStartX + index * (cardWidth + cardGap);
      const y = cursorY;
      drawCompactMetricCard(
        doc,
        x,
        y,
        cardWidth,
        cardHeight,
        card.title,
        card.value,
        card.sub,
        card.fill === ORANGE,
      );
    });

    cursorY += cardHeight + 8;
    cursorY = drawSectionTitle(doc, "Academic Remarks", cursorY);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...DARK_GRAY);
    doc.text(`Remarks: ${summary.academicRemarks}`, 10, cursorY);
    cursorY += 10;

    cursorY = drawSectionTitle(doc, "Signatures", cursorY);

    const signatureLabels = [
      "Examination Officer",
      "Head of Department",
      "Registrar",
    ];
    const signatureWidth = 56;
    signatureLabels.forEach((label, index) => {
      const x = 10 + index * (signatureWidth + 8);
      doc.setDrawColor(...MEDIUM_GRAY);
      doc.line(x, cursorY + 12, x + signatureWidth, cursorY + 12);
      doc.setFontSize(7.2);
      doc.setTextColor(...DARK_GRAY);
      doc.text(label, x + signatureWidth / 2, cursorY + 16, {
        align: "center",
      });
    });

    const pageCount = doc.getNumberOfPages();
    for (let page = 1; page <= pageCount; page += 1) {
      doc.setPage(page);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.setTextColor(...MEDIUM_GRAY);
      doc.text(
        "METROLANE College of Health Sciences and Technology",
        105,
        287,
        { align: "center" },
      );
      doc.text(
        "This result was electronically generated by the Lecturer Result Management System.",
        105,
        291,
        { align: "center" },
      );
      doc.text(`Generated Date: ${generatedDate}`, 14, 287);
      doc.text(`Page ${page} of ${pageCount}`, 196, 287, { align: "right" });
    }
  } catch (error) {
    console.error("PDF generation failed", error);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(...DARK_GRAY);
    doc.text("Result PDF could not be rendered completely.", 14, 40);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(
      "The system generated a simplified fallback page instead.",
      14,
      50,
    );
    const fallbackMessage =
      error instanceof Error ? error.message : "Unknown error";
    doc.text(`Details: ${fallbackMessage}`, 14, 60);
  }

  const filename = buildResultFilename(
    student.matricNumber,
    student.studentName,
    student.semester,
  );

  return {
    blob: doc.output("blob"),
    filename,
  };
}

export function downloadResultPdf(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
