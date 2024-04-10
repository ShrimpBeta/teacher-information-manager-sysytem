import { S } from "@angular/cdk/keycodes"
import { UserExport } from "./user.model"

export class EduReform {
  id: string = ""
  teachersIn: UserExport[] = []
  teachersOut: string[] = []
  number: string = ""
  title: string = ""
  startDate?: Date
  duration: string = ""
  level: string = ""
  rank: string = ""
  achievement: string = ""
  fund: string = ""
  craetedAt: Date = new Date(0)
  updatedAt: Date = new Date(0)
}

export class EditEduReform {
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
}

export class EduReformFilter {
  number: string | null = null
  teachersIn: string[] | null = null
  teachersOut: string[] | null = null
  title: string | null = null
  startDateStart: Date | null = null
  startDateEnd: Date | null = null
  level: string | null = null
  rank: string | null = null
  achievement: string | null = null
  fund: string | null = null
  craetedStart: Date | null = null
  craetedEnd: Date | null = null
  updatedStart: Date | null = null
  updatedEnd: Date | null = null
}


export interface EduReformResponse {
  error?: unknown;
  data?: {
    eduReform: EduReform
  }
}

export interface EduReformsByFilterResponse {
  error?: unknown;
  data?: {
    eduReformsByFilter: EduReform[]
  }
}

export interface CreateEduReformResponse {
  error?: unknown;
  data?: {
    createEduReform: EduReform
  }
}

export interface UpdateEduReformResponse {
  error?: unknown;
  data?: {
    updateEduReform: EduReform
  }
}

export interface DeleteEduReformResponse {
  error?: unknown;
  data?: {
    deleteEduReform: EduReform
  }
}
