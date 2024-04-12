import { UserExport } from "./user.model"

export class Monograph {
  id: string = ""
  teachersIn: UserExport[] = []
  teachersOut: string[] = []
  title: string = ""
  publishDate?: Date
  publishLevel: string = ""
  rank: string = ""
  createdAt: Date = new Date(0)
  updatedAt: Date = new Date(0)
}

export class MonographPage {
  monographs: Monograph[] = []
  totalCount: number = 0
}

export class EditMonograph {
  teachersIn: string[] = []
  teachersOut: string[] | null = null
  title: string | null = null
  publishDate: Date | null = null
  publishLevel: string | null = null
  rank: string | null = null
}

export class MonographFilter {
  title: string | null = null
  teachersIn: string[] | null = null
  teachersOut: string[] | null = null
  publishLevel: string | null = null
  rank: string | null = null
  publishDateStart: Date | null = null
  publishDateEnd: Date | null = null
  createdStart: Date | null = null
  createdEnd: Date | null = null
  updatedStart: Date | null = null
  updatedEnd: Date | null = null
}

export interface MonographResponse {
  error?: unknown;
  data?: {
    monograph: Monograph
  }
}

export interface MonographsByFilterResponse {
  error?: unknown;
  data?: {
    monographsByFilter: {
      monographs: Monograph[],
      totalCount: number
    }
  }
}

export interface CreateMonographResponse {
  error?: unknown;
  data?: {
    createMonograph: Monograph
  }
}

export interface UpdateMonographResponse {
  error?: unknown;
  data?: {
    updateMonograph: Monograph
  }
}

export interface DeleteMonographResponse {
  error?: unknown;
  data?: {
    deleteMonograph: Monograph
  }
}
