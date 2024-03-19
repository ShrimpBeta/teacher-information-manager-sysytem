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