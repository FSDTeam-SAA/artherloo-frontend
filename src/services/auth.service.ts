import { axiosInstance } from "@/lib/axios"
import type {
  ChangePasswordPayload,
  ForgotPasswordPayload,
  LoginPayload,
  RegisterPayload,
  ResetPasswordPayload,
  VerifyOtpPayload,
} from "@/types/auth.types"

export const registerUser = (data: RegisterPayload) =>
  axiosInstance.post("/api/v1/auth/register", data)

export const loginUser = (data: LoginPayload) =>
  axiosInstance.post("/api/v1/auth/login", data)

export const forgotPassword = (data: ForgotPasswordPayload) =>
  axiosInstance.post("/api/v1/auth/forgot-password", data)

export const verifyOtp = (data: VerifyOtpPayload) =>
  axiosInstance.post("/api/v1/auth/verify", data)

export const resetPassword = (data: ResetPasswordPayload) =>
  axiosInstance.post("/api/v1/auth/reset-password", data)

export const changePassword = (data: ChangePasswordPayload) =>
  axiosInstance.post("/api/v1/auth/change-password", data)
