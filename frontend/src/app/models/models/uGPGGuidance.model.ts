export class UGPGGuidance {
  id: string = ""
  studentName: string = ""
  thesisTopic: string = ""
  openingCheckDate?: Date
  openingCheckResult: string = ""
  midtermCheckDate?: Date
  midtermCheckResult: string = ""
  defenseDate?: Date
  defenseResult: string = ""
  createdAt: Date = new Date(0)
  updatedAt: Date = new Date(0)
}

export class UGPGGuidancePage {
  uGPGGuidances: UGPGGuidance[] = []
  totalCount: number = 0
}

export class EditUGPGGuidance {
  studentName: string = ""
  thesisTopic: string = ""
  openingCheckDate: Date | null = null
  openingCheckResult: string | null = null
  midtermCheckDate: Date | null = null
  midtermCheckResult: string | null = null
  defenseDate: Date | null = null
  defenseResult: string | null = null
}

export class UGPGGuidanceFilter {
  studentName: string | null = null
  thesisTopic: string | null = null
  defenseDateStart: Date | null = null
  defenseDateEnd: Date | null = null
  createdStart: Date | null = null
  createdEnd: Date | null = null
  updatedStart: Date | null = null
  updatedEnd: Date | null = null
}

export interface UGPGGuidanceResponse {
  error?: unknown;
  data?: {
    uGPGGuidance: UGPGGuidance
  }
}

export interface UGPGGuidancesByFilterResponse {
  error?: unknown;
  data?: {
    uGPGGuidancesByFilter: {
      uGPGGuidances: UGPGGuidance[],
      totalCount: number
    }
  }
}

export interface CreateUGPGGuidanceResponse {
  error?: unknown;
  data?: {
    createUGPGGuidance: UGPGGuidance
  }
}

export interface UpdateUGPGGuidanceResponse {
  error?: unknown;
  data?: {
    updateUGPGGuidance: UGPGGuidance
  }
}

export interface DeleteUGPGGuidanceResponse {
  error?: unknown;
  data?: {
    deleteUGPGGuidance: UGPGGuidance
  }
}
