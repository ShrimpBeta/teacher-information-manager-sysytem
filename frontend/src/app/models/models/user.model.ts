export class User {
  id: string = ""
  username: string = ""
  email: string = ""
  avatar: string = ""
  phoneNumber: string = ""
  activate: boolean = false
  createdAt: Date = new Date(0)
  updatedAt: Date = new Date(0)
}

export class UserExport {
  id: string = ""
  email: string = ""
  username: string = ""
  avatar: string = ""
}

export interface SignInResponse {
  error?: unknown;
  data?: {
    signIn: {
      token: string;
      user: User
    }
  }
}