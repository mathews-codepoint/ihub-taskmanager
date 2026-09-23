import axios from 'axios'

export interface ApiError {
  status: number | undefined
  message: string
  code: string | undefined
  fieldErrors: Record<string, string[]> | undefined
}

interface ApiErrorBody {
  message?: string
  code?: string
  errors?: Record<string, string[]>
}

/** Normalizes any caught request failure into a stable shape. Per
 * migration-plan/App-structure.md §6: call this before displaying or
 * logging a request failure — never inspect raw Axios/Error shapes at the
 * call site. */
export function getApiError(error: unknown): ApiError {
  if (axios.isAxiosError<ApiErrorBody>(error)) {
    const body = error.response?.data
    return {
      status: error.response?.status,
      message: body?.message ?? error.message ?? 'Request failed',
      code: body?.code,
      fieldErrors: body?.errors,
    }
  }

  if (error instanceof Error) {
    return { status: undefined, message: error.message, code: undefined, fieldErrors: undefined }
  }

  return { status: undefined, message: 'Unknown error', code: undefined, fieldErrors: undefined }
}
