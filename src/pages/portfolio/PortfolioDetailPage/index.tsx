import { useEffect, useMemo, useState } from 'react'
import { portfolioApi, type PortfolioDetail } from '../../../services/api'
import {
  categoryLabels,
  formatDateRange,
  getInitial,
  getSelectedPortfolioId,
  toModifyPortfolioHash,
} from '../../../services/portfolioMapper'
import DashboardHeader from '../../../widgets/header/DashboardHeader'

const imgHeaderLogoMark =
  'https://www.figma.com/api/mcp/asset/bad09c64-0ba8-4ed2-bec2-b2dbd4026fbf'

function PortfolioDetailPage() {
  const [errorMessage, setErrorMessage] = useState('')
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [portfolio, setPortfolio] = useState<PortfolioDetail | null>(null)
  const portfolioId = getSelectedPortfolioId()
  const shouldAnimateTitle = (portfolio?.projectName.length ?? 0) > 14
  const renderedMarkdown = useMemo(
    () => renderMarkdown(portfolio?.description ?? ''),
    [portfolio?.description],
  )
  const orderedParticipants = useMemo(
    () =>
      [...(portfolio?.participants ?? [])].sort((first, second) => {
        if (first.owner === second.owner) {
          return 0
        }

        return first.owner ? -1 : 1
      }),
    [portfolio?.participants],
  )

  useEffect(() => {
    const loadPortfolio = async () => {
      setErrorMessage('')

      try {
        const data = await portfolioApi.getDetail(portfolioId)
        setPortfolio(data)
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : '포트폴리오 상세 정보를 불러오지 못했습니다.',
        )
      }
    }

    loadPortfolio()
  }, [portfolioId])

  const handleDelete = async () => {
    if (!portfolio) {
      return
    }

    setIsDeleting(true)

    try {
      await portfolioApi.delete(portfolio.id)
      window.location.hash = 'portfolio'
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : '포트폴리오 삭제에 실패했습니다.',
      )
      setIsDeleteModalOpen(false)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleLike = async () => {
    if (!portfolio) {
      return
    }

    try {
      const data = await portfolioApi.toggleLike(portfolio.id)
      setPortfolio((current) =>
        current
          ? { ...current, liked: data.liked, likeCount: data.likeCount }
          : current,
      )
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : '공감 처리에 실패했습니다.',
      )
    }
  }

  return (
    <main className="min-h-screen overflow-auto bg-[#f3f7fc]">
      <section
        className="relative mx-auto h-[1184px] w-[1280px] bg-[#f3f7fc]"
        data-name="06 Portfolio Detail"
        data-node-id="38:222"
      >
        <DashboardHeader active="portfolio" logo={imgHeaderLogoMark} />

        <div className="absolute left-[48px] top-[103px]">
          <h1 className="text-[28px] font-bold leading-[42px] text-[#121a34]">
            포트폴리오 상세
          </h1>
          <p className="text-[14px] leading-[24px] text-[#5c6a84]">
            포트폴리오 상세 정보와 참여자, 공감 상태를 확인합니다.
          </p>
        </div>
        {portfolio?.canEdit && (
          <button
            className="absolute left-[1054px] top-[108px] flex h-[40px] w-[72px] items-center justify-center rounded-[8px] border border-[#2e569d] bg-white text-[13px] font-semibold text-[#2e569d]"
            onClick={() => toModifyPortfolioHash(portfolio.id)}
            type="button"
          >
            수정
          </button>
        )}
        {portfolio?.owner && (
          <button
            className="absolute left-[1138px] top-[108px] h-[40px] w-[72px] rounded-[8px] border border-[#b83232] bg-[#c23b3b] text-[13px] font-semibold text-white shadow-[0px_8px_16px_-8px_rgba(194,59,59,0.18)]"
            onClick={() => setIsDeleteModalOpen(true)}
            type="button"
          >
            삭제
          </button>
        )}

        <div className="absolute left-[48px] top-[184px] flex h-[544px] w-[760px] items-center justify-center rounded-[18px] border border-[#c9d5e7] bg-[#e7f0fa] text-[24px] font-bold text-[#5c6a84]">
          {portfolio?.thumbnailUrl ? (
            <img
              alt={`${portfolio.projectName} 대표 이미지`}
              className="size-full rounded-[18px] object-cover"
              src={portfolio.thumbnailUrl}
            />
          ) : (
            '대표 이미지'
          )}
        </div>

        <aside className="absolute left-[840px] top-[184px] h-[300px] w-[392px] rounded-[18px] border border-[#c9d5e7] bg-white px-[28px] py-[24px]">
          <div className="flex items-start justify-between gap-[14px]">
            <h2 className="h-[36px] max-w-[196px] overflow-hidden whitespace-nowrap text-[24px] font-bold leading-[36px] text-[#121a34]">
              <span className={shouldAnimateTitle ? 'inline-block animate-title-marquee' : ''}>
                {portfolio?.projectName ?? '포트폴리오 정보를 불러오는 중'}
              </span>
            </h2>
            <span className="flex h-[30px] shrink-0 items-center justify-center rounded-[10px] border border-[#c9d9ee] bg-[#edf4fd] px-[16px] text-[12px] font-semibold text-[#2e569d]">
              {portfolio ? categoryLabels[portfolio.category] : '카테고리'}
            </span>
          </div>

          <p className="mt-[16px] text-[14px] leading-[21px] text-[#5c6a84]">
            {portfolio?.summary ?? errorMessage}
          </p>

          <div className="mt-[18px] flex gap-[12px]">
            {(portfolio?.skills ?? []).map((tag) => (
              <span
                className="flex h-[28px] items-center rounded-[14px] border border-[#c9d5e7] bg-[#e7f0fa] px-[18px] text-[12px] font-semibold text-[#2e569d]"
                key={tag}
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-[22px] flex gap-[12px]">
            <a
              className="flex h-[40px] w-[92px] items-center justify-center rounded-[8px] border border-[#2e569d] bg-white text-[13px] font-semibold text-[#2e569d]"
              href={portfolio?.githubLink ?? '#portfolio-detail'}
              rel="noreferrer"
              target={portfolio?.githubLink ? '_blank' : undefined}
            >
              GitHub
            </a>
            <a
              className="flex h-[40px] w-[106px] items-center justify-center rounded-[8px] border border-[#2e569d] bg-white text-[13px] font-semibold text-[#2e569d]"
              href={portfolio?.deploymentLink ?? '#portfolio-detail'}
              rel="noreferrer"
              target={portfolio?.deploymentLink ? '_blank' : undefined}
            >
              배포 링크
            </a>
            <button
              className={[
                'h-[40px] w-[112px] rounded-[8px] border text-[13px] font-semibold transition',
                portfolio?.liked
                  ? 'border-[#cf761f] bg-[#cf761f] text-white'
                  : 'border-[#cf761f] bg-white text-[#cf761f] hover:bg-[#fff6ed]',
              ].join(' ')}
              onClick={handleLike}
              type="button"
            >
              ♥ {portfolio?.likeCount ?? 0} 공감
            </button>
          </div>

          <p className="mt-[14px] text-[13px] leading-[18px] text-[#61708a]">
            개발 기간{' '}
            {portfolio
              ? formatDateRange(portfolio.startDate, portfolio.endDate)
              : '-'}
          </p>
        </aside>

        <aside className="absolute left-[840px] top-[498px] h-[230px] w-[392px] rounded-[16px] border border-[#c9d9ee] bg-white px-[32px] py-[20px] shadow-[0px_10px_22px_-10px_rgba(46,86,157,0.07)]">
          <div className="flex items-center justify-between">
            <h2 className="text-[17px] font-bold text-[#121a34]">
              작성자 / 참여자
            </h2>
            <span className="flex h-[28px] w-[112px] items-center justify-center rounded-[14px] border border-[#c9d9ee] bg-[#edf4fd] text-[12px] font-semibold text-[#2e569d]">
              총 {orderedParticipants.length}명
            </span>
          </div>
          <p className="mt-[12px] text-[13px] text-[#5c6a84]">
            프로젝트에 등록된 작성자와 참여자입니다.
          </p>

          <div className="mt-[14px] h-[124px] overflow-y-auto pr-[10px] [scrollbar-color:#7ea2f3_#e6eef8] [scrollbar-width:thin]">
            <div className="space-y-[8px]">
              {orderedParticipants.map((participant) => (
                <div
                  className={[
                    'flex h-[34px] w-[300px] items-center rounded-[10px] px-[10px]',
                    participant.owner
                      ? 'border-[1.5px] border-[#5f99f5] bg-[#f7fbff]'
                      : 'border border-[#dde7f3] bg-white',
                  ].join(' ')}
                  key={participant.userId}
                >
                  <span
                    className={[
                      'flex size-[22px] shrink-0 items-center justify-center rounded-full text-[10px] font-semibold',
                      participant.owner
                        ? 'bg-[#2e569d] text-white'
                        : 'border border-[#c9d9ee] bg-[#edf4fd] text-[#2e569d]',
                    ].join(' ')}
                  >
                    {getInitial(participant.name)}
                  </span>
                  <strong className="ml-[12px] w-[74px] text-[13px] font-semibold text-[#102047]">
                    {participant.name}
                  </strong>
                  <span className="text-[11px] text-[#61708a]">
                    {participant.owner ? '작성자' : '참여자'} · {participant.role}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <section className="absolute left-[48px] top-[769px] h-[374px] w-[1184px] rounded-[16px] border border-[#c9d5e7] bg-white p-[50px]">
          <h2 className="text-[19px] font-bold text-[#121a34]">상세 설명</h2>
          <div className="mt-[34px] h-[260px] overflow-y-auto text-[14px] leading-[32px] text-[#5c6a84]">
            {renderedMarkdown.length > 0
              ? renderedMarkdown
              : '상세 설명이 없습니다.'}
          </div>
        </section>

        {isDeleteModalOpen && portfolio && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#121a34]/45 px-[24px]">
            <section
              aria-modal="true"
              className="w-[392px] rounded-[18px] border border-[#d8e2f0] bg-white px-[28px] py-[26px] shadow-[0px_24px_54px_-20px_rgba(18,26,52,0.45)]"
              role="dialog"
            >
              <div className="mx-auto flex size-[48px] items-center justify-center rounded-full bg-[#fff1f1] text-[22px] font-bold text-[#c23b3b]">
                !
              </div>
              <h2 className="mt-[18px] text-center text-[20px] font-bold leading-[30px] text-[#121a34]">
                삭제하시겠습니까?
              </h2>
              <p className="mt-[10px] text-center text-[13px] leading-[21px] text-[#5c6a84]">
                {portfolio.projectName} 포트폴리오가 삭제됩니다.
                <br />
                삭제 후 목록과 랭킹에서 더 이상 보이지 않습니다.
              </p>
              <div className="mt-[24px] flex gap-[10px]">
                <button
                  className="h-[42px] flex-1 rounded-[8px] border border-[#c9d5e7] bg-white text-[13px] font-semibold text-[#2e569d] hover:bg-[#f3f7fc]"
                  disabled={isDeleting}
                  onClick={() => setIsDeleteModalOpen(false)}
                  type="button"
                >
                  취소
                </button>
                <button
                  className="h-[42px] flex-1 rounded-[8px] bg-[#c23b3b] text-[13px] font-semibold text-white shadow-[0px_8px_16px_-8px_rgba(194,59,59,0.35)] disabled:bg-[#d89a9a]"
                  disabled={isDeleting}
                  onClick={handleDelete}
                  type="button"
                >
                  {isDeleting ? '삭제 중' : '삭제'}
                </button>
              </div>
            </section>
          </div>
        )}
      </section>
    </main>
  )
}

function renderMarkdown(markdown: string) {
  return markdown.split('\n').map((line, index) => {
    if (line.startsWith('# ')) {
      return (
        <h1 className="mb-[12px] text-[20px] font-bold text-[#121a34]" key={index}>
          {line.replace('# ', '')}
        </h1>
      )
    }

    if (line.startsWith('## ')) {
      return (
        <h2 className="mb-[8px] mt-[18px] text-[16px] font-bold text-[#102047]" key={index}>
          {line.replace('## ', '')}
        </h2>
      )
    }

    if (!line.trim()) {
      return <div className="h-[8px]" key={index} />
    }

    return <p key={index}>{line}</p>
  })
}

export default PortfolioDetailPage
