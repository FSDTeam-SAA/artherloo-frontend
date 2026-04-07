import axios from "axios"

export function getApiErrorMessage(error: unknown, fallback = "Something went wrong") {
  if (axios.isAxiosError(error)) {
    return (
      (error.response?.data as { message?: string } | undefined)?.message ??
      fallback
    )
  }

  if (error instanceof Error) {
    return error.message
  }

  return fallback
}
