import { UserExport } from "./user.model"

export class AwardRecord {
  awardName: string = ""
  awardDate: Date | null = null
  awardLevel: string | null = null
  awardRank: string | null = null
}

export class SciResearch {
  id: string = ""
  teachersIn: UserExport[] = []
  teachersOut: string[] = []
  number: string = ""
  title: string = ""
  startDate: Date = new Date(0)
  duration: string = ""
  level: string = ""
  rank: string = ""
  achievement: string = ""
  fund: string = ""
  isAward: boolean = false
  awards: AwardRecord[] = []
  createdAt: Date = new Date(0)
  updatedAt: Date = new Date(0)
}

export class SciResearchPage {
  sciResearchs: SciResearch[] = []
  totalCount: number = 0
}

export class EditAwardRecord {
  awardName: string | null = null
  awardDate: Date | null = null
  awardLevel: string | null = null
  awardRank: string | null = null
}

export class EditSciResearch {
  teachersIn: string[] = []
  teachersOut: string[] | null = null
  number: string | null = null
  title: string | null = null
  startDate: Date | null = null
  duration: string | null = null
  level: string | null = null
  rank: string | null = null
  achievement: string | null = null
  fund: string | null = null
  awards: EditAwardRecord[] | null = null
}

export class SciResearchFilter {
  title: string | null = null
  teachersIn: string[] | null = null
  teachersOut: string[] | null = null
  number: string | null = null
  level: string | null = null
  rank: string | null = null
  achievement: string | null = null
  fund: string | null = null
  startDateStart: Date | null = null
  startDateEnd: Date | null = null
  createdStart: Date | null = null
  createdEnd: Date | null = null
  updatedStart: Date | null = null
  updatedEnd: Date | null = null
  isAward: boolean | null = null
  awardName: string | null = null
  awardLevel: string | null = null
  awardRank: string | null = null
  awardDateStart: Date | null = null
  awardDateEnd: Date | null = null
}

export interface SciResearchResponse {
  error?: unknown;
  data?: {
    sciResearch: SciResearch
  }
}

export interface SciResearchsByFilterResponse {
  error?: unknown;
  data?: {
    sciResearchsByFilter: {
      sciResearchs: SciResearch[],
      totalCount: number
    }
  }
}

export interface CreateSciResearchResponse {
  error?: unknown;
  data?: {
    createSciResearch: SciResearch
  }
}

export interface UpdateSciResearchResponse {
  error?: unknown;
  data?: {
    updateSciResearch: SciResearch
  }
}

export interface DeleteSciResearchResponse {
  error?: unknown;
  data?: {
    deleteSciResearch: SciResearch
  }
}

