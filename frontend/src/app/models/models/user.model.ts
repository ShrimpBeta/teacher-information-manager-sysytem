export class User {
  id: string = ""
  username: string = ""
  email: string = ""
  avatar: string = ""
  phoneNumber: string = ""
  activate: boolean = false
  wechatAuth: boolean = false
  createdAt: Date = new Date(0)
  updatedAt: Date = new Date(0)
}

export class UserExport {
  id: string = ""
  email: string = ""
  username: string = ""
  avatar: string = ""
}

export class ResetUserPassword {
  email: string = ""
  password: string = ""
  code: string = ""
}

export class UpdateUser {
  username: string | null = null
  avatar: File | null = null
  phoneNumber: string | null = null
}

export class ActivateUser {
  username: string = ""
  avatar: File | null = null
  phoneNumber: string | null = null
  password: string = ""
}

export class UpdateUserPassword {
  oldPassword: string = ""
  newPassword: string = ""
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

export interface UpdateUserResponse {
  error?: unknown;
  data?: {
    updateUser: User
  }
}

export interface UpdateUserPasswordResponse {
  error?: unknown;
  data?: {
    updateAccountPassword: boolean
  }
}


export interface ActivateUserResponse {
  error?: unknown;
  data?: {
    activateUser: User
  }
}

export interface FetchCodeResponse {
  error?: unknown;
  data?: {
    generateResetPasswordCode: boolean
  }
}

export interface ResetUserPasswordResponse {
  error?: unknown;
  data?: {
    resetAccountPassword: boolean
  }
}

export interface RemoveWechatAuthResponse {
  error?: unknown;
  data?: {
    removeWechatAuth: boolean
  }
}

export interface DeleteAccountResponse {
  error?: unknown;
  data?: {
    deleteAccount: boolean
  }
}

export interface UserExportsResponse {
  error?: unknown;
  data?: {
    userExports: UserExport[]
  }
}
