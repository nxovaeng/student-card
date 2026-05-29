import type {
  CardStyle,
  CardOrientation,
  CodeType,
  IDCardFormData,
  CertificateFormData,
  ScheduleFormData,
  ScheduleCourse,
  AdmissionLetterFormData,
  TranscriptFormData,
  TranscriptCourse,
  TuitionReceiptFormData,
  TuitionFeeItem,
  TuitionPaymentItem,
} from "./types"

// Default card orientation
export const DEFAULT_CARD_ORIENTATION: CardOrientation = "landscape"

// Default card style
export const DEFAULT_CARD_STYLE: CardStyle = "modern"

// Default code type
export const DEFAULT_CODE_TYPE: CodeType = "barcode"

// Export quality options — DPI-based
// Physical size is fixed (A4 = 210×297mm, landscape A4 = 297×210mm, credit card = 85.6×54mm)
// DPI controls resolution/clarity only
export const EXPORT_QUALITY_OPTIONS = [
  { label: "Standard (150 DPI)", value: "low", dpi: 150 },
  { label: "High Quality (200 DPI)", value: "medium", dpi: 200 },
  { label: "Print Quality (300 DPI) — Recommended", value: "high", dpi: 300 },
  { label: "Ultra Quality (600 DPI)", value: "ultra", dpi: 600 },
]

// Physical document dimensions in mm
export const DOCUMENT_DIMENSIONS = {
  A4_PORTRAIT: { widthMm: 210, heightMm: 297 },
  A4_LANDSCAPE: { widthMm: 297, heightMm: 210 },
  CREDIT_CARD: { widthMm: 85.6, heightMm: 54 },
  RECEIPT: { widthMm: 148, heightMm: 210 }, // A5 portrait
}

// Convert mm to pixels at a given DPI
export const mmToPx = (mm: number, dpi: number): number => Math.round((mm / 25.4) * dpi)

// Get DPI value from quality string
export const getDpiFromQuality = (quality: string): number => {
  const opt = EXPORT_QUALITY_OPTIONS.find((o) => o.value === quality)
  return opt?.dpi ?? 300
}

// Card orientation options
export const CARD_ORIENTATION_OPTIONS = [
  { label: "Portrait", value: "portrait" },
  { label: "Landscape (Credit Card Size)", value: "landscape" },
]

// Card style options
export const CARD_STYLE_OPTIONS = [{ label: "Modern", value: "modern" }]

// Code type options
export const CODE_TYPE_OPTIONS = [
  { label: "Barcode", value: "barcode" },
  { label: "QR Code", value: "qrcode" },
]

// Program type options
export const PROGRAM_TYPE_OPTIONS = [
  { label: "Bachelor", value: "Bachelor" },
  { label: "Master", value: "Master" },
  { label: "PhD", value: "PhD" },
]

// Degree type options
export const DEGREE_TYPE_OPTIONS = [
  { label: "Bachelor's Degree", value: "Bachelor" },
  { label: "Master's Degree", value: "Master" },
  { label: "PhD", value: "PhD" },
]

// Study mode options
export const STUDY_MODE_OPTIONS = [
  { label: "Full-time", value: "Full-time" },
  { label: "Part-time", value: "Part-time" },
]

// Font options
export const FONT_FAMILY_OPTIONS = [
  { label: "Times New Roman", value: "Times New Roman, serif" },
  { label: "Arial", value: "Arial, sans-serif" },
  { label: "Georgia", value: "Georgia, serif" },
  { label: "Calibri", value: "Calibri, sans-serif" },
  { label: "Garamond", value: "Garamond, serif" },
  { label: "Palatino", value: "Palatino Linotype, Book Antiqua, Palatino, serif" },
  { label: "Century Gothic", value: "Century Gothic, sans-serif" },
  { label: "Tahoma", value: "Tahoma, sans-serif" },
]

// Border style options
export const BORDER_STYLE_OPTIONS = [
  { label: "Solid", value: "solid" },
  { label: "Dashed", value: "dashed" },
  { label: "Dotted", value: "dotted" },
  { label: "Double", value: "double" },
]

// Pattern type options
export const PATTERN_TYPE_OPTIONS = [
  { label: "Corner Pattern", value: "corner" },
  { label: "Border Pattern", value: "border" },
  { label: "Background Pattern", value: "background" },
  { label: "Badge Style", value: "badge" },
]

// Pattern position options
export const PATTERN_POSITION_OPTIONS = [
  { label: "All Positions", value: "all" },
  { label: "Top Only", value: "top" },
  { label: "Bottom Only", value: "bottom" },
  { label: "Left Only", value: "left" },
  { label: "Right Only", value: "right" },
  { label: "Corners Only", value: "corners" },
]

// Standard duration for various programs
export const PROGRAM_DURATION = {
  Bachelor: 4,
  Master: 2,
  PhD: 4,
  default: 4,
}

// Default form data
export const DEFAULT_FORM_DATA: IDCardFormData = {
  // Personal information
  fullName: "Emily Johnson",
  studentId: "20230110042",
  faculty: "School of Computer Science & Engineering",
  universityName: "Westbrook University",
  birthDate: "2001-03-15",
  validityEnd: new Date(new Date().setFullYear(new Date().getFullYear() + 4)).toISOString().split("T")[0],
  enrollmentYear: new Date().getFullYear().toString(),
  programType: "Bachelor",
  photo: "/placeholder.svg?height=150&width=120",
  logo: "/placeholder.svg?height=60&width=60",
  cardColor: "#1e3a8a",
  textColor: "#ffffff",
  backgroundImage: "/placeholder.svg?height=90&width=140",
  backgroundOpacity: "30",

  // Card options
  orientation: DEFAULT_CARD_ORIENTATION,
  cardStyle: DEFAULT_CARD_STYLE,
  codeType: DEFAULT_CODE_TYPE,
  cardNumber: "C" + Math.floor(10000000 + Math.random() * 90000000).toString(),
  officialSignature: "M. Harrison",
  realisticEffect: false,
  pngQuality: "high",

  // Watermark settings
  enableWatermark: true,
  watermarkText: "AUTHENTIC",
  watermarkColor: "#000000",
  watermarkOpacity: 3,
  watermarkSize: "14",
  watermarkAngle: "-30",
  watermarkLineWidth: "20",

  // University information
  universityAddress: "1 University Drive, Cambridge, MA 02138",
  universityCity: "Cambridge, MA",
  universityContact: "(617) 495-1000",
  universityWebsite: "www.westbrook.edu",

  // Back settings
  backEnabled: true,
  termsOfUse:
    "This card is the property of Westbrook University. It must be carried at all times on campus. Loss or theft must be reported immediately to Campus Security.",
  termsText: "Terms and Conditions",
  backTitle: "Student Identification Card",
  useCustomBack: false,
  backContent: "",
  emergencyContact: "(617) 495-9999",
  accessList: "Library, Dining Halls, Dormitories, Computer Labs, Recreation Center",
  lostCardInfo: "If found, please return to the Office of Student Affairs or deposit in any campus mailbox.",
  returnInfo: "",
  backLogo: "/placeholder.svg?height=60&width=60",
  backLogoOpacity: "70",

  // Preset template settings
  templateMode: "custom",
  presetTemplate: "",
  presetStyle: 1,
  centerIconOpacity: 0.8,

  // Issuance
  issueDate: new Date().toISOString().split("T")[0],
}

// Default certificate data
export const DEFAULT_CERTIFICATE_DATA: CertificateFormData = {
  // Basic information
  universityName: "Westbrook University",
  universityLogo: "/placeholder.svg?height=80&width=80",
  fullName: "Emily Johnson",
  studentId: "20230110042",
  birthDate: "2001-03-15",
  nationality: "United States",
  faculty: "School of Computer Science & Engineering",
  major: "Computer Science",
  degreeType: "Bachelor",
  studyMode: "Full-time",
  enrollmentDate: "2023-09-05",
  expectedGraduationDate: "2027-05-15",
  currentYear: "Second Year",
  studentPhoto: "",

  // Certificate details
  certificateTitle: "Certificate of Enrollment",

  // Certificate content
  certificateContent:
    "This is to certify that the above-named student is currently enrolled as a full-time student in good academic standing at Westbrook University. The student is making satisfactory progress toward the completion of their degree requirements and is expected to graduate in May 2027.",

  // Issuance information
  issueDate: new Date().toISOString().split("T")[0],
  validityPeriod: "One academic year",
  issuerTitle: "University Registrar",
  issuerSignature: "M. Harrison",

  // Contact information
  contactInfo:
    "For verification of this certificate, please contact the Office of the Registrar at registrar@westbrook.edu or call (617) 495-1000. Reference student ID when inquiring.",

  // Design options
  paperColor: "#ffffff",
  headerColor: "#1e3a8a",
  textColor: "#1a1a1a",
  fontFamily: "Times New Roman, serif",
  enableWatermark: false,
  watermarkText: "OFFICIAL DOCUMENT",
  watermarkOpacity: 5,
  watermarkColor: "#000000",
  watermarkSize: "14",
  watermarkAngle: "-30",
  watermarkLineWidth: "20",
  enableBorder: true,
  borderColor: "#1e3a8a",
  borderStyle: "solid",

  // Pattern settings
  enablePattern: true,
  patternType: "corner",
  patternColor: "#1e3a8a",
  patternOpacity: 15,
  patternSize: "30",
  patternPosition: "all",

  // Export options
  pngQuality: "high",
}

// Days of week options
export const DAYS_OF_WEEK_OPTIONS = [
  { label: "Monday", value: "Monday" },
  { label: "Tuesday", value: "Tuesday" },
  { label: "Wednesday", value: "Wednesday" },
  { label: "Thursday", value: "Thursday" },
  { label: "Friday", value: "Friday" },
  { label: "Saturday", value: "Saturday" },
  { label: "Sunday", value: "Sunday" },
]

// Course mode options
export const COURSE_MODE_OPTIONS = [
  { label: "In-Person", value: "In-Person" },
  { label: "Online", value: "Online" },
  { label: "Hybrid", value: "Hybrid" },
]

// Course type options
export const COURSE_TYPE_OPTIONS = [
  { label: "Lecture", value: "Lecture" },
  { label: "Seminar", value: "Seminar" },
  { label: "Lab", value: "Lab" },
  { label: "Tutorial", value: "Tutorial" },
  { label: "Workshop", value: "Workshop" },
]

// Course color options
export const COURSE_COLOR_OPTIONS = [
  { label: "Blue", value: "#3b82f6" },
  { label: "Green", value: "#10b981" },
  { label: "Red", value: "#ef4444" },
  { label: "Purple", value: "#8b5cf6" },
  { label: "Orange", value: "#f97316" },
  { label: "Pink", value: "#ec4899" },
  { label: "Cyan", value: "#06b6d4" },
  { label: "Yellow", value: "#eab308" },
  { label: "Indigo", value: "#4f46e5" },
  { label: "Teal", value: "#14b8a6" },
]

// Time format options
export const HOUR_FORMAT_OPTIONS = [
  { label: "12-hour (AM/PM)", value: "12h" },
  { label: "24-hour", value: "24h" },
]

// Default course data
const DEFAULT_COURSES: ScheduleCourse[] = [
  {
    id: "1",
    courseCode: "CS101",
    courseName: "Introduction to Computer Science",
    instructor: "Prof. John Smith",
    credits: 3,
    location: "Science Building",
    building: "SCI",
    room: "101",
    startTime: "09:00",
    endTime: "10:30",
    days: ["Monday", "Wednesday"],
    color: "#3b82f6",
    mode: "In-Person",
    type: "Lecture",
    notes: "Bring your laptop to every class",
  },
  {
    id: "2",
    courseCode: "MATH201",
    courseName: "Calculus II",
    instructor: "Dr. Sarah Johnson",
    credits: 4,
    location: "Mathematics Building",
    building: "MATH",
    room: "305",
    startTime: "11:00",
    endTime: "12:30",
    days: ["Tuesday", "Thursday"],
    color: "#10b981",
    mode: "In-Person",
    type: "Lecture",
    notes: "",
  },
  {
    id: "3",
    courseCode: "CS101L",
    courseName: "Intro to CS Lab",
    instructor: "TA Michael Brown",
    credits: 1,
    location: "Computer Lab",
    building: "SCI",
    room: "B12",
    startTime: "14:00",
    endTime: "16:00",
    days: ["Friday"],
    color: "#3b82f6",
    mode: "In-Person",
    type: "Lab",
    notes: "",
  },
  {
    id: "4",
    courseCode: "ENG105",
    courseName: "Academic Writing",
    instructor: "Prof. Emily Davis",
    credits: 3,
    location: "Online",
    building: "",
    room: "",
    startTime: "15:30",
    endTime: "17:00",
    days: ["Monday", "Wednesday"],
    color: "#ef4444",
    mode: "Online",
    type: "Seminar",
    notes: "Zoom link will be provided in the course portal",
  },
]

// Default schedule data
export const DEFAULT_SCHEDULE_DATA: ScheduleFormData = {
  // Basic information
  universityName: "Westbrook University",
  universityLogo: "/placeholder.svg?height=80&width=80",
  department: "School of Computer Science & Engineering",
  fullName: "Emily Johnson",
  studentId: "20230110042",
  major: "Computer Science",
  term: "Fall 2024",
  academicYear: "2024-2025",

  // Schedule settings
  scheduleTitle: "Course Schedule",
  courses: DEFAULT_COURSES,

  // Display options
  showWeekends: false,
  showInstructors: true,
  showLocations: true,
  showCourseType: true,
  showCredits: true,
  showNotes: true,

  // Time settings
  startHour: 8,
  endHour: 20,
  hourFormat: "12h",

  // Design options
  headerColor: "#1e3a8a",
  tableHeaderColor: "#e8edf5",
  textColor: "#1a1a1a",
  borderColor: "#c7d2e8",
  paperColor: "#ffffff",
  fontFamily: "Arial, sans-serif",

  // Watermark settings
  enableWatermark: false,
  watermarkText: "OFFICIAL SCHEDULE",
  watermarkColor: "#000000",
  watermarkOpacity: 3,
  watermarkSize: "14",
  watermarkAngle: "-30",

  // Export options
  pngQuality: "high",
}

// Default admission letter data
export const DEFAULT_ADMISSION_LETTER_DATA: AdmissionLetterFormData = {
  // University information
  universityName: "Westbrook University",
  universityLogo: "/placeholder.svg?height=80&width=80",
  universityAddress: "1 University Drive, Cambridge, MA 02138",
  universityContact: "(617) 495-1000",
  universityWebsite: "www.westbrook.edu",

  // Student information
  studentName: "Emily Johnson",
  studentId: "20230110042",
  studentAddress: "42 Maple Street, Apt 3B, Boston, MA 02116",
  studentEmail: "emily.johnson@email.com",
  studentPhone: "(617) 555-8821",

  // Admission information
  programName: "Computer Science",
  departmentName: "School of Computer Science & Engineering",
  degreeType: "Bachelor",
  admissionDate: new Date().toISOString().split("T")[0],
  programStartDate: "2024-09-03",
  programDuration: "4 years",
  scholarshipInfo: "Dean's Merit Scholarship: $8,000 per academic year",

  // Letter content
  letterTitle: "Letter of Admission",
  letterContent:
    "Dear Ms. Johnson,\n\nOn behalf of the Admissions Committee, it is my great pleasure to inform you that you have been admitted to the Bachelor of Science in Computer Science program at Westbrook University for the Fall 2024 semester.\n\nYour application demonstrated exceptional academic achievement, intellectual curiosity, and the potential to make meaningful contributions to our university community. We were particularly impressed by your academic record and your commitment to excellence.\n\nPlease review the admission details below carefully.",
  congratulatoryMessage:
    "Congratulations on this outstanding achievement. We look forward to welcoming you to the Westbrook University community and supporting you throughout your academic journey.",
  nextStepsInfo:
    "To secure your place in the program, please complete the following steps by June 1, 2024:\n\n1. Submit your Enrollment Confirmation Form via the student portal\n2. Pay the non-refundable enrollment deposit of $500\n3. Register for New Student Orientation (August 26–30, 2024)\n4. Submit official final transcripts from all previously attended institutions\n5. Complete the housing application if you require on-campus accommodation\n\nDetailed instructions for each step will be sent to your registered email address.",

  // Signature information
  signatoryName: "Dr. Robert A. Mitchell",
  signatoryTitle: "Dean of Undergraduate Admissions",
  signatorySignature: "",
  officialStamp: "",

  // Design options
  headerColor: "#1e3a8a",
  textColor: "#1a1a1a",
  accentColor: "#2563eb",
  paperColor: "#ffffff",
  fontFamily: "Times New Roman, serif",

  // Watermark settings
  enableWatermark: false,
  watermarkText: "OFFICIAL ADMISSION",
  watermarkColor: "#000000",
  watermarkOpacity: 3,
  watermarkSize: "14",
  watermarkAngle: "-30",

  // Border settings
  enableBorder: true,
  borderColor: "#1e3a8a",
  borderStyle: "solid",

  // Export options
  pngQuality: "high",
}

// Default transcript course data
const DEFAULT_TRANSCRIPT_COURSES: TranscriptCourse[] = [
  {
    id: "1",
    courseCode: "CS101",
    courseName: "Introduction to Computer Science",
    credits: 3,
    grade: "A",
    semester: "Fall",
    academicYear: "2022-2023",
    completed: true,
  },
  {
    id: "2",
    courseCode: "MATH201",
    courseName: "Calculus I",
    credits: 4,
    grade: "B+",
    semester: "Fall",
    academicYear: "2022-2023",
    completed: true,
  },
  {
    id: "3",
    courseCode: "ENG105",
    courseName: "Academic Writing",
    credits: 3,
    grade: "A-",
    semester: "Fall",
    academicYear: "2022-2023",
    completed: true,
  },
  {
    id: "4",
    courseCode: "PHYS101",
    courseName: "Physics for Scientists and Engineers",
    credits: 4,
    grade: "B",
    semester: "Fall",
    academicYear: "2022-2023",
    completed: true,
  },
  {
    id: "5",
    courseCode: "CS102",
    courseName: "Data Structures and Algorithms",
    credits: 3,
    grade: "A",
    semester: "Spring",
    academicYear: "2022-2023",
    completed: true,
  },
  {
    id: "6",
    courseCode: "MATH202",
    courseName: "Calculus II",
    credits: 4,
    grade: "B+",
    semester: "Spring",
    academicYear: "2022-2023",
    completed: true,
  },
  {
    id: "7",
    courseCode: "CS201",
    courseName: "Computer Organization",
    credits: 3,
    grade: "A-",
    semester: "Spring",
    academicYear: "2022-2023",
    completed: true,
  },
  {
    id: "8",
    courseCode: "STAT201",
    courseName: "Statistics for Computer Science",
    credits: 3,
    grade: "B+",
    semester: "Spring",
    academicYear: "2022-2023",
    completed: true,
  },
  {
    id: "9",
    courseCode: "CS210",
    courseName: "Database Systems",
    credits: 3,
    grade: "A",
    semester: "Fall",
    academicYear: "2023-2024",
    completed: true,
  },
  {
    id: "10",
    courseCode: "CS220",
    courseName: "Software Engineering",
    credits: 3,
    grade: "A-",
    semester: "Fall",
    academicYear: "2023-2024",
    completed: true,
  },
  {
    id: "11",
    courseCode: "CS230",
    courseName: "Operating Systems",
    credits: 3,
    grade: "B+",
    semester: "Fall",
    academicYear: "2023-2024",
    completed: true,
  },
  {
    id: "12",
    courseCode: "CS240",
    courseName: "Computer Networks",
    credits: 3,
    grade: "In Progress",
    semester: "Spring",
    academicYear: "2023-2024",
    completed: false,
  },
]

// Default transcript data
export const DEFAULT_TRANSCRIPT_DATA: TranscriptFormData = {
  // University information
  universityName: "Westbrook University",
  universityLogo: "/placeholder.svg?height=80&width=80",
  universityAddress: "1 University Drive, Cambridge, MA 02138",
  universityContact: "(617) 495-1000",
  universityWebsite: "www.westbrook.edu",

  // Student information
  studentName: "Emily Johnson",
  studentId: "20230110042",
  programName: "Computer Science",
  departmentName: "School of Computer Science & Engineering",
  degreeType: "Bachelor",
  enrollmentDate: "2022-09-06",
  expectedGraduationDate: "2026-05-15",
  studentPhoto: "/placeholder.svg?height=150&width=120",

  // Grade information
  courses: DEFAULT_TRANSCRIPT_COURSES,
  currentGPA: "3.75",
  totalCredits: 36,
  completedCredits: 33,

  // Issuance information
  issueDate: new Date().toISOString().split("T")[0],
  registrarName: "Dr. Patricia L. Chen",
  registrarTitle: "University Registrar",
  registrarSignature: "",

  // Design options
  headerColor: "#1e3a8a",
  tableHeaderColor: "#e8edf5",
  textColor: "#1a1a1a",
  accentColor: "#2563eb",
  paperColor: "#ffffff",
  fontFamily: "Times New Roman, serif",

  // Watermark settings
  enableWatermark: false,
  watermarkText: "OFFICIAL TRANSCRIPT",
  watermarkColor: "#000000",
  watermarkOpacity: 3,
  watermarkSize: "14",
  watermarkAngle: "-30",

  // Border settings
  enableBorder: true,
  borderColor: "#1e3a8a",
  borderStyle: "solid",

  // Display options
  showStudentPhoto: true,
  showGradePoints: true,
  showGradeScale: true,
  showSemesterGPA: true,

  // Export options
  pngQuality: "high",
}

// Grade points corresponding to grade levels
export const GRADE_POINTS = {
  "A+": 4.0,
  A: 4.0,
  "A-": 3.7,
  "B+": 3.3,
  B: 3.0,
  "B-": 2.7,
  "C+": 2.3,
  C: 2.0,
  "C-": 1.7,
  "D+": 1.3,
  D: 1.0,
  F: 0.0,
  P: null, // Pass, not counted in GPA
  NP: null, // No Pass, not counted in GPA
  I: null, // Incomplete
  W: null, // Withdrawal
  "In Progress": null, // Currently taking
}

// Grade level options
export const GRADE_OPTIONS = [
  { label: "A+", value: "A+" },
  { label: "A", value: "A" },
  { label: "A-", value: "A-" },
  { label: "B+", value: "B+" },
  { label: "B", value: "B" },
  { label: "B-", value: "B-" },
  { label: "C+", value: "C+" },
  { label: "C", value: "C" },
  { label: "C-", value: "C-" },
  { label: "D+", value: "D+" },
  { label: "D", value: "D" },
  { label: "F", value: "F" },
  { label: "P (Pass)", value: "P" },
  { label: "NP (No Pass)", value: "NP" },
  { label: "I (Incomplete)", value: "I" },
  { label: "W (Withdrawal)", value: "W" },
  { label: "In Progress", value: "In Progress" },
]

// Semester options
export const SEMESTER_OPTIONS = [
  { label: "Fall", value: "Fall" },
  { label: "Spring", value: "Spring" },
  { label: "Summer", value: "Summer" },
  { label: "Winter", value: "Winter" },
]

// Preset template configurations
export const PRESET_TEMPLATES = [
  { id: "set1_1", label: "Classic Blue", set: 1, style: 1, image: "/templates/temp1.png" },
  { id: "set1_2", label: "Classic Green", set: 1, style: 2, image: "/templates/temp2.png" },
  { id: "set1_3", label: "Classic Red", set: 1, style: 3, image: "/templates/temp3.png" },
  { id: "set1_4", label: "Classic Purple", set: 1, style: 4, image: "/templates/temp4.png" },
  { id: "set1_5", label: "Classic Orange", set: 1, style: 5, image: "/templates/temp5.png" },
  { id: "set1_6", label: "Classic Teal", set: 1, style: 6, image: "/templates/temp6.png" },
  { id: "set2_1", label: "Modern Dark Blue", set: 2, style: 1, image: "/templates/temp2_1.png" },
  { id: "set2_2", label: "Modern Dark Green", set: 2, style: 2, image: "/templates/temp2_2.png" },
  { id: "set2_3", label: "Modern Dark Red", set: 2, style: 3, image: "/templates/temp2_3.png" },
  { id: "set2_4", label: "Modern Dark Purple", set: 2, style: 4, image: "/templates/temp2_4.png" },
  { id: "set2_5", label: "Modern Dark Orange", set: 2, style: 5, image: "/templates/temp2_5.png" },
  { id: "set2_6", label: "Modern Dark Teal", set: 2, style: 6, image: "/templates/temp2_6.png" },
]

// Hand holding template options
export const HAND_TEMPLATES = [
  { id: "hand1", label: "Hand Style 1", image: "/templates/hand1.png" },
  { id: "hand2", label: "Hand Style 2", image: "/templates/hand2.png" },
]

// Fee category options
export const FEE_CATEGORY_OPTIONS = [
  { label: "Tuition", value: "tuition" },
  { label: "Fee", value: "fee" },
  { label: "Insurance", value: "insurance" },
  { label: "Housing", value: "housing" },
  { label: "Other", value: "other" },
]

// Default tuition fee items
const DEFAULT_FEE_ITEMS: TuitionFeeItem[] = [
  { id: "1", description: "Tuition Fee", amount: 15000, category: "tuition" },
  { id: "2", description: "Student Activity Fee", amount: 350, category: "fee" },
  { id: "3", description: "Technology Fee", amount: 500, category: "fee" },
  { id: "4", description: "Health Insurance", amount: 1200, category: "insurance" },
  { id: "5", description: "Library Fee", amount: 150, category: "fee" },
]

// Default payment items
const DEFAULT_PAYMENTS: TuitionPaymentItem[] = [
  { id: "1", description: "Scholarship Credit", amount: 5000, date: "2026-08-15" },
  { id: "2", description: "Payment - Wire Transfer", amount: 8000, date: "2026-08-28" },
]

// Default tuition receipt data
export const DEFAULT_TUITION_RECEIPT_DATA: TuitionReceiptFormData = {
  // University Info
  universityName: "Westbrook University",
  universityAddress: "1 University Drive, Cambridge, MA 02138",
  universityLogo: "/placeholder.svg?height=80&width=80",
  department: "Office of Student Accounts",

  // Student Info
  studentName: "Emily Johnson",
  studentId: "20230110042",
  program: "Computer Science",
  term: "Fall",
  academicYear: "2024-2025",

  // Items
  feeItems: DEFAULT_FEE_ITEMS,
  payments: DEFAULT_PAYMENTS,

  // Receipt Details
  receiptTitle: "Tuition & Fees Receipt",
  issueDate: new Date().toISOString().split("T")[0],
  receiptNumber: "TR-" + Math.floor(100000 + Math.random() * 900000).toString(),
  footerNote:
    "This receipt is an official record of payment issued by Westbrook University. It is computer-generated and valid without a signature. For inquiries, contact the Office of Student Accounts at studentaccounts@westbrook.edu or (617) 495-2000.",

  // Design
  headerColor: "#1e3a8a",
  accentColor: "#2563eb",
  textColor: "#1a1a1a",
  paperColor: "#ffffff",
  fontFamily: "Times New Roman, serif",

  enableWatermark: false,
  watermarkText: "OFFICIAL RECEIPT",
  watermarkColor: "#000000",
  watermarkOpacity: 3,
  watermarkSize: "14",
  watermarkAngle: "-30",

  enableBorder: true,
  borderColor: "#1e3a8a",
  borderStyle: "solid",

  pngQuality: "high",
}

// ─── Major / Discipline lists ────────────────────────────────────────────────

export interface MajorDiscipline {
  label: string
  value: string
  majors: string[]
}

export const MAJOR_DISCIPLINES: MajorDiscipline[] = [
  {
    label: "Computer Science & Engineering",
    value: "cs_eng",
    majors: [
      "Computer Science",
      "Software Engineering",
      "Computer Engineering",
      "Information Technology",
      "Cybersecurity",
      "Artificial Intelligence",
      "Data Science",
      "Human-Computer Interaction",
      "Network Engineering",
      "Embedded Systems",
    ],
  },
  {
    label: "Business & Management",
    value: "business",
    majors: [
      "Business Administration",
      "Finance",
      "Accounting",
      "Marketing",
      "International Business",
      "Supply Chain Management",
      "Human Resource Management",
      "Entrepreneurship",
      "Economics",
      "Management Information Systems",
    ],
  },
  {
    label: "Engineering",
    value: "engineering",
    majors: [
      "Mechanical Engineering",
      "Electrical Engineering",
      "Civil Engineering",
      "Chemical Engineering",
      "Aerospace Engineering",
      "Biomedical Engineering",
      "Industrial Engineering",
      "Environmental Engineering",
      "Materials Science & Engineering",
      "Nuclear Engineering",
    ],
  },
  {
    label: "Natural Sciences",
    value: "natural_sciences",
    majors: [
      "Biology",
      "Chemistry",
      "Physics",
      "Mathematics",
      "Statistics",
      "Environmental Science",
      "Geology",
      "Astronomy",
      "Biochemistry",
      "Neuroscience",
    ],
  },
  {
    label: "Medicine & Health Sciences",
    value: "medicine",
    majors: [
      "Medicine (MBBS/MD)",
      "Nursing",
      "Pharmacy",
      "Public Health",
      "Dentistry",
      "Physical Therapy",
      "Occupational Therapy",
      "Medical Laboratory Science",
      "Nutrition & Dietetics",
      "Health Informatics",
    ],
  },
  {
    label: "Social Sciences & Humanities",
    value: "social_humanities",
    majors: [
      "Psychology",
      "Sociology",
      "Political Science",
      "History",
      "Philosophy",
      "Anthropology",
      "Geography",
      "International Relations",
      "Communication Studies",
      "Linguistics",
    ],
  },
  {
    label: "Arts & Design",
    value: "arts_design",
    majors: [
      "Fine Arts",
      "Graphic Design",
      "Architecture",
      "Interior Design",
      "Industrial Design",
      "Film & Media Studies",
      "Music",
      "Theatre & Performing Arts",
      "Fashion Design",
      "Photography",
    ],
  },
  {
    label: "Education",
    value: "education",
    majors: [
      "Elementary Education",
      "Secondary Education",
      "Special Education",
      "Educational Psychology",
      "Curriculum & Instruction",
      "Higher Education Administration",
      "Early Childhood Education",
      "Physical Education",
      "TESOL / Applied Linguistics",
      "Educational Technology",
    ],
  },
  {
    label: "Law",
    value: "law",
    majors: [
      "Law (LLB/JD)",
      "International Law",
      "Corporate Law",
      "Criminal Justice",
      "Intellectual Property Law",
      "Environmental Law",
      "Human Rights Law",
      "Tax Law",
      "Comparative Law",
      "Legal Studies",
    ],
  },
  {
    label: "Custom",
    value: "custom",
    majors: [],
  },
]

// Built-in course templates per discipline (used to pre-populate schedule)
export const DISCIPLINE_COURSE_TEMPLATES: Record<string, ScheduleCourse[]> = {
  cs_eng: [
    {
      id: "t1",
      courseCode: "CS101",
      courseName: "Introduction to Programming",
      instructor: "Prof. Alan Turing",
      credits: 3,
      location: "Science Building",
      building: "SCI",
      room: "201",
      startTime: "09:00",
      endTime: "10:30",
      days: ["Monday", "Wednesday"],
      color: "#3b82f6",
      mode: "In-Person",
      type: "Lecture",
      notes: "",
    },
    {
      id: "t2",
      courseCode: "CS102",
      courseName: "Data Structures & Algorithms",
      instructor: "Dr. Grace Hopper",
      credits: 3,
      location: "Science Building",
      building: "SCI",
      room: "305",
      startTime: "11:00",
      endTime: "12:30",
      days: ["Tuesday", "Thursday"],
      color: "#8b5cf6",
      mode: "In-Person",
      type: "Lecture",
      notes: "",
    },
    {
      id: "t3",
      courseCode: "MATH201",
      courseName: "Discrete Mathematics",
      instructor: "Prof. John Nash",
      credits: 3,
      location: "Math Building",
      building: "MATH",
      room: "102",
      startTime: "14:00",
      endTime: "15:30",
      days: ["Monday", "Wednesday"],
      color: "#10b981",
      mode: "In-Person",
      type: "Lecture",
      notes: "",
    },
    {
      id: "t4",
      courseCode: "CS101L",
      courseName: "Programming Lab",
      instructor: "TA James Lee",
      credits: 1,
      location: "Computer Lab",
      building: "SCI",
      room: "B10",
      startTime: "15:00",
      endTime: "17:00",
      days: ["Friday"],
      color: "#3b82f6",
      mode: "In-Person",
      type: "Lab",
      notes: "Bring laptop",
    },
  ],
  business: [
    {
      id: "t1",
      courseCode: "BUS101",
      courseName: "Principles of Management",
      instructor: "Prof. Peter Drucker",
      credits: 3,
      location: "Business School",
      building: "BUS",
      room: "101",
      startTime: "09:00",
      endTime: "10:30",
      days: ["Monday", "Wednesday"],
      color: "#f97316",
      mode: "In-Person",
      type: "Lecture",
      notes: "",
    },
    {
      id: "t2",
      courseCode: "ACC201",
      courseName: "Financial Accounting",
      instructor: "Dr. Warren Buffett",
      credits: 3,
      location: "Business School",
      building: "BUS",
      room: "205",
      startTime: "11:00",
      endTime: "12:30",
      days: ["Tuesday", "Thursday"],
      color: "#eab308",
      mode: "In-Person",
      type: "Lecture",
      notes: "",
    },
    {
      id: "t3",
      courseCode: "MKT301",
      courseName: "Marketing Fundamentals",
      instructor: "Prof. Philip Kotler",
      credits: 3,
      location: "Business School",
      building: "BUS",
      room: "310",
      startTime: "14:00",
      endTime: "15:30",
      days: ["Monday", "Wednesday"],
      color: "#ec4899",
      mode: "In-Person",
      type: "Seminar",
      notes: "",
    },
    {
      id: "t4",
      courseCode: "ECO101",
      courseName: "Microeconomics",
      instructor: "Dr. Adam Smith",
      credits: 3,
      location: "Business School",
      building: "BUS",
      room: "120",
      startTime: "13:00",
      endTime: "14:30",
      days: ["Tuesday", "Thursday"],
      color: "#06b6d4",
      mode: "In-Person",
      type: "Lecture",
      notes: "",
    },
  ],
  engineering: [
    {
      id: "t1",
      courseCode: "ENG101",
      courseName: "Engineering Mechanics",
      instructor: "Prof. Isaac Newton",
      credits: 4,
      location: "Engineering Hall",
      building: "ENG",
      room: "101",
      startTime: "08:00",
      endTime: "09:30",
      days: ["Monday", "Wednesday", "Friday"],
      color: "#6366f1",
      mode: "In-Person",
      type: "Lecture",
      notes: "",
    },
    {
      id: "t2",
      courseCode: "PHYS201",
      courseName: "Physics II — Electromagnetism",
      instructor: "Dr. James Maxwell",
      credits: 4,
      location: "Physics Building",
      building: "PHY",
      room: "201",
      startTime: "10:00",
      endTime: "11:30",
      days: ["Tuesday", "Thursday"],
      color: "#14b8a6",
      mode: "In-Person",
      type: "Lecture",
      notes: "",
    },
    {
      id: "t3",
      courseCode: "ENG101L",
      courseName: "Engineering Lab",
      instructor: "TA Sarah Chen",
      credits: 1,
      location: "Engineering Hall",
      building: "ENG",
      room: "B05",
      startTime: "14:00",
      endTime: "17:00",
      days: ["Friday"],
      color: "#6366f1",
      mode: "In-Person",
      type: "Lab",
      notes: "Safety goggles required",
    },
    {
      id: "t4",
      courseCode: "MATH301",
      courseName: "Differential Equations",
      instructor: "Prof. Leonhard Euler",
      credits: 3,
      location: "Math Building",
      building: "MATH",
      room: "205",
      startTime: "13:00",
      endTime: "14:30",
      days: ["Monday", "Wednesday"],
      color: "#f59e0b",
      mode: "In-Person",
      type: "Lecture",
      notes: "",
    },
  ],
  medicine: [
    {
      id: "t1",
      courseCode: "MED101",
      courseName: "Human Anatomy",
      instructor: "Prof. Henry Gray",
      credits: 4,
      location: "Medical School",
      building: "MED",
      room: "101",
      startTime: "08:00",
      endTime: "09:30",
      days: ["Monday", "Tuesday", "Thursday"],
      color: "#ef4444",
      mode: "In-Person",
      type: "Lecture",
      notes: "",
    },
    {
      id: "t2",
      courseCode: "MED102",
      courseName: "Physiology",
      instructor: "Dr. William Harvey",
      credits: 4,
      location: "Medical School",
      building: "MED",
      room: "205",
      startTime: "10:00",
      endTime: "11:30",
      days: ["Monday", "Wednesday", "Friday"],
      color: "#f97316",
      mode: "In-Person",
      type: "Lecture",
      notes: "",
    },
    {
      id: "t3",
      courseCode: "MED101L",
      courseName: "Anatomy Lab",
      instructor: "Dr. Marie Curie",
      credits: 2,
      location: "Medical School",
      building: "MED",
      room: "Lab A",
      startTime: "14:00",
      endTime: "17:00",
      days: ["Tuesday", "Thursday"],
      color: "#ef4444",
      mode: "In-Person",
      type: "Lab",
      notes: "Lab coat and gloves required",
    },
    {
      id: "t4",
      courseCode: "MED103",
      courseName: "Biochemistry",
      instructor: "Prof. Linus Pauling",
      credits: 3,
      location: "Medical School",
      building: "MED",
      room: "310",
      startTime: "13:00",
      endTime: "14:30",
      days: ["Wednesday", "Friday"],
      color: "#8b5cf6",
      mode: "In-Person",
      type: "Lecture",
      notes: "",
    },
  ],
  natural_sciences: [
    {
      id: "t1",
      courseCode: "BIO201",
      courseName: "Cell Biology",
      instructor: "Prof. Rosalind Franklin",
      credits: 3,
      location: "Science Hall",
      building: "SCI",
      room: "301",
      startTime: "09:00",
      endTime: "10:30",
      days: ["Monday", "Wednesday"],
      color: "#10b981",
      mode: "In-Person",
      type: "Lecture",
      notes: "",
    },
    {
      id: "t2",
      courseCode: "CHEM201",
      courseName: "Organic Chemistry",
      instructor: "Dr. Linus Pauling",
      credits: 4,
      location: "Chemistry Building",
      building: "CHEM",
      room: "201",
      startTime: "11:00",
      endTime: "12:30",
      days: ["Tuesday", "Thursday"],
      color: "#f59e0b",
      mode: "In-Person",
      type: "Lecture",
      notes: "",
    },
    {
      id: "t3",
      courseCode: "BIO201L",
      courseName: "Cell Biology Lab",
      instructor: "TA David Park",
      credits: 1,
      location: "Science Hall",
      building: "SCI",
      room: "Lab 2",
      startTime: "14:00",
      endTime: "17:00",
      days: ["Wednesday"],
      color: "#10b981",
      mode: "In-Person",
      type: "Lab",
      notes: "Lab coat required",
    },
    {
      id: "t4",
      courseCode: "MATH202",
      courseName: "Calculus III",
      instructor: "Prof. Carl Gauss",
      credits: 4,
      location: "Math Building",
      building: "MATH",
      room: "105",
      startTime: "13:00",
      endTime: "14:30",
      days: ["Monday", "Wednesday", "Friday"],
      color: "#6366f1",
      mode: "In-Person",
      type: "Lecture",
      notes: "",
    },
  ],
  social_humanities: [
    {
      id: "t1",
      courseCode: "PSY101",
      courseName: "Introduction to Psychology",
      instructor: "Prof. Sigmund Freud",
      credits: 3,
      location: "Humanities Hall",
      building: "HUM",
      room: "201",
      startTime: "09:00",
      endTime: "10:30",
      days: ["Monday", "Wednesday"],
      color: "#8b5cf6",
      mode: "In-Person",
      type: "Lecture",
      notes: "",
    },
    {
      id: "t2",
      courseCode: "SOC201",
      courseName: "Social Theory",
      instructor: "Dr. Max Weber",
      credits: 3,
      location: "Humanities Hall",
      building: "HUM",
      room: "305",
      startTime: "11:00",
      endTime: "12:30",
      days: ["Tuesday", "Thursday"],
      color: "#ec4899",
      mode: "In-Person",
      type: "Seminar",
      notes: "",
    },
    {
      id: "t3",
      courseCode: "POL101",
      courseName: "Introduction to Political Science",
      instructor: "Prof. Hannah Arendt",
      credits: 3,
      location: "Humanities Hall",
      building: "HUM",
      room: "110",
      startTime: "14:00",
      endTime: "15:30",
      days: ["Monday", "Wednesday"],
      color: "#06b6d4",
      mode: "In-Person",
      type: "Lecture",
      notes: "",
    },
    {
      id: "t4",
      courseCode: "ENG201",
      courseName: "Academic Writing & Research",
      instructor: "Dr. Virginia Woolf",
      credits: 3,
      location: "Humanities Hall",
      building: "HUM",
      room: "220",
      startTime: "13:00",
      endTime: "14:30",
      days: ["Tuesday", "Thursday"],
      color: "#f97316",
      mode: "In-Person",
      type: "Seminar",
      notes: "Weekly reading responses required",
    },
  ],
  arts_design: [
    {
      id: "t1",
      courseCode: "ART101",
      courseName: "Foundation Drawing",
      instructor: "Prof. Leonardo da Vinci",
      credits: 3,
      location: "Arts Building",
      building: "ART",
      room: "Studio 1",
      startTime: "09:00",
      endTime: "12:00",
      days: ["Monday", "Wednesday"],
      color: "#ef4444",
      mode: "In-Person",
      type: "Workshop",
      notes: "Bring your own drawing materials",
    },
    {
      id: "t2",
      courseCode: "DES201",
      courseName: "Graphic Design Principles",
      instructor: "Dr. Paul Rand",
      credits: 3,
      location: "Arts Building",
      building: "ART",
      room: "Lab 3",
      startTime: "13:00",
      endTime: "15:30",
      days: ["Tuesday", "Thursday"],
      color: "#8b5cf6",
      mode: "In-Person",
      type: "Workshop",
      notes: "Adobe CC required",
    },
    {
      id: "t3",
      courseCode: "ART301",
      courseName: "Art History: Modern Era",
      instructor: "Prof. Ernst Gombrich",
      credits: 3,
      location: "Arts Building",
      building: "ART",
      room: "Lecture Hall",
      startTime: "10:00",
      endTime: "11:30",
      days: ["Monday", "Wednesday"],
      color: "#f59e0b",
      mode: "In-Person",
      type: "Lecture",
      notes: "",
    },
  ],
  education: [
    {
      id: "t1",
      courseCode: "EDU101",
      courseName: "Foundations of Education",
      instructor: "Prof. John Dewey",
      credits: 3,
      location: "Education Building",
      building: "EDU",
      room: "201",
      startTime: "09:00",
      endTime: "10:30",
      days: ["Monday", "Wednesday"],
      color: "#10b981",
      mode: "In-Person",
      type: "Lecture",
      notes: "",
    },
    {
      id: "t2",
      courseCode: "EDU201",
      courseName: "Educational Psychology",
      instructor: "Dr. Jean Piaget",
      credits: 3,
      location: "Education Building",
      building: "EDU",
      room: "305",
      startTime: "11:00",
      endTime: "12:30",
      days: ["Tuesday", "Thursday"],
      color: "#6366f1",
      mode: "In-Person",
      type: "Lecture",
      notes: "",
    },
    {
      id: "t3",
      courseCode: "EDU301",
      courseName: "Curriculum Design & Assessment",
      instructor: "Prof. Benjamin Bloom",
      credits: 3,
      location: "Education Building",
      building: "EDU",
      room: "110",
      startTime: "14:00",
      endTime: "15:30",
      days: ["Monday", "Wednesday"],
      color: "#f97316",
      mode: "In-Person",
      type: "Seminar",
      notes: "",
    },
    {
      id: "t4",
      courseCode: "EDU401",
      courseName: "Teaching Practicum",
      instructor: "Supervisor: Dr. Maria Montessori",
      credits: 4,
      location: "Partner School",
      building: "EXT",
      room: "Classroom",
      startTime: "08:00",
      endTime: "12:00",
      days: ["Friday"],
      color: "#ec4899",
      mode: "In-Person",
      type: "Tutorial",
      notes: "Field placement — attendance mandatory",
    },
  ],
  law: [
    {
      id: "t1",
      courseCode: "LAW101",
      courseName: "Introduction to Law",
      instructor: "Prof. Oliver Wendell Holmes",
      credits: 3,
      location: "Law School",
      building: "LAW",
      room: "101",
      startTime: "09:00",
      endTime: "10:30",
      days: ["Monday", "Wednesday"],
      color: "#1e40af",
      mode: "In-Person",
      type: "Lecture",
      notes: "",
    },
    {
      id: "t2",
      courseCode: "LAW201",
      courseName: "Constitutional Law",
      instructor: "Dr. Ruth Bader Ginsburg",
      credits: 4,
      location: "Law School",
      building: "LAW",
      room: "Moot Court",
      startTime: "11:00",
      endTime: "12:30",
      days: ["Tuesday", "Thursday"],
      color: "#6366f1",
      mode: "In-Person",
      type: "Seminar",
      notes: "Case readings due before each class",
    },
    {
      id: "t3",
      courseCode: "LAW301",
      courseName: "Contract Law",
      instructor: "Prof. Lon Fuller",
      credits: 3,
      location: "Law School",
      building: "LAW",
      room: "205",
      startTime: "14:00",
      endTime: "15:30",
      days: ["Monday", "Wednesday"],
      color: "#0891b2",
      mode: "In-Person",
      type: "Lecture",
      notes: "",
    },
    {
      id: "t4",
      courseCode: "LAW401",
      courseName: "Legal Research & Writing",
      instructor: "Dr. Bryan Garner",
      credits: 2,
      location: "Law School",
      building: "LAW",
      room: "Library",
      startTime: "13:00",
      endTime: "14:30",
      days: ["Friday"],
      color: "#059669",
      mode: "In-Person",
      type: "Workshop",
      notes: "Bring Bluebook citation guide",
    },
  ],
}
