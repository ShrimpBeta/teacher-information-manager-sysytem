export class UGPGGuidance {
    id: string = ""
    studentName: string = ""
    thesisTopic: string = ""
    openingCheckDate?: Date
    openingCheckResult: string = ""
    middleCheckDate?: Date
    midddleCheckResult: string = ""
    defenseDate?: Date
    defenseResult: string = ""
    createdAt: Date = new Date(0)
    updatedAt: Date = new Date(0)
}