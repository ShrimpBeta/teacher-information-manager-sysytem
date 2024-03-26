export class Password {
  id: string = ""
  url: string = ""
  appName: string = ""
  account: string = ""
  password: string = ""
  description: string = ""
  createdAt: Date = new Date(0)
  updateAt: Date = new Date(0)
}

export class NewPassword {
  url: string | null = null
  appName: string | null = null
  account: string = ""
  password: string = ""
  description: string | null = null
}

export class UpdatePassword {
  url: string | null = null
  appName: string | null = null
  account: string | null = null
  password: string | null = null
  description: string | null = null
}
