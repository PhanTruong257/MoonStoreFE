export interface ApiResponse<T> {
  data: T
  message: string
}

export interface ApiListResponse<T> {
  data: T[]
  message: string
}

export interface PaginatedRequest {
  page?: number
  pageSize?: number
}

export interface ApiError {
  code: string
  message: string
}
