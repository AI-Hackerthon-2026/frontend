import { useEffect, useMemo, useState } from 'react'
import DashboardHeader from '../../../widgets/header/DashboardHeader'

const imgHeaderLogoMark =
  'https://www.figma.com/api/mcp/asset/52832cb4-be6d-4a34-b6ee-515f55db23b3'

const categories = ['전체', '졸업', 'P-프로젝트', '자율'] as const
const pageSize = 5

type Category = (typeof categories)[number]

interface Portfolio {
  category: Exclude<Category, '전체'>
  deploymentUrl: string
  duration: string
  githubUrl: string
  id: number
  likes: number
  participants: string
  stack: string[]
  summary: string
  title: string
}

const portfolios: Portfolio[] = [
  {
    category: '졸업',
    deploymentUrl: 'https://review-helper.vercel.app',
    duration: '2026.03 - 2026.06',
    githubUrl: 'https://github.com/team/review-helper',
    id: 1,
    likes: 42,
    participants: '참여 인원 4명',
    stack: ['React', 'Spring', 'GPT API'],
    summary: 'GitHub PR을 분석하고 리뷰 코멘트를 생성하는 학과 프로젝트입니다.',
    title: 'AI 코드 리뷰 도우미',
  },
  {
    category: 'P-프로젝트',
    deploymentUrl: 'https://study-match.vercel.app',
    duration: '2026.03 - 2026.05',
    githubUrl: 'https://github.com/team/study-match',
    id: 2,
    likes: 35,
    participants: '참여 인원 3명',
    stack: ['Next.js', 'Prisma'],
    summary: '관심 분야와 시간표 기반으로 스터디 팀을 연결합니다.',
    title: '캠퍼스 스터디 매칭',
  },
  {
    category: '자율',
    deploymentUrl: 'https://algorun.vercel.app',
    duration: '2026.04 - 2026.06',
    githubUrl: 'https://github.com/team/algorun',
    id: 3,
    likes: 28,
    participants: '참여 인원 4명',
    stack: ['Vue', 'Node.js'],
    summary: '문제 풀이 기록과 랭킹으로 학습 동기를 만드는 서비스입니다.',
    title: '알고리즘 배틀 플랫폼',
  },
  {
    category: 'P-프로젝트',
    deploymentUrl: 'https://club-check.app',
    duration: '2026.03 - 2026.04',
    githubUrl: 'https://github.com/team/club-check',
    id: 4,
    likes: 19,
    participants: '참여 인원 2명',
    stack: ['Flutter', 'Firebase'],
    summary: '동아리 활동 출석과 공지 확인을 모바일로 관리합니다.',
    title: '동아리 출석 관리',
  },
  {
    category: '자율',
    deploymentUrl: 'https://kernel-log.vercel.app',
    duration: '2026.03 - 2026.06',
    githubUrl: 'https://github.com/team/kernel-log',
    id: 5,
    likes: 17,
    participants: '참여 인원 3명',
    stack: ['C', 'Linux'],
    summary: '주차별 학습 기록과 발표 자료를 공유하는 포트폴리오입니다.',
    title: '운영체제 스터디 로그',
  },
  {
    category: '졸업',
    deploymentUrl: 'https://mealping.vercel.app',
    duration: '2026.02 - 2026.06',
    githubUrl: 'https://github.com/team/mealping',
    id: 6,
    likes: 15,
    participants: '참여 인원 2명',
    stack: ['Python', 'Discord'],
    summary: '학식 메뉴와 알림을 자동으로 전달하는 챗봇 프로젝트입니다.',
    title: '학식 알림 봇',
  },
  {
    category: '자율',
    deploymentUrl: 'https://roomie.vercel.app',
    duration: '2026.05 - 2026.06',
    githubUrl: 'https://github.com/team/roomie',
    id: 7,
    likes: 11,
    participants: '참여 인원 2명',
    stack: ['Next.js', 'Supabase'],
    summary: '빈 강의실 검색과 예약 흐름을 단순화하는 웹 서비스입니다.',
    title: '강의실 예약 도우미',
  },
]

function PortfolioBoardPage() {
  const [activeCategory, setActiveCategory] = useState<Category>('전체')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedId, setSelectedId] = useState(portfolios[0].id)

  const filteredPortfolios = useMemo(() => {
    if (activeCategory === '전체') {
      return portfolios
    }

    return portfolios.filter((portfolio) => portfolio.category === activeCategory)
  }, [activeCategory])

  const pageCount = Math.max(1, Math.ceil(filteredPortfolios.length / pageSize))
  const paginatedPortfolios = filteredPortfolios.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  )
  const selectedPortfolio =
    filteredPortfolios.find((portfolio) => portfolio.id === selectedId) ??
    filteredPortfolios[0]

  useEffect(() => {
    setCurrentPage(1)
    setSelectedId(filteredPortfolios[0]?.id ?? 0)
  }, [filteredPortfolios])

  const handleCategoryClick = (category: Category) => {
    setActiveCategory(category)
  }

  const handlePageClick = (page: number) => {
    setCurrentPage(page)
    setSelectedId(
      filteredPortfolios[(page - 1) * pageSize]?.id ?? filteredPortfolios[0]?.id ?? 0,
    )
  }

  return (
    <main className="min-h-screen overflow-auto bg-[#f3f7fc]">
      <section
        className="relative mx-auto h-[892px] w-[1280px] overflow-hidden rounded-[18px] border border-[#d1d8e3] bg-[#f3f7fc]"
        data-name="04 Portfolio Board Management"
        data-node-id="1:132"
      >
        <DashboardHeader active="portfolio" logo={imgHeaderLogoMark} />

        <div className="absolute left-[47px] top-[103px]">
          <h1 className="text-[28px] font-bold leading-[41px] text-[#121a34]">
            포트폴리오 게시판
          </h1>
          <p className="mt-[1px] text-[14px] leading-[20px] text-[#5c6a84]">
            카테고리와 기술 스택으로 포트폴리오를 탐색하고 공감할 수 있습니다.
          </p>
        </div>

        <div className="absolute left-[47px] top-[177px] flex h-[64px] w-[1184px] items-center rounded-[12px] border border-[#c9d5e7] bg-white px-[24px]">
          <div className="flex gap-[12px]">
            {categories.map((category) => {
              const isActive = activeCategory === category

              return (
                <button
                  aria-pressed={isActive}
                  className={[
                    'h-[28px] rounded-[14px] px-[14px] text-[12px] font-semibold transition',
                    isActive
                      ? 'border border-[#2e569d] bg-[#2e569d] text-white'
                      : 'border border-[#c9d5e7] bg-[#e7f0fa] text-[#2e569d] hover:bg-[#dceafa]',
                  ].join(' ')}
                  key={category}
                  onClick={() => handleCategoryClick(category)}
                  type="button"
                >
                  {category}
                </button>
              )
            })}
          </div>
          <a
            className="ml-auto flex h-[40px] w-[146px] items-center justify-center rounded-[8px] bg-[#e2842a] text-[13px] font-semibold text-white"
            href="#portfolio-create"
          >
            포트폴리오 작성
          </a>
        </div>

        <section className="absolute left-[47px] top-[273px] h-[438px] w-[728px] overflow-hidden rounded-[12px] border border-[#c9d9ee] bg-white shadow-[0px_12px_24px_-10px_rgba(46,86,157,0.08)]">
          <div className="grid h-[48px] grid-cols-[72px_300px_110px_130px_80px] items-center bg-[#f3f7fc] px-[24px] text-[12px] font-semibold text-[#2e569d]">
            <span />
            <span>프로젝트</span>
            <span className="text-center">카테고리</span>
            <span className="text-center">기술 스택</span>
            <span className="text-center">공감</span>
          </div>

          {paginatedPortfolios.map((portfolio) => {
            const isSelected = selectedPortfolio?.id === portfolio.id

            return (
              <button
                className={[
                  'grid h-[76px] w-full grid-cols-[72px_300px_110px_130px_80px] items-center border-t border-[#dde7f3] px-[24px] text-left transition',
                  isSelected
                    ? 'border-2 border-[#5f99f5] bg-[#f7fbff] shadow-[0px_8px_18px_-10px_rgba(46,86,157,0.12)]'
                    : 'bg-white hover:bg-[#f8fbff]',
                ].join(' ')}
                key={portfolio.id}
                onClick={() => setSelectedId(portfolio.id)}
                onDoubleClick={() => {
                  window.location.hash = 'portfolio-detail'
                }}
                type="button"
              >
                <div className="flex h-[48px] w-[56px] items-center justify-center rounded-[8px] border border-[#d4e1f2] bg-[#e9eff8] text-[10px] font-semibold text-[#61708a]">
                  IMG
                </div>
                <div className="min-w-0">
                  <h3 className="truncate text-[15px] font-semibold text-[#102047]">
                    {portfolio.title}
                  </h3>
                  <p className="mt-[6px] truncate text-[12px] text-[#61708a]">
                    {portfolio.summary}
                  </p>
                </div>
                <span className="mx-auto flex h-[28px] min-w-[74px] items-center justify-center rounded-[14px] border border-[#d4e1f2] bg-[#f3f7fc] px-[12px] text-[11px] font-semibold text-[#2e569d]">
                  {portfolio.category}
                </span>
                <span className="truncate text-center text-[12px] text-[#304f9a]">
                  {portfolio.stack.join(' · ')}
                </span>
                <span className="text-center text-[13px] font-semibold text-[#b83a3a]">
                  ♥ {portfolio.likes}
                </span>
              </button>
            )
          })}

          {paginatedPortfolios.length === 0 && (
            <div className="flex h-[380px] items-center justify-center text-[13px] text-[#61708a]">
              해당 카테고리의 포트폴리오가 없습니다.
            </div>
          )}
        </section>

        <div className="absolute left-[47px] top-[751px] flex h-[48px] w-[728px] items-center justify-center gap-[12px] rounded-[12px] border border-[#c9d9ee] bg-white">
          <button
            className="h-[32px] w-[36px] rounded-[8px] border border-[#d4e1f2] bg-white text-[18px] font-semibold text-[#2e569d] disabled:opacity-40"
            disabled={currentPage === 1}
            onClick={() => handlePageClick(Math.max(1, currentPage - 1))}
            type="button"
          >
            ‹
          </button>
          {Array.from({ length: pageCount }, (_, index) => index + 1).map((page) => (
            <button
              className={[
                'h-[32px] w-[36px] rounded-[8px] text-[12px] font-semibold',
                currentPage === page
                  ? 'border border-[#2e569d] bg-[#2e569d] text-white'
                  : 'border border-[#d4e1f2] bg-white text-[#2e569d]',
              ].join(' ')}
              key={page}
              onClick={() => handlePageClick(page)}
              type="button"
            >
              {page}
            </button>
          ))}
          <button
            className="h-[32px] w-[36px] rounded-[8px] border border-[#d4e1f2] bg-white text-[18px] font-semibold text-[#2e569d] disabled:opacity-40"
            disabled={currentPage === pageCount}
            onClick={() => handlePageClick(Math.min(pageCount, currentPage + 1))}
            type="button"
          >
            ›
          </button>
        </div>

        {selectedPortfolio && (
          <aside className="absolute left-[799px] top-[273px] h-[526px] w-[432px] rounded-[12px] border border-[#c9d5e7] bg-white p-[24px]">
            <div className="flex h-[150px] items-center justify-center rounded-[10px] bg-[#e7f0fa] text-[13px] font-medium text-[#121a34]">
              대표 이미지
            </div>
            <div className="mt-[26px] flex items-start justify-between">
              <h2 className="text-[22px] font-semibold leading-[32px] text-[#121a34]">
                {selectedPortfolio.title}
              </h2>
              <span className="text-[16px] font-semibold text-[#c7252e]">
                ♥ {selectedPortfolio.likes}
              </span>
            </div>
            <p className="mt-[10px] w-[340px] text-[13px] leading-[19px] text-[#5c6a84]">
              {selectedPortfolio.summary}
            </p>
            <p className="mt-[18px] text-[12px] text-[#5c6a84]">
              {selectedPortfolio.participants}
            </p>
            <div className="mt-[24px] flex flex-wrap gap-[10px]">
              {selectedPortfolio.stack.map((tag) => (
                <span
                  className="flex h-[28px] items-center rounded-[14px] border border-[#c9d5e7] bg-[#e7f0fa] px-[17px] text-[12px] font-medium text-[#2e569d]"
                  key={tag}
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="mt-[40px] flex gap-[24px]">
              <button className="h-[40px] w-[180px] rounded-[8px] border border-[#c9d5e7] bg-white text-[13px] font-semibold text-[#2e569d]">
                GitHub
              </button>
              <button className="h-[40px] w-[180px] rounded-[8px] border border-[#c9d5e7] bg-white text-[13px] font-semibold text-[#2e569d]">
                배포 링크
              </button>
            </div>
            <p className="mt-[28px] text-[13px] text-[#61708a]">
              개발 기간 {selectedPortfolio.duration}
            </p>
          </aside>
        )}
      </section>
    </main>
  )
}

export default PortfolioBoardPage
