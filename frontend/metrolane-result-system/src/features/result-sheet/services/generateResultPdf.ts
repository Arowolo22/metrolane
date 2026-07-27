import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

import type { CourseRecord } from "@/features/calculator/types"
import type { StudentInformationFormValues } from "@/features/calculator/utils/validation"
import { PLACEHOLDER_VALUE } from "@/lib/utils"

import type { ResultSheetSummary } from "../types"
import {
  buildResultFilename,
  computeTotalScore,
  formatDisplayDate,
} from "../utils/resultHelpers"

const ORANGE: [number, number, number] = [249, 115, 22]
const DARK_GRAY: [number, number, number] = [55, 65, 81]
const MEDIUM_GRAY: [number, number, number] = [156, 163, 175]
const LIGHT_GRAY: [number, number, number] = [243, 244, 246]
const WHITE: [number, number, number] = [255, 255, 255]

interface GeneratePdfOptions {
  student: StudentInformationFormValues
  courses: CourseRecord[]
  summary: ResultSheetSummary
  generatedAt?: Date
}

function drawPlaceholderBox(
  doc: jsPDF,
  x: number,
  y: number,
  width: number,
  height: number,
  label: string,
) {
  doc.setDrawColor(...MEDIUM_GRAY)
  doc.setLineWidth(0.4)
  doc.setFillColor(...LIGHT_GRAY)
  doc.rect(x, y, width, height, "FD")
  doc.setFontSize(7)
  doc.setTextColor(...MEDIUM_GRAY)
  doc.text(label, x + width / 2, y + height / 2, { align: "center" })
}

function drawSectionTitle(doc: jsPDF, title: string, y: number): number {
  doc.setFont("helvetica", "bold")
  doc.setFontSize(11)
  doc.setTextColor(...DARK_GRAY)
  doc.text(title, 14, y)
  doc.setDrawColor(...ORANGE)
  doc.setLineWidth(0.6)
  doc.line(14, y + 2, 196, y + 2)
  return y + 8
}

export function generateResultPdf({
  student,
  courses,
  summary,
  generatedAt = new Date(),
}: GeneratePdfOptions): { blob: Blob; filename: string } {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" })
  const generatedDate = formatDisplayDate(generatedAt)

  drawPlaceholderBox(doc, 14, 12, 22, 22, "School Logo")

  doc.setFont("helvetica", "bold")
  doc.setFontSize(13)
  doc.setTextColor(...ORANGE)
  doc.text("METROLANE College of Health Sciences", 40, 18)
  doc.text("and Technology", 40, 24)

  doc.setFont("helvetica", "normal")
  doc.setFontSize(9)
  doc.setTextColor(...DARK_GRAY)
  doc.text("Official Semester Result", 40, 31)
  doc.text("Academic Records Unit", 40, 36)

  drawPlaceholderBox(doc, 164, 12, 32, 32, "Passport Photo")

  let cursorY = 52

  cursorY = drawSectionTitle(doc, "Student Information", cursorY)

  const studentRows = [
    ["Student Name", student.studentName],
    ["Matric Number", student.matricNumber],
    ["Faculty", student.faculty],
    ["Department", student.department],
    ["Programme", student.programme],
    ["Level", `Level ${student.level}`],
    ["Semester", student.semester],
    ["Academic Session", student.academicSession],
    ["Date Generated", generatedDate],
  ]

  autoTable(doc, {
    startY: cursorY,
    body: studentRows,
    theme: "plain",
    styles: {
      fontSize: 9,
      cellPadding: 2.5,
      textColor: DARK_GRAY,
    },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 42, textColor: MEDIUM_GRAY },
      1: { cellWidth: "auto" },
    },
    margin: { left: 14, right: 14 },
  })

  cursorY = doc.lastAutoTable.finalY + 8
  cursorY = drawSectionTitle(doc, "Academic Record", cursorY)

  autoTable(doc, {
    startY: cursorY,
    head: [[
      "Course Code",
      "Course Title",
      "Credit Unit",
      "CA",
      "Exam",
      "Total",
      "Grade",
      "GP",
      "QP",
    ]],
    body: courses.map((course) => [
      course.courseCode,
      course.courseTitle,
      course.creditUnit,
      course.continuousAssessment,
      course.examinationScore,
      computeTotalScore(
        course.continuousAssessment,
        course.examinationScore,
      ),
      PLACEHOLDER_VALUE,
      PLACEHOLDER_VALUE,
      PLACEHOLDER_VALUE,
    ]),
    theme: "grid",
    headStyles: {
      fillColor: ORANGE,
      textColor: WHITE,
      fontStyle: "bold",
      fontSize: 8,
    },
    bodyStyles: {
      fontSize: 8,
      textColor: DARK_GRAY,
    },
    alternateRowStyles: {
      fillColor: LIGHT_GRAY,
    },
    margin: { left: 14, right: 14 },
  })

  cursorY = doc.lastAutoTable.finalY + 8

  if (cursorY > 230) {
    doc.addPage()
    cursorY = 20
  }

  cursorY = drawSectionTitle(doc, "Semester Summary", cursorY)

  autoTable(doc, {
    startY: cursorY,
    body: [
      ["Total Registered Courses", String(summary.totalCourses)],
      ["Total Credit Units", String(summary.totalCreditUnits)],
      ["Total Grade Points", summary.totalGradePoints],
      ["Semester GPA", summary.semesterGpa],
    ],
    theme: "plain",
    styles: { fontSize: 9, cellPadding: 2.5, textColor: DARK_GRAY },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 60, textColor: MEDIUM_GRAY },
    },
    margin: { left: 14, right: 14 },
  })

  cursorY = doc.lastAutoTable.finalY + 8
  cursorY = drawSectionTitle(doc, "CGPA Summary", cursorY)

  const cardWidth = 56
  const cardHeight = 28
  const cardGap = 6
  const cardStartX = 14

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
  ]

  cards.forEach((card, index) => {
    const x = cardStartX + index * (cardWidth + cardGap)
    doc.setFillColor(...card.fill)
    doc.setDrawColor(...MEDIUM_GRAY)
    doc.roundedRect(x, cursorY, cardWidth, cardHeight, 2, 2, "FD")
    doc.setFont("helvetica", "normal")
    doc.setFontSize(7)
    doc.setTextColor(...(card.fill === ORANGE ? WHITE : MEDIUM_GRAY))
    doc.text(card.title, x + 4, cursorY + 7)
    doc.setFont("helvetica", "bold")
    doc.setFontSize(12)
    doc.setTextColor(...card.text)
    doc.text(card.value, x + 4, cursorY + 16)
    if (card.sub) {
      doc.setFont("helvetica", "normal")
      doc.setFontSize(6.5)
      doc.text(card.sub, x + 4, cursorY + 23, { maxWidth: cardWidth - 8 })
    }
  })

  cursorY += cardHeight + 10
  cursorY = drawSectionTitle(doc, "Academic Remarks", cursorY)

  doc.setFont("helvetica", "normal")
  doc.setFontSize(9)
  doc.setTextColor(...DARK_GRAY)
  doc.text(`Remarks: ${summary.academicRemarks}`, 14, cursorY)
  cursorY += 12

  cursorY = drawSectionTitle(doc, "Signatures", cursorY)

  const signatureLabels = [
    "Examination Officer",
    "Head of Department",
    "Registrar",
  ]
  const signatureWidth = 56
  signatureLabels.forEach((label, index) => {
    const x = 14 + index * (signatureWidth + 8)
    doc.setDrawColor(...MEDIUM_GRAY)
    doc.line(x, cursorY + 14, x + signatureWidth, cursorY + 14)
    doc.setFontSize(8)
    doc.setTextColor(...DARK_GRAY)
    doc.text(label, x + signatureWidth / 2, cursorY + 19, { align: "center" })
  })

  const pageCount = doc.getNumberOfPages()
  for (let page = 1; page <= pageCount; page += 1) {
    doc.setPage(page)
    doc.setFont("helvetica", "normal")
    doc.setFontSize(7)
    doc.setTextColor(...MEDIUM_GRAY)
    doc.text(
      "METROLANE College of Health Sciences and Technology",
      105,
      287,
      { align: "center" },
    )
    doc.text(
      "This result was electronically generated by the Lecturer Result Management System.",
      105,
      291,
      { align: "center" },
    )
    doc.text(`Generated Date: ${generatedDate}`, 14, 287)
    doc.text(`Page ${page} of ${pageCount}`, 196, 287, { align: "right" })
  }

  const filename = buildResultFilename(
    student.matricNumber,
    student.studentName,
    student.semester,
  )

  return {
    blob: doc.output("blob"),
    filename,
  }
}

export function downloadResultPdf(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
