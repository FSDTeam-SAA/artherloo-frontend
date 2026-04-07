export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  password: string
  role: "teacher" | "parent"
  schoolName?: string
  relationWithChildren?: string
}

export interface ForgotPasswordPayload {
  email: string
}

export interface VerifyOtpPayload {
  email: string
  otp: string
}

export interface ResetPasswordPayload {
  email: string
  newPassword: string
  confirmPassword: string
}

export interface ChangePasswordPayload {
  currentPassword?: string
  newPassword: string
  confirmPassword: string
}

export interface AuthUser {
  id: string
  name: string
  email: string
  role: string
  accessToken: string
}

export interface AuthApiResponse {
  success?: boolean
  message?: string
  data?: AuthUser
}
