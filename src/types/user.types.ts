export interface UserProfile {
    id: string
    firstName: string
    lastName: string
    email: string
    phoneNumber: string
    role: "teacher" | "parent"
    schoolName?: string
    relationWithChildren?: string
    avatar?: string
    profilePicture?: string
}

export interface UpdateProfilePayload {
    firstName: string
    lastName: string
    email: string
    phoneNumber: string
    schoolName?: string
    relationWithChildren?: string
}

export interface ChangePasswordPayload {
    currentPassword: string
    newPassword: string
    confirmPassword: string
}
