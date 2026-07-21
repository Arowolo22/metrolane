export interface CourseTemplate {
  code: string
  title: string
  creditUnit: string
}

export const COURSE_LIBRARY: CourseTemplate[] = [
  { code: "GNS101", title: "Use of English I", creditUnit: "2" },
  { code: "GNS102", title: "Use of English II", creditUnit: "2" },
  { code: "GNS201", title: "Use of English III", creditUnit: "2" },
  { code: "BIO101", title: "General Biology I", creditUnit: "3" },
  { code: "BIO102", title: "General Biology II", creditUnit: "3" },
  { code: "CHS101", title: "Introduction to Community Health", creditUnit: "3" },
  { code: "CHS102", title: "Primary Health Care", creditUnit: "3" },
  { code: "MLT101", title: "Introduction to Medical Lab Science", creditUnit: "2" },
  { code: "HIM101", title: "Health Records Management", creditUnit: "3" },
  { code: "PHM101", title: "General Pharmacology", creditUnit: "2" },
  { code: "ENV101", title: "Environmental Health Science", creditUnit: "3" },
  { code: "PUH101", title: "Introduction to Public Health", creditUnit: "2" },
  { code: "MTH101", title: "General Mathematics I", creditUnit: "3" },
  { code: "CHM101", title: "General Chemistry I", creditUnit: "3" },
  { code: "PHY101", title: "General Physics I", creditUnit: "3" },
]
