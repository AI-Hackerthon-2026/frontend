import type {
  PortfolioCategory,
  PortfolioDetail,
  PortfolioListItem,
  RankingPeriod,
  TopPortfolio,
  UserLevel,
} from './api'

export const categoryLabels: Record<PortfolioCategory, string> = {
  AUTONOMOUS: '자율',
  GRADUATION: '졸업',
  P_PROJECT: 'P-프로젝트',
}

export const categoryValues: Record<string, PortfolioCategory | undefined> = {
  'P-프로젝트': 'P_PROJECT',
  '자율': 'AUTONOMOUS',
  '자율 프로젝트': 'AUTONOMOUS',
  '졸업': 'GRADUATION',
  '졸업 프로젝트': 'GRADUATION',
}

export const periodValues: Record<string, RankingPeriod> = {
  '이번 학기': 'CURRENT_SEMESTER',
  '저번 학기': 'LAST_SEMESTER',
  '전체': 'ALL_TIME',
}

export const userLevelLabels: Record<UserLevel, string> = {
  ADMIN: 'Admin 관리자',
  PROFESSOR: 'Professor 교수',
  STUDENT: 'Student 학생',
}

export function formatSkills(skills: string[]) {
  return skills.length > 0 ? skills.join(' · ') : '기술 스택 없음'
}

export function formatDateRange(startDate: string, endDate: string) {
  return `${startDate.replaceAll('-', '.')} - ${endDate.replaceAll('-', '.')}`
}

export function splitSummary(summary: string) {
  const maxLength = 28

  if (summary.length <= maxLength) {
    return [summary, ''] as const
  }

  return [summary.slice(0, maxLength), summary.slice(maxLength)] as const
}

export function toSelectedPortfolioHash(id: number) {
  window.sessionStorage.setItem('selectedPortfolioId', String(id))
  window.location.hash = 'portfolio-detail'
}

export function toModifyPortfolioHash(id: number) {
  window.sessionStorage.setItem('selectedPortfolioId', String(id))
  window.location.hash = 'portfolio-modify'
}

export function getSelectedPortfolioId() {
  const storedId = Number(window.sessionStorage.getItem('selectedPortfolioId'))
  return Number.isFinite(storedId) && storedId > 0 ? storedId : 1
}

export function getInitial(name?: string | null) {
  return name?.trim().charAt(0).toUpperCase() || 'U'
}

export function topPortfolioToListItem(portfolio: TopPortfolio): PortfolioListItem {
  return {
    authorName: portfolio.authorName,
    category: 'AUTONOMOUS',
    createdAt: '',
    deploymentLink: null,
    endDate: '',
    githubLink: null,
    id: portfolio.id,
    likeCount: portfolio.likeCount,
    liked: false,
    participantCount: 0,
    projectName: portfolio.projectName,
    skills: portfolio.skills,
    startDate: '',
    summary: portfolio.summary,
    thumbnailUrl: portfolio.thumbnailUrl,
  }
}

export function detailToSaveFields(portfolio: PortfolioDetail) {
  return {
    category: portfolio.category,
    deploymentLink: portfolio.deploymentLink ?? '',
    description: portfolio.description,
    endDate: portfolio.endDate,
    githubLink: portfolio.githubLink ?? '',
    projectName: portfolio.projectName,
    skills: portfolio.skills,
    startDate: portfolio.startDate,
    summary: portfolio.summary,
    thumbnailUrl: portfolio.thumbnailUrl ?? '',
  }
}
