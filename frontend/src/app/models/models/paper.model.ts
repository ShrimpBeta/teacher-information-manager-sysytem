import { UserExport } from "./user.model"

export class Paper {
    id: string = ""
    teachersIn: UserExport[] = []
    teachersOut: string[] = []
    title: string = ""
    publishDate?: Date
    rank: string = ""
    journalName: string = ""
    journalLevel: string = ""
    createdAt: Date = new Date(0)
    updatedAt: Date = new Date(0)
}