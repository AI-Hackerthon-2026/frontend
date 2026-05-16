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
import PortfolioThumbnail from '../../../widgets/portfolio/PortfolioThumbnail'

const imgHeaderLogoMark =
  'https://www.figma.com/api/mcp/asset/32ce995a-f29b-4ccb-b7d3-03a243641f94'

const termOrder = ['ALL_TIME', 'CURRENT_SEMESTER', 'LAST_SEMESTER'] as const
const slideDurationMs = 4000
const termLabels = {
  ALL_TIME: '전체',
  CURRENT_SEMESTER: '이번 학기',
  LAST_SEMESTER: '저번 학기',
}
const slideRankStyles = {
  1: {
    accent: 'bg-[#ffc32f]',
    background: 'bg-[linear-gradient(115deg,#13224f_0%,#274a9d_48%,#f2b632_100%)]',
    badge: 'bg-[#ffc32f] text-[#121a34]',
    border: 'border-[#f3c548]',
    cta: 'bg-[#e2842a] hover:bg-[#cf761f]',
    label: 'text-[#ffe6a1]',
    like: 'bg-[#2e569d]',
    nav: 'bg-[#1f3472] hover:bg-[#172755]',
    pattern: 'bg-[linear-gradient(135deg,rgba(255,255,255,0.13)_0_1px,transparent_1px_26px)]',
    preview: 'bg-[#fff7df] text-[#9a641d]',
    progress: 'bg-[#ffc32f]',
    surface: 'bg-[rgba(255,255,255,0.96)]',
  },
  2: {
    accent: 'bg-[#c7d6eb]',
    background: 'bg-[linear-gradient(115deg,#182137_0%,#475d7a_50%,#dce6f2_100%)]',
    badge: 'bg-[#edf4fd] text-[#2e569d]',
    border: 'border-[#c7d6eb]',
    cta: 'bg-[#506783] hover:bg-[#40536d]',
    label: 'text-[#dce8f7]',
    like: 'bg-[#40589e]',
    nav: 'bg-[#34465f] hover:bg-[#28364a]',
    pattern: 'bg-[linear-gradient(90deg,rgba(255,255,255,0.1)_0_1px,transparent_1px_30px)]',
    preview: 'bg-[#eef4fb] text-[#40536d]',
    progress: 'bg-[#dce6f2]',
    surface: 'bg-[rgba(248,251,255,0.96)]',
  },
  3: {
    accent: 'bg-[#e2842a]',
    background: 'bg-[linear-gradient(115deg,#271c34_0%,#7a4a31_50%,#e2842a_100%)]',
    badge: 'bg-[#fff1e3] text-[#b96624]',
    border: 'border-[#e6a35f]',
    cta: 'bg-[#b96624] hover:bg-[#97501b]',
    label: 'text-[#ffd6ad]',
    like: 'bg-[#b96624]',
    nav: 'bg-[#693f31] hover:bg-[#553127]',
    pattern: 'bg-[linear-gradient(135deg,rgba(255,246,237,0.12)_0_1px,transparent_1px_24px)]',
    preview: 'bg-[#fff1e3] text-[#9a5520]',
    progress: 'bg-[#e2842a]',
    surface: 'bg-[rgba(255,250,245,0.96)]',
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
    }, slideDurationMs)

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

        <section
          className={[
            'absolute left-[48px] top-[182px] h-[464px] w-[1184px] overflow-hidden rounded-[16px] border-2 shadow-[0px_18px_30px_-18px_rgba(13,20,51,0.22)] transition-colors duration-500',
            currentSlideStyle.background,
            currentSlideStyle.border,
          ].join(' ')}
        >
          <div
            className={[
              'absolute inset-0 opacity-70 transition-colors duration-500',
              currentSlideStyle.pattern,
            ].join(' ')}
          />
          <div className="absolute left-[612px] top-[34px] h-[360px] w-[2px] bg-white/20" />
          <div className="absolute left-[637px] top-[34px] h-[360px] w-[2px] bg-white/10" />

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

          <p
            className={[
              'absolute left-[36px] top-[112px] text-[22px] font-bold leading-[34px]',
              currentSlideStyle.label,
            ].join(' ')}
          >
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
            className={[
              'absolute left-[40px] top-[370px] flex h-[42px] w-[172px] items-center justify-center rounded-[9px] text-[13px] font-semibold text-white transition-colors',
              currentSlideStyle.cta,
            ].join(' ')}
            onClick={() => currentSlide && toSelectedPortfolioHash(currentSlide.id)}
            type="button"
          >
            포트폴리오 상세 보기
          </button>

          <div
            className={[
              'absolute left-[655px] top-[58px] h-[318px] w-[360px] rounded-[22px] shadow-[0px_24px_36px_-18px_rgba(5,10,31,0.3)] animate-dashboard-slide',
              currentSlideStyle.surface,
            ].join(' ')}
            key={`card-${currentSlide?.id ?? 'empty'}-${slideIndex}`}
          >
            <PortfolioThumbnail
              alt={`${currentSlide?.projectName ?? '포트폴리오'} 대표 이미지`}
              className={[
                'absolute left-[28px] top-[28px] flex h-[138px] w-[304px] items-center justify-center overflow-hidden rounded-[16px] border border-white/80 text-[15px] font-bold',
                currentSlideStyle.preview,
              ].join(' ')}
              fallback="PROJECT PREVIEW"
              src={currentSlide?.thumbnailUrl}
            />
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
                className={[
                  'h-[42px] w-[56px] text-white flex items-center justify-center transition-colors leading-none',
                  currentSlideStyle.nav,
                ].join(' ')}
              >
                <span className="text-[28px] font-bold">‹</span>
              </button>
              <button
                onClick={handleNextSlide}
                className={[
                  'h-[42px] w-[56px] text-white flex items-center justify-center transition-colors leading-none',
                  currentSlideStyle.nav,
                ].join(' ')}
              >
                <span className="text-[28px] font-bold">›</span>
              </button>
            </div>
          </div>
          <div className="absolute left-[40px] top-[340px] h-[5px] w-[420px] rounded-[3px] bg-[rgba(255,255,255,0.24)]">
            <div
              className={[
                'h-[5px] origin-left rounded-[3px]',
                slides.length > 1 ? 'animate-dashboard-progress' : '',
                currentSlideStyle.progress,
              ].join(' ')}
              key={`progress-${currentSlide?.id ?? 'empty'}-${slideIndex}`}
              style={{
                animationDuration: `${slideDurationMs}ms`,
                transform: slides.length > 0 ? undefined : 'scaleX(0)',
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
              <PortfolioThumbnail
                alt={`${portfolio.projectName} 대표 이미지`}
                className="flex h-[108px] items-center justify-center overflow-hidden rounded-[10px] bg-[#e7f0fa] text-[13px] font-medium text-[#5c6a84]"
                fallback="프로젝트 썸네일"
                src={portfolio.thumbnailUrl}
              />
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
