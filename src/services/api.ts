const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

export type UserLevel = 'STUDENT' | 'PROFESSOR' | 'ADMIN'
export type PortfolioCategory = 'GRADUATION' | 'P_PROJECT' | 'AUTONOMOUS'
export type RankingPeriod = 'CURRENT_SEMESTER' | 'LAST_SEMESTER' | 'ALL_TIME'

export interface LoginRequest {
  portalId: string
  password: string
}

export interface AuthUser {
  firstLogin: boolean
  id: number | null
  name: string | null
  studentId: string | null
  userLevel: UserLevel | null
}

export interface RegisterRequest {
  githubLink?: string
  grade: number
  name: string
  studentId: string
  userLevel: UserLevel
}

export interface UserProfile {
  createdAt: string
  githubLink: string | null
  grade: number
  id: number
  name: string
  portalId: string
  studentId: string
  userLevel: UserLevel
}

export interface UpdateProfileRequest {
  githubLink?: string
  grade: number
  name: string
}

export interface PortfolioListItem {
  authorName: string
  category: PortfolioCategory
  createdAt: string
  deploymentLink: string | null
  endDate: string
  githubLink: string | null
  id: number
  likeCount: number
  liked: boolean
  participantCount: number
  projectName: string
  skills: string[]
  startDate: string
  summary: string
  thumbnailUrl: string | null
}

export interface PortfolioPage {
  content: PortfolioListItem[]
  currentPage: number
  size: number
  totalElements: number
  totalPages: number
}

export interface TopPortfolio {
  authorName: string
  id: number
  likeCount: number
  period: RankingPeriod
  periodLabel: string
  projectName: string
  skills: string[]
  summary: string
  thumbnailUrl: string | null
}

export interface PortfolioParticipant {
  name: string
  owner: boolean
  role: string
  userId: number
}

export interface PortfolioDetail extends PortfolioListItem {
  author: {
    id: number
    name: string
    studentId: string
  }
  canEdit: boolean
  description: string
  owner: boolean
  participants: PortfolioParticipant[]
}

export interface PortfolioSaveParticipant {
  role: string
  userId: number
}

export interface PortfolioSaveRequest {
  category: PortfolioCategory
  deploymentLink?: string
  description: string
  endDate: string
  githubLink?: string
  myRole: string
  participants: PortfolioSaveParticipant[]
  projectName: string
  skills: string[]
  startDate: string
  summary: string
  thumbnailUrl?: string
}

export interface UserSearchItem {
  id: number
  name: string
  studentId: string
  userLevel: UserLevel
}

export interface LikeToggleResponse {
  likeCount: number
  liked: boolean
}

export interface ImageUploadResponse {
  imageUrl: string
}

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown
}

async function request<T>(path: string, options: RequestOptions = {}) {
  const { body, headers, ...restOptions } = options
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: 'include',
    headers: {
      ...(body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      ...headers,
    },
    ...restOptions,
    body:
      body instanceof FormData
        ? body
        : body === undefined
          ? undefined
          : JSON.stringify(body),
  })
  const payload = (await response.json().catch(() => null)) as ApiResponse<T> | null

  if (!response.ok || !payload?.success) {
    throw new Error(payload?.message ?? '요청 처리 중 오류가 발생했습니다.')
  }

  return payload.data
}

function buildQuery(params: Record<string, string | number | undefined>) {
  const searchParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      searchParams.set(key, String(value))
    }
  })

  const queryString = searchParams.toString()
  return queryString ? `?${queryString}` : ''
}

export const authApi = {
  login: (body: LoginRequest) =>
    request<AuthUser>('/api/auth/login', { method: 'POST', body }),
  register: (body: RegisterRequest) =>
    request<AuthUser>('/api/auth/register', { method: 'POST', body }),
}

export const userApi = {
  getMe: () => request<UserProfile>('/api/users/me'),
  getMyPortfolios: () => request<PortfolioListItem[]>('/api/users/me/portfolios'),
  search: (keyword: string) =>
    request<UserSearchItem[]>(`/api/users/search${buildQuery({ keyword })}`),
  updateMe: (body: UpdateProfileRequest) =>
    request<UserProfile>('/api/users/me', { method: 'PATCH', body }),
}

export const portfolioApi = {
  create: (body: PortfolioSaveRequest) =>
    request<PortfolioDetail>('/api/portfolios', { method: 'POST', body }),
  delete: (id: number) =>
    request<null>(`/api/portfolios/${id}`, { method: 'DELETE' }),
  getDetail: (id: number) => request<PortfolioDetail>(`/api/portfolios/${id}`),
  getList: (params: {
    category?: PortfolioCategory
    page?: number
    size?: number
    sort?: 'LATEST' | 'LIKES'
  }) => request<PortfolioPage>(`/api/portfolios${buildQuery(params)}`),
  getPopular: () => request<PortfolioListItem[]>('/api/portfolios/popular'),
  getRanking: (period: RankingPeriod) =>
    request<PortfolioListItem[]>(
      `/api/portfolios/ranking${buildQuery({ period })}`,
    ),
  getTop: () => request<TopPortfolio[]>('/api/portfolios/top'),
  toggleLike: (id: number) =>
    request<LikeToggleResponse>(`/api/portfolios/${id}/likes`, {
      method: 'POST',
    }),
  update: (id: number, body: PortfolioSaveRequest) =>
    request<PortfolioDetail>(`/api/portfolios/${id}`, { method: 'PUT', body }),
}

export const imageApi = {
  upload: (file: File) => {
    const formData = new FormData()
    const extension = file.name.split('.').pop()?.toLowerCase() || 'png'
    const safeFile = new File([file], `portfolio-${Date.now()}.${extension}`, {
      type: file.type,
    })
    formData.set('file', safeFile)

    return request<ImageUploadResponse>('/api/images/upload', {
      method: 'POST',
      body: formData,
    })
  },
}
