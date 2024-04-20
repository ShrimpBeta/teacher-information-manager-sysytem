export class Password {
  id: string = ""
  url: string = ""
  appName: string = ""
  account: string = ""
  description: string = ""
  createdAt: Date = new Date(0)
  updatedAt: Date = new Date(0)
}

export class PasswordsPage {
  totalCount: number = 0
  passwords: Password[] = []
}

export class PasswordTrue {
  id: string = ""
  url: string = ""
  appName: string = ""
  account: string = ""
  password: string = ""
  description: string = ""
  createdAt: Date = new Date(0)
  updatedAt: Date = new Date(0)
}

export class EditPassword {
  url: string | null = null
  appName: string | null = null
  account: string = ""
  password: string = ""
  description: string | null = null
}

export class PasswordFilter {
  url: string | null = null
  appName: string | null = null
  account: string | null = null
}

export interface PasswordTrueResponse {
  error?: unknown;
  data?: {
    passwordTrue: PasswordTrue
  }
}

export interface PasswordsTrueResponse {
  error?: unknown;
  data?: {
    passwordsTrue: PasswordTrue[]
  }
}

export interface PasswordsByFilterResponse {
  error?: unknown;
  data?: {
    passwordsByFilter: {
      totalCount: number
      passwords: Password[]
    }
  }
}

export interface CreatePasswordResponse {
  error?: unknown;
  data?: {
    createPassword: Password
  }
}

export interface UpdatePasswordResponse {
  error?: unknown;
  data?: {
    updatePassword: Password
  }
}

export interface DeletePasswordResponse {
  error?: unknown;
  data?: {
    deletePassword: Password
  }
}
