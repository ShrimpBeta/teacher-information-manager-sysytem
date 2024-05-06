
export class CompGuidance {
  id: string = ""
  projectName: string = ""
  studentNames: string[] = []
  competitionScore: string = ""
  guidanceDate!: Date
  awardStatus: string = ""
  createdAt!: Date
  updatedAt!: Date
}

export class CompGuidancePage {
  compGuidances: CompGuidance[] = []
  totalCount: number = 0
}

export class EditCompGuidance {
  projectName: string = ""
  studentNames: string[] = []
  competitionScore: string | null = null
  guidanceDate: Date | null = null
  awardStatus: string | null = null
}


export class CompGuidanceFilter {
  projectName: string | null = null
  studentNames: string[] | null = null
  guidanceDateStart: Date | null = null
  guidanceDateEnd: Date | null = null
  awardStatus: string | null = null
  createdStart: Date | null = null
  createdEnd: Date | null = null
  updatedStart: Date | null = null
  updatedEnd: Date | null = null
}

export interface CompGuidanceResponse {
  error?: unknown;
  data?: {
    compGuidance: CompGuidance
  }
}

export interface CompGuidancesByFilterResponse {
  error?: unknown;
  data?: {
    compGuidancesByFilter: {
      compGuidances: CompGuidance[],
      totalCount: number
    }
  }
}

export interface CreateCompGuidanceResponse {
  error?: unknown;
  data?: {
    createCompGuidance: CompGuidance
  }
}

export interface UpdateCompGuidanceResponse {
  error?: unknown;
  data?: {
    updateCompGuidance: CompGuidance
  }
}

export interface DeleteCompGuidanceResponse {
  error?: unknown;
  data?: {
    deleteCompGuidance: CompGuidance
  }
}
