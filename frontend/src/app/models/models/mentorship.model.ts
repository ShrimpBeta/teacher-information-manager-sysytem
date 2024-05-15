export class Mentorship {
  id: string = ""
  projectName: string = ""
  studentNames: string[] = []
  grade: string = ""
  guidanceDate!: Date
  createdAt!: Date
  updatedAt!: Date
}

export class MentorshipPage {
  mentorships: Mentorship[] = []
  totalCount: number = 0
}

export class EditMentorship {
  projectName: string = ""
  studentNames: string[] = []
  grade: string | null = null
  guidanceDate: Date | null = null
}

export class MentorshipFilter {
  projectName: string | null = null
  studentNames: string[] | null = null
  guidanceDateStart: Date | null = null
  guidanceDateEnd: Date | null = null
  grade: string | null = null
  createdStart: Date | null = null
  createdEnd: Date | null = null
  updatedStart: Date | null = null
  updatedEnd: Date | null = null
}

export class PreviewMentorship {
  projectName: string = ""
  studentNames: string[] = []
  grade: string | null = null
  guidanceDate: Date | null = null
}

export interface MentorshipResponse {
  error?: unknown;
  data?: {
    mentorship: Mentorship
  }
}

export interface MentorshipsByFilterResponse {
  error?: unknown;
  data?: {
    mentorshipsByFilter: {
      mentorships: Mentorship[],
      totalCount: number
    }
  }
}

export interface CreateMentorshipResponse {
  error?: unknown;
  data?: {
    createMentorship: Mentorship
  }
}

export interface UpdateMentorshipResponse {
  error?: unknown;
  data?: {
    updateMentorship: Mentorship
  }
}

export interface DeleteMentorshipResponse {
  error?: unknown;
  data?: {
    deleteMentorship: Mentorship
  }
}

export interface UploadMentorshipsResponse {
  error?: unknown;
  data?: {
    uploadMentorships: PreviewMentorship[]
  }
}
