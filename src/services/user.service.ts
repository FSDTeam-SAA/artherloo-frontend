import { axiosInstance } from "@/lib/axios"
import type { ChangePasswordPayload, UpdateProfilePayload } from "@/types/user.types"

export const getProfile = () =>
    axiosInstance.get("/api/v1/user/profile")

export const updateProfile = (data: UpdateProfilePayload) =>
    axiosInstance.put("/api/v1/user/profile", data)

export const changeUserPassword = (data: ChangePasswordPayload) =>
    axiosInstance.post("/api/v1/auth/change-password", data)
