import { useEffect, useMemo, useState } from 'react'
import { portfolioApi, type PortfolioListItem } from '../../../services/api'
import {
  categoryLabels,
  categoryValues,
  formatDateRange,
  formatSkills,
  toSelectedPortfolioHash,
} from '../../../services/portfolioMapper'
import DashboardHeader from '../../../widgets/header/DashboardHeader'

const imgHeaderLogoMark =
  'https://www.figma.com/api/mcp/asset/52832cb4-be6d-4a34-b6ee-515f55db23b3'

const categories = ['전체', '졸업', 'P-프로젝트', '자율'] as const
const pageSize = 5
const searchFetchSize = 1000

type Category = (typeof categories)[number]

interface SearchablePortfolio extends PortfolioListItem {
  participantNames: string[]
}

function PortfolioBoardPage() {
  const [activeCategory, setActiveCategory] = useState<Category>('전체')
  const [currentPage, setCurrentPage] = useState(1)
  const [errorMessage, setErrorMessage] = useState('')
  const [portfolios, setPortfolios] = useState<SearchablePortfolio[]>([])
  const [searchKeyword, setSearchKeyword] = useState('')
  const [selectedId, setSelectedId] = useState(0)
  const filteredPortfolios = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase()

    if (!keyword) {
      return portfolios
    }

    return portfolios.filter((portfolio) => {
      const projectName = portfolio.projectName.toLowerCase()
      const authorName = portfolio.authorName.toLowerCase()
      const participantNames = portfolio.participantNames
        .join(' ')
        .toLowerCase()

      return (
        projectName.includes(keyword) ||
        authorName.includes(keyword) ||
        participantNames.includes(keyword)
      )
    })
  }, [portfolios, searchKeyword])
  const pageCount = Math.max(1, Math.ceil(filteredPortfolios.length / pageSize))
  const paginatedPortfolios = filteredPortfolios.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  )
  const selectedPortfolio =
    paginatedPortfolios.find((portfolio) => portfolio.id === selectedId) ??
    paginatedPortfolios[0] ??
    filteredPortfolios[0]

  useEffect(() => {
    const loadPortfolios = async () => {
      setErrorMessage('')

      try {
        const data = await portfolioApi.getList({
          category: categoryValues[activeCategory],
          page: 0,
          size: searchFetchSize,
          sort: 'LATEST',
        })

        const searchablePortfolios = await Promise.all(
          data.content.map(async (portfolio) => {
            try {
              const detail = await portfolioApi.getDetail(portfolio.id)

              return {
                ...portfolio,
                participantNames: detail.participants.map(
                  (participant) => participant.name,
                ),
              }
            } catch {
              return {
                ...portfolio,
                participantNames: [],
              }
            }
          }),
        )

        setPortfolios(searchablePortfolios)
        setSelectedId(searchablePortfolios[0]?.id ?? 0)
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : '포트폴리오 목록을 불러오지 못했습니다.',
        )
        setPortfolios([])
        setSelectedId(0)
      }
    }

    loadPortfolios()
  }, [activeCategory])

  const handleCategoryClick = (category: Category) => {
    setActiveCategory(category)
    setCurrentPage(1)
    setSelectedId(0)
  }

  const handlePageClick = (page: number) => {
    setCurrentPage(page)
  }

  const handleSearchChange = (value: string) => {
    setSearchKeyword(value)
    setCurrentPage(1)
    setSelectedId(0)
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
          <label className="ml-[28px] flex h-[40px] w-[360px] items-center rounded-[8px] border border-[#c9d5e7] bg-[#f9fbfd] px-[14px]">
            <span className="mr-[10px] text-[13px] font-semibold text-[#2e569d]">
              검색
            </span>
            <input
              className="h-full flex-1 bg-transparent text-[13px] text-[#5c6a84] outline-none placeholder:text-[#9ca8ba]"
              onChange={(event) => handleSearchChange(event.target.value)}
              placeholder="프로젝트명 또는 작성자명"
              type="search"
              value={searchKeyword}
            />
          </label>
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
                  toSelectedPortfolioHash(portfolio.id)
                }}
                type="button"
              >
                <div className="flex h-[48px] w-[56px] items-center justify-center rounded-[8px] border border-[#d4e1f2] bg-[#e9eff8] text-[10px] font-semibold text-[#61708a]">
                  IMG
                </div>
                <div className="min-w-0">
                  <h3 className="truncate text-[15px] font-semibold text-[#102047]">
                    {portfolio.projectName}
                  </h3>
                  <p className="mt-[6px] truncate text-[12px] text-[#61708a]">
                    {portfolio.summary}
                  </p>
                </div>
                <span className="mx-auto flex h-[28px] min-w-[74px] items-center justify-center rounded-[14px] border border-[#d4e1f2] bg-[#f3f7fc] px-[12px] text-[11px] font-semibold text-[#2e569d]">
                  {categoryLabels[portfolio.category]}
                </span>
                <span className="truncate text-center text-[12px] text-[#304f9a]">
                  {formatSkills(portfolio.skills)}
                </span>
                <span className="text-center text-[13px] font-semibold text-[#b83a3a]">
                  ♥ {portfolio.likeCount}
                </span>
              </button>
            )
          })}

          {paginatedPortfolios.length === 0 && (
            <div className="flex h-[380px] items-center justify-center text-[13px] text-[#61708a]">
              {errorMessage ||
                (searchKeyword
                  ? '검색 결과가 없습니다.'
                  : '해당 카테고리의 포트폴리오가 없습니다.')}
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
                {selectedPortfolio.projectName}
              </h2>
              <span className="text-[16px] font-semibold text-[#c7252e]">
                ♥ {selectedPortfolio.likeCount}
              </span>
            </div>
            <p className="mt-[10px] w-[340px] text-[13px] leading-[19px] text-[#5c6a84]">
              {selectedPortfolio.summary}
            </p>
            <p className="mt-[18px] text-[12px] text-[#5c6a84]">
              참여 인원 {selectedPortfolio.participantCount}명
            </p>
            <div className="mt-[24px] flex flex-wrap gap-[10px]">
              {selectedPortfolio.skills.map((tag) => (
                <span
                  className="flex h-[28px] items-center rounded-[14px] border border-[#c9d5e7] bg-[#e7f0fa] px-[17px] text-[12px] font-medium text-[#2e569d]"
                  key={tag}
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="mt-[40px] flex gap-[24px]">
              <a
                className="flex h-[40px] w-[180px] items-center justify-center rounded-[8px] border border-[#c9d5e7] bg-white text-[13px] font-semibold text-[#2e569d]"
                href={selectedPortfolio.githubLink ?? '#portfolio'}
                rel="noreferrer"
                target={selectedPortfolio.githubLink ? '_blank' : undefined}
              >
                GitHub
              </a>
              <a
                className="flex h-[40px] w-[180px] items-center justify-center rounded-[8px] border border-[#c9d5e7] bg-white text-[13px] font-semibold text-[#2e569d]"
                href={selectedPortfolio.deploymentLink ?? '#portfolio'}
                rel="noreferrer"
                target={selectedPortfolio.deploymentLink ? '_blank' : undefined}
              >
                배포 링크
              </a>
            </div>
            <p className="mt-[28px] text-[13px] text-[#61708a]">
              개발 기간 {formatDateRange(selectedPortfolio.startDate, selectedPortfolio.endDate)}
            </p>
          </aside>
        )}
      </section>
    </main>
  )
}

export default PortfolioBoardPage
