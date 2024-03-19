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