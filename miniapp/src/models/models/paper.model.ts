import { UserExport } from "./user.model"

export class Paper {
  id: string = ""
  teachersIn: UserExport[] = []
  teachersOut: string[] = []
  title: string = ""
  publishDate: Date= new Date(0)
  rank: string = ""
  journalName: string = ""
  journalLevel: string = ""
  createdAt: Date = new Date(0)
  updatedAt: Date = new Date(0)
}

export class PaperPage {
  papers: Paper[] = []
  totalCount: number = 0
}

export class EditPaper {
  teachersIn: string[] = []
  teachersOut: string[] | null = null
  title: string | null = null
  publishDate: Date | null = null
  rank: string | null = null
  journalName: string | null = null
  journalLevel: string | null = null
}

export class PaperFilter {
  title: string | null = null
  teachersIn: string[] | null = null
  teachersOut: string[] | null = null
  journalName: string | null = null
  journalLevel: string | null = null
  rank: string | null = null
  publishDateStart: Date | null = null
  publishDateEnd: Date | null = null
  createdStart: Date | null = null
  createdEnd: Date | null = null
  updatedStart: Date | null = null
  updatedEnd: Date | null = null
}


export interface PaperResponse {
  error?: unknown;
  data?: {
    paper: Paper
  }
}

export interface PapersByFilterResponse {
  error?: unknown;
  data?: {
    papersByFilter: {
      papers: Paper[],
      totalCount: number
    }
  }
}

export interface CreatePaperResponse {
  error?: unknown;
  data?: {
    createPaper: Paper
  }
}

export interface UpdatePaperResponse {
  error?: unknown;
  data?: {
    updatePaper: Paper
  }
}

export interface DeletePaperResponse {
  error?: unknown;
  data?: {
    deletePaper: Paper
  }
}
