export class Report {
  classScheduleReport: string[] = []
  compGuidanceReport: string[] = []
  eduReformReport: string[] = []
  mentorshipReport: string[] = []
  monographReport: string[] = []
  paperReport: string[] = []
  sciResearchReport: string[] = []
  uGPGGuidanceReport: string[] = []
  startDate!: Date
  endDate!: Date
  teachers: string[] = []
}

export class ReportFilter {
  teachersIn: string[] = []
  startDate!: Date
  endDate!: Date
  classSchedule: boolean = true
  compGuidance: boolean = true
  eduReform: boolean = true
  mentorship: boolean = true
  monograph: boolean = true
  paper: boolean = true
  sciResearch: boolean = true
  uGPGGuidance: boolean = true
  specifyTeacherIn: boolean = false
}

export interface ReportResponse {
  error?: unknown;
  data?: {
    report: Report
  }
}
