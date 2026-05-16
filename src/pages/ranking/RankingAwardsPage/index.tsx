import { useEffect, useState } from 'react'
import { portfolioApi, type PortfolioListItem } from '../../../services/api'
import { formatSkills, periodValues, toSelectedPortfolioHash } from '../../../services/portfolioMapper'
import DashboardHeader from '../../../widgets/header/DashboardHeader'

const imgHeaderLogoMark =
  'https://www.figma.com/api/mcp/asset/c7bad5af-1d95-4a68-a691-58b960e93142'

const topProjectStyles = [
  {
    border: 'border-[#f5c84b]',
    button: 'bg-[#e2842a] text-white',
    card: 'bg-[#40589e] text-white',
    label: '최우수 프로젝트',
    rankColor: 'text-[#f5c84b]',
    trophyBg: 'bg-[#fff1b8]',
    trophyBorder: 'border-[#f5c84b]',
    trophyText: 'text-[#bf7b00]',
  },
  {
    border: 'border-[#bfd0e6]',
    button: 'border border-[#2e569d] bg-white text-[#2e569d]',
    card: 'bg-white text-[#102047]',
    label: '우수 프로젝트',
    rankColor: 'text-[#bfd0e6]',
    trophyBg: 'bg-[#f2f6fb]',
    trophyBorder: 'border-[#bfd0e6]',
    trophyText: 'text-[#6d819d]',
  },
  {
    border: 'border-[#d88b3a]',
    button: 'border border-[#2e569d] bg-white text-[#2e569d]',
    card: 'bg-white text-[#102047]',
    label: '인기 프로젝트',
    rankColor: 'text-[#d88b3a]',
    trophyBg: 'bg-[#fff1e3]',
    trophyBorder: 'border-[#d88b3a]',
    trophyText: 'text-[#b96624]',
  },
]

function RankingAwardsPage() {
  const [errorMessage, setErrorMessage] = useState('')
  const [period, setPeriod] = useState('이번 학기')
  const [rankingRows, setRankingRows] = useState<PortfolioListItem[]>([])

  useEffect(() => {
    const loadRanking = async () => {
      setErrorMessage('')

      try {
        const data = await portfolioApi.getRanking(periodValues[period])
        setRankingRows(data)
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : '랭킹을 불러오지 못했습니다.',
        )
        setRankingRows([])
      }
    }

    loadRanking()
  }, [period])

  return (
    <main className="min-h-screen overflow-auto bg-[#f3f7fc]">
      <section
        className="relative mx-auto h-[1214px] w-[1280px] overflow-hidden rounded-[18px] border border-[#d1d8e3] bg-[#f3f7fc]"
        data-name="08 Ranking Awards"
        data-node-id="1:206"
      >
        <DashboardHeader active="ranking" logo={imgHeaderLogoMark} />

        <div className="absolute left-[47px] top-[103px]">
          <h1 className="text-[28px] font-bold leading-[41px] text-[#121a34]">
            포트폴리오 랭킹
          </h1>
          <p className="mt-[1px] text-[14px] leading-[20px] text-[#5c6a84]">
            공감 수 기준으로 순위를 산정하고 상위 3개 프로젝트를 시상 대상으로 표시합니다.
          </p>
        </div>

        <div className="absolute left-[1064px] top-[104px] h-[44px] w-[140px] overflow-hidden rounded-[22px] border border-[#121a34] bg-white">
          <select
            aria-label="랭킹 기간 선택"
            className="h-full w-full appearance-none bg-transparent pl-[22px] pr-[40px] text-[13px] font-semibold leading-[44px] text-[#121a34] outline-none"
            onChange={(event) => setPeriod(event.target.value)}
            value={period}
          >
            <option>이번 학기</option>
            <option>저번 학기</option>
            <option>전체</option>
          </select>
          <span className="pointer-events-none absolute right-[18px] top-1/2 flex size-[16px] -translate-y-1/2 items-center justify-center text-[14px] leading-none text-[#121a34]">
            ▾
          </span>
        </div>

        <div className="absolute left-[67px] top-[187px] flex gap-[32px]">
          {topProjectStyles.map((project, index) => {
            const portfolio = rankingRows[index]

            return (
            <article
              className={[
                'relative h-[360px] w-[360px] rounded-[20px] border-[1.5px] p-[32px] shadow-[0px_18px_34px_-8px_rgba(27,36,81,0.18)]',
                project.border,
                project.card,
                index === 0 ? 'border-3' : '',
              ].join(' ')}
              key={portfolio?.id ?? index}
            >
              {index === 0 && (
                <div className="absolute left-[128px] top-[-15px] h-[28px] w-[104px] rounded-[14px] bg-[#ffc32f] text-center text-[11px] font-bold leading-[28px] tracking-[0.66px] text-[#121a34]">
                  TOP PROJECT
                </div>
              )}
              <div
                className={[
                  'absolute right-[32px] top-[32px] flex size-[56px] items-center justify-center rounded-full border text-[24px] font-semibold',
                  project.trophyBg,
                  project.trophyBorder,
                  project.trophyText,
                ].join(' ')}
              >
                {index === 0 ? '♛' : index === 1 ? 'Ⅱ' : 'Ⅲ'}
              </div>
              <p className={`text-[28px] font-bold leading-[40px] ${project.rankColor}`}>
                {index + 1}위
              </p>
              <h2 className="mt-[18px] text-[19px] font-bold leading-[28px]">
                {project.label}
              </h2>
              <p className="mt-[28px] text-[18px] font-semibold leading-[28px]">
                {portfolio?.projectName ?? '데이터 없음'}
              </p>
              <p className="mt-[20px] text-[13px] font-medium opacity-80">
                {portfolio
                  ? `${portfolio.authorName} · ♥ ${portfolio.likeCount}`
                  : '랭킹 데이터를 기다리는 중입니다.'}
              </p>
              <button
                className={[
                  'absolute left-[32px] top-[276px] flex h-[40px] w-[120px] items-center justify-center rounded-[8px] text-[13px] font-semibold',
                  project.button,
                ].join(' ')}
                onClick={() => portfolio && toSelectedPortfolioHash(portfolio.id)}
                type="button"
              >
                상세 보기
              </button>
            </article>
            )
          })}
        </div>

        <section className="absolute left-[47px] top-[586px] h-[610px] w-[1184px] overflow-hidden rounded-[12px] border border-[#c9d5e7] bg-white">
          <div className="grid h-[58px] grid-cols-[90px_350px_200px_260px_130px_100px] items-center px-[32px] text-[13px] font-semibold text-[#2e569d]">
            <span>순위</span>
            <span>프로젝트명</span>
            <span>작성자/팀</span>
            <span>기술 스택</span>
            <span className="justify-self-center">공감</span>
            <span aria-hidden="true" />
          </div>
          {errorMessage && (
            <div className="flex h-[68px] items-center border-t border-[#dde7f3] px-[32px] text-[13px] text-[#c7252e]">
              {errorMessage}
            </div>
          )}
          {rankingRows.map((portfolio, index) => {
            const rank = String(index + 1)

            return (
            <div
              className={[
                'grid h-[68px] grid-cols-[90px_350px_200px_260px_130px_100px] items-center border-t border-[#dde7f3] px-[32px]',
                rank === '1'
                  ? 'bg-[rgba(255,246,209,0.72)]'
                  : rank === '2'
                    ? 'bg-[rgba(240,244,252,0.5)]'
                    : rank === '3'
                      ? 'bg-[rgba(255,240,222,0.5)]'
                      : 'bg-white',
              ].join(' ')}
              key={portfolio.id}
            >
              <span
                className={[
                  'flex size-[24px] items-center justify-center rounded-full text-[11px] font-bold',
                  rank === '1'
                    ? 'bg-[#ffc32f] text-white'
                    : rank === '2'
                      ? 'bg-[#c7d6eb] text-[#2e569d]'
                      : rank === '3'
                        ? 'bg-[#db823d] text-white'
                        : 'text-[#121a34]',
                ].join(' ')}
              >
                {rank}
              </span>
              <strong className="text-[15px] font-bold text-[#121a34]">
                {portfolio.projectName}
              </strong>
              <span className="text-[13px] text-[#5c6a84]">
                {portfolio.authorName}
              </span>
              <span className="text-[13px] font-medium text-[#2e569d]">
                {formatSkills(portfolio.skills)}
              </span>
              <span className="justify-self-center text-[14px] font-bold text-[#c7252e]">
                ♥ {portfolio.likeCount}
              </span>
              <button
                className="ml-[14px] flex h-[40px] w-[64px] items-center justify-center rounded-[8px] border border-[#c9d5e7] bg-white text-[13px] font-semibold text-[#2e569d]"
                onClick={() => toSelectedPortfolioHash(portfolio.id)}
                type="button"
              >
                상세
              </button>
            </div>
            )
          })}
        </section>
      </section>
    </main>
  )
}

export default RankingAwardsPage
