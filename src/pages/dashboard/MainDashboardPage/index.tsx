import { useCallback, useEffect, useState } from 'react'
import {
  portfolioApi,
  type PortfolioListItem,
  type RankingPeriod,
} from '../../../services/api'
import {
  formatSkills,
  rankPortfolios,
  splitSummary,
  toSelectedPortfolioHash,
} from '../../../services/portfolioMapper'
import DashboardHeader from '../../../widgets/header/DashboardHeader'

const imgHeaderLogoMark =
  'https://www.figma.com/api/mcp/asset/32ce995a-f29b-4ccb-b7d3-03a243641f94'

const termOrder = ['ALL_TIME', 'CURRENT_SEMESTER', 'LAST_SEMESTER'] as const
const termLabels = {
  ALL_TIME: '전체',
  CURRENT_SEMESTER: '이번 학기',
  LAST_SEMESTER: '저번 학기',
}
const slideRankStyles = {
  1: {
    accent: 'bg-[#ffc32f]',
    badge: 'bg-[#ffc32f] text-[#121a34]',
    like: 'bg-[#2e569d]',
  },
  2: {
    accent: 'bg-[#c7d6eb]',
    badge: 'bg-[#edf4fd] text-[#2e569d]',
    like: 'bg-[#40589e]',
  },
  3: {
    accent: 'bg-[#e2842a]',
    badge: 'bg-[#fff1e3] text-[#b96624]',
    like: 'bg-[#b96624]',
  },
} as const

interface DashboardSlide extends PortfolioListItem {
  period: RankingPeriod
  periodLabel: string
  rank: number
  rankLabel: string
}

function MainDashboardPage() {
  const [errorMessage, setErrorMessage] = useState('')
  const [popularPortfolios, setPopularPortfolios] = useState<PortfolioListItem[]>([])
  const [recentPortfolios, setRecentPortfolios] = useState<PortfolioListItem[]>([])
  const [slideIndex, setSlideIndex] = useState(0)
  const [slides, setSlides] = useState<DashboardSlide[]>([])
  const [term, setTerm] = useState<(typeof termOrder)[number]>('ALL_TIME')

  const currentSlide = slides[slideIndex]
  const currentSlideStyle =
    slideRankStyles[(currentSlide?.rank ?? 1) as keyof typeof slideRankStyles] ??
    slideRankStyles[1]
  const [slideDescription, slideDescription2] = splitSummary(
    currentSlide?.summary ?? '등록된 1위 포트폴리오가 없습니다.',
  )

  const handlePrevSlide = () => {
    if (slides.length === 0) {
      return
    }

    const newIndex = slideIndex === 0 ? slides.length - 1 : slideIndex - 1
    setSlideIndex(newIndex)
    updateTermBySlideIndex(newIndex)
  }

  const handleNextSlide = () => {
    if (slides.length === 0) {
      return
    }

    const newIndex = slideIndex === slides.length - 1 ? 0 : slideIndex + 1
    setSlideIndex(newIndex)
    updateTermBySlideIndex(newIndex)
  }

  const updateTermBySlideIndex = useCallback((index: number) => {
    const nextPeriod = slides[index]?.period

    if (nextPeriod) {
      setTerm(nextPeriod)
    }
  }, [slides])

  useEffect(() => {
    if (slides.length <= 1) {
      return undefined
    }

    const slideTimer = window.setInterval(() => {
      setSlideIndex((prevIndex) => {
        const newIndex = prevIndex === slides.length - 1 ? 0 : prevIndex + 1
        updateTermBySlideIndex(newIndex)
        return newIndex
      })
    }, 4000)

    return () => {
      window.clearInterval(slideTimer)
    }
  }, [slides.length, updateTermBySlideIndex])

  useEffect(() => {
    const loadDashboard = async () => {
      setErrorMessage('')

      try {
        const [topData, popularData, recentData] = await Promise.all([
          Promise.all(
            termOrder.map(async (period) => {
              const rankings = await portfolioApi.getRanking(period)

              return rankPortfolios(rankings)
                .slice(0, 3)
                .map(({ portfolio, rank, rankLabel }) => ({
                  ...portfolio,
                  period,
                  periodLabel: termLabels[period],
                  rank,
                  rankLabel,
                }))
            }),
          ),
          portfolioApi.getPopular(),
          portfolioApi.getList({ page: 0, size: 6, sort: 'LATEST' }),
        ])
        const orderedSlides = topData.flat()

        setSlides(orderedSlides)
        setPopularPortfolios(popularData)
        setRecentPortfolios(recentData.content)
        setSlideIndex(0)
        setTerm(orderedSlides[0]?.period ?? 'ALL_TIME')
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : '포트폴리오 데이터를 불러오지 못했습니다.',
        )
      }
    }

    loadDashboard()
  }, [])

  const handleTermChange = (newTerm: (typeof termOrder)[number]) => {
    const newIndex = slides.findIndex((slide) => slide.period === newTerm)

    if (newIndex >= 0) {
      setTerm(newTerm)
      setSlideIndex(newIndex)
    }
  }
  return (
    <main className="min-h-screen overflow-auto bg-[#f3f7fc]">
      <section
        className="relative mx-auto h-[1214px] w-[1280px] overflow-hidden rounded-[18px] border border-[#d1d8e3] bg-[#f3f7fc]"
        data-name="03 Main Dashboard"
        data-node-id="1:2"
      >
        <DashboardHeader active="main" logo={imgHeaderLogoMark} />

        <div className="absolute left-[47px] top-[103px]">
          <h1 className="text-[28px] font-bold leading-[41px] text-[#121a34]">
            프로젝트를 공유하고, 완성작으로 인정받으세요
          </h1>
          <p className="mt-[1px] text-[14px] leading-[20px] text-[#5c6a84]">
            학과생들의 포트폴리오와 인기도를 한 곳에서 확인하세요.
          </p>
        </div>

        <section className="absolute left-[48px] top-[182px] h-[464px] w-[1184px] overflow-hidden rounded-[16px] border-2 border-[rgba(98,183,230,0.72)] bg-gradient-to-r from-[#121b42] via-[#253e86] via-[45%] to-[#2e569d] shadow-[0px_18px_30px_-18px_rgba(13,20,51,0.22)]">
          <div className="absolute left-[602px] top-[31px] h-[260px] w-[460px] rounded-full bg-[rgba(128,246,255,0.13)]" />
          <div className="absolute left-[332px] top-[92px] h-[220px] w-[360px] rounded-full bg-[rgba(255,195,47,0.12)]" />

          <div className="absolute left-[36px] top-[31px] flex gap-[12px]">
            <button
              onClick={() => handleTermChange('ALL_TIME')}
              className={[
                'px-[16px] py-[6px] rounded-[6px] text-[12px] font-semibold transition-all',
                term === 'ALL_TIME'
                  ? 'bg-white text-[#253e86]'
                  : 'bg-[rgba(255,255,255,0.2)] text-white hover:bg-[rgba(255,255,255,0.3)]',
              ].join(' ')}
            >
              전체
            </button>
            <button
              onClick={() => handleTermChange('CURRENT_SEMESTER')}
              className={[
                'px-[16px] py-[6px] rounded-[6px] text-[12px] font-semibold transition-all',
                term === 'CURRENT_SEMESTER'
                  ? 'bg-white text-[#253e86]'
                  : 'bg-[rgba(255,255,255,0.2)] text-white hover:bg-[rgba(255,255,255,0.3)]',
              ].join(' ')}
            >
              이번학기
            </button>
            <button
              onClick={() => handleTermChange('LAST_SEMESTER')}
              className={[
                'px-[16px] py-[6px] rounded-[6px] text-[12px] font-semibold transition-all',
                term === 'LAST_SEMESTER'
                  ? 'bg-white text-[#253e86]'
                  : 'bg-[rgba(255,255,255,0.2)] text-white hover:bg-[rgba(255,255,255,0.3)]',
              ].join(' ')}
            >
              저번학기
            </button>
          </div>

          <p className="absolute left-[36px] top-[112px] text-[22px] font-bold leading-[34px] text-[#62b7e6]">
            {currentSlide
              ? `${currentSlide.periodLabel} ${currentSlide.rankLabel} 포트폴리오`
              : `${termLabels[term]} 포트폴리오`}
          </p>
          <h2
            className="absolute left-[36px] top-[164px] text-[54px] font-bold leading-[74px] text-white animate-dashboard-slide"
            key={`title-${currentSlide?.id ?? 'empty'}-${slideIndex}`}
          >
            {currentSlide?.projectName ?? '포트폴리오 준비 중'}
          </h2>
          <div
            className={[
              'absolute left-[40px] top-[238px] h-[8px] w-[348px] rounded-[4px]',
              currentSlideStyle.accent,
            ].join(' ')}
          />
          <p
            className="absolute left-[40px] top-[270px] w-[560px] text-[18px] font-medium leading-[32px] text-white animate-dashboard-slide"
            key={`summary-${currentSlide?.id ?? 'empty'}-${slideIndex}`}
          >
            {slideDescription}
            <br />
            {slideDescription2}
          </p>
          <button
            className="absolute left-[40px] top-[370px] flex h-[42px] w-[172px] items-center justify-center rounded-[9px] bg-[#e2842a] text-[13px] font-semibold text-white"
            onClick={() => currentSlide && toSelectedPortfolioHash(currentSlide.id)}
            type="button"
          >
            포트폴리오 상세 보기
          </button>

          <div
            className="absolute left-[655px] top-[58px] h-[318px] w-[360px] rounded-[22px] bg-[rgba(255,255,255,0.96)] shadow-[0px_24px_36px_-18px_rgba(5,10,31,0.3)] animate-dashboard-slide"
            key={`card-${currentSlide?.id ?? 'empty'}-${slideIndex}`}
          >
            <div className="absolute left-[28px] top-[28px] flex h-[138px] w-[304px] items-center justify-center rounded-[16px] border border-[#c9d5e7] bg-[#e7f0fa] text-[15px] font-bold text-[#2e569d]">
              PROJECT PREVIEW
            </div>
            <div
              className={[
                'absolute -left-[8px] -top-[8px] flex size-[58px] items-center justify-center rounded-full border border-white text-[13px] font-bold',
                currentSlideStyle.badge,
              ].join(' ')}
            >
              {currentSlide?.rankLabel ?? 'TOP'}
            </div>
            <p className="absolute left-[28px] top-[204px] text-[20px] font-bold leading-[28px] text-[#121a34]">
              {currentSlide?.projectName ?? '데이터 없음'}
            </p>
            <p className="absolute left-[28px] top-[238px] text-[13px] font-medium text-[#5c6a84]">
              {currentSlide
                ? `${currentSlide.authorName} · ${formatSkills(currentSlide.skills)}`
                : 'API 데이터를 기다리는 중입니다.'}
            </p>
            <div
              className={[
                'absolute left-[28px] top-[269px] flex h-[34px] w-[92px] items-center justify-center rounded-[17px] text-[14px] font-bold text-white',
                currentSlideStyle.like,
              ].join(' ')}
            >
              ♥ {currentSlide?.likeCount ?? 0}
            </div>
          </div>

          <div className="absolute left-[1048px] top-[325px] overflow-hidden rounded-[12px] bg-[rgba(255,255,255,0.94)]">
            <div className="h-[54px] w-[112px] text-center text-[13px] font-bold leading-[54px] text-[#2e569d]">
              {slides.length > 0 ? slideIndex + 1 : 0} / {slides.length}
            </div>
            <div className="flex">
              <button
                onClick={handlePrevSlide}
                className="h-[42px] w-[56px] bg-[#253e86] text-white flex items-center justify-center hover:bg-[#1a2a5a] transition-colors leading-none"
              >
                <span className="text-[28px] font-bold">‹</span>
              </button>
              <button
                onClick={handleNextSlide}
                className="h-[42px] w-[56px] bg-[#253e86] text-white flex items-center justify-center hover:bg-[#1a2a5a] transition-colors leading-none"
              >
                <span className="text-[28px] font-bold">›</span>
              </button>
            </div>
          </div>
          <div className="absolute left-[40px] top-[340px] h-[5px] w-[420px] rounded-[3px] bg-[rgba(255,255,255,0.24)]">
            <div
              className="h-[5px] rounded-[3px] bg-[#62b7e6] transition-all"
              style={{
                width:
                  slides.length > 0
                    ? `${((slideIndex + 1) / slides.length) * 100}%`
                    : '0%',
              }}
            />
          </div>
        </section>

        {errorMessage && (
          <p className="absolute left-[48px] top-[655px] text-[12px] font-semibold text-[#c7252e]">
            {errorMessage}
          </p>
        )}

        <SectionTitle top={691}>인기 포트폴리오</SectionTitle>
        <div className="absolute left-[47px] top-[729px] flex gap-[24px]">
          {popularPortfolios.map((portfolio) => (
            <article
              className="h-[238px] w-[352px] rounded-[12px] border border-[#c9d5e7] bg-white p-[16px]"
              key={portfolio.id}
              onClick={() => toSelectedPortfolioHash(portfolio.id)}
            >
              <div className="flex h-[108px] items-center justify-center rounded-[10px] bg-[#e7f0fa] text-[13px] font-medium text-[#5c6a84]">
                프로젝트 썸네일
              </div>
              <h3 className="mt-[15px] text-[17px] font-semibold text-[#121a34]">
                {portfolio.projectName}
              </h3>
              <p className="mt-[8px] text-[12px] leading-[17px] text-[#5c6a84]">
                {portfolio.summary}
              </p>
              <div className="mt-[12px] flex justify-between text-[12px] font-medium text-[#2e569d]">
                <span>{formatSkills(portfolio.skills)}</span>
                <span className="text-[13px] font-semibold text-[#c7252e]">
                  ♥ {portfolio.likeCount}
                </span>
              </div>
            </article>
          ))}
        </div>

        <SectionTitle top={1006}>최근 등록 포트폴리오</SectionTitle>
        <a
          className="absolute left-[1101px] top-[1001px] h-[36px] w-[164px] rounded-[8px] border border-[#2e569d] bg-white text-center text-[13px] font-semibold leading-[36px] text-[#2e569d]"
          href="#portfolio"
        >
          포트폴리오 모두보기 →
        </a>
        <div className="absolute left-[47px] top-[1044px] w-[1184px] overflow-x-auto pb-[16px]">
          <div className="flex w-max gap-[16px]">
            {recentPortfolios.map((portfolio) => (
              <article
                className="h-[132px] w-[360px] shrink-0 rounded-[12px] border border-[#c9d5e7] bg-white p-[20px]"
                key={portfolio.id}
                onClick={() => toSelectedPortfolioHash(portfolio.id)}
              >
                <h3 className="text-[17px] font-semibold text-[#121a34]">
                  {portfolio.projectName}
                </h3>
                <p className="mt-[18px] text-[13px] font-medium text-[#2e569d]">
                  {formatSkills(portfolio.skills)}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

function SectionTitle({ children, top }: { children: string; top: number }) {
  return (
    <h2
      className="absolute left-[47px] text-[19px] font-semibold leading-[28px] text-[#121a34]"
      style={{ top }}
    >
      {children}
    </h2>
  )
}

export default MainDashboardPage
