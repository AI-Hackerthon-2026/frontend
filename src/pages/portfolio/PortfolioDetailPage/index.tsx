import { useState } from 'react'
import DashboardHeader from '../../../widgets/header/DashboardHeader'

const imgHeaderLogoMark =
  'https://www.figma.com/api/mcp/asset/bad09c64-0ba8-4ed2-bec2-b2dbd4026fbf'

const participants = [
  ['J', '김진우', '작성자 · Frontend'],
  ['S', '이서연', '참여자 · Backend'],
  ['M', '박민재', '참여자 · AI / Data'],
  ['H', '한유진', '참여자 · Design'],
  ['D', '도현수', '참여자 · DevOps'],
]

const portfolioTitle = 'AI 코드 리뷰 도우미'
const shouldAnimateTitle = portfolioTitle.length > 14

function PortfolioDetailPage() {
  const [isLiked, setIsLiked] = useState(false)
  const likeCount = isLiked ? 44 : 43

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
        <a
          className="absolute left-[1054px] top-[108px] flex h-[40px] w-[72px] items-center justify-center rounded-[8px] border border-[#2e569d] bg-white text-[13px] font-semibold text-[#2e569d]"
          href="#portfolio-modify"
        >
          수정
        </a>
        <button
          className="absolute left-[1138px] top-[108px] h-[40px] w-[72px] rounded-[8px] border border-[#b83232] bg-[#c23b3b] text-[13px] font-semibold text-white shadow-[0px_8px_16px_-8px_rgba(194,59,59,0.18)]"
          type="button"
        >
          삭제
        </button>

        <div className="absolute left-[48px] top-[184px] flex h-[544px] w-[760px] items-center justify-center rounded-[18px] border border-[#c9d5e7] bg-[#e7f0fa] text-[24px] font-bold text-[#5c6a84]">
          대표 이미지
        </div>

        <aside className="absolute left-[840px] top-[184px] h-[300px] w-[392px] rounded-[18px] border border-[#c9d5e7] bg-white px-[28px] py-[24px]">
          <div className="flex items-start justify-between gap-[14px]">
            <h2 className="h-[36px] max-w-[196px] overflow-hidden whitespace-nowrap text-[24px] font-bold leading-[36px] text-[#121a34]">
              <span className={shouldAnimateTitle ? 'inline-block animate-title-marquee' : ''}>
                {portfolioTitle}
              </span>
            </h2>
            <span className="flex h-[30px] shrink-0 items-center justify-center rounded-[10px] border border-[#c9d9ee] bg-[#edf4fd] px-[16px] text-[12px] font-semibold text-[#2e569d]">
              졸업 프로젝트
            </span>
          </div>

          <p className="mt-[16px] text-[14px] leading-[21px] text-[#5c6a84]">
            GitHub PR을 분석해 리뷰 코멘트를 생성하는 프로젝트
          </p>

          <div className="mt-[18px] flex gap-[12px]">
            {['React', 'Spring', 'GPT API'].map((tag) => (
              <span
                className="flex h-[28px] items-center rounded-[14px] border border-[#c9d5e7] bg-[#e7f0fa] px-[18px] text-[12px] font-semibold text-[#2e569d]"
                key={tag}
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-[22px] flex gap-[12px]">
            <button className="h-[40px] w-[92px] rounded-[8px] border border-[#2e569d] bg-white text-[13px] font-semibold text-[#2e569d]">
              GitHub
            </button>
            <button className="h-[40px] w-[106px] rounded-[8px] border border-[#2e569d] bg-white text-[13px] font-semibold text-[#2e569d]">
              배포 링크
            </button>
            <button
              className={[
                'h-[40px] w-[112px] rounded-[8px] border text-[13px] font-semibold transition',
                isLiked
                  ? 'border-[#cf761f] bg-[#cf761f] text-white'
                  : 'border-[#cf761f] bg-white text-[#cf761f] hover:bg-[#fff6ed]',
              ].join(' ')}
              onClick={() => setIsLiked((current) => !current)}
              type="button"
            >
              ♥ {likeCount} 공감
            </button>
          </div>

          <p className="mt-[14px] text-[13px] leading-[18px] text-[#61708a]">
            개발 기간 2026.03 - 2026.06
          </p>
        </aside>

        <aside className="absolute left-[840px] top-[498px] h-[230px] w-[392px] rounded-[16px] border border-[#c9d9ee] bg-white px-[32px] py-[20px] shadow-[0px_10px_22px_-10px_rgba(46,86,157,0.07)]">
          <div className="flex items-center justify-between">
            <h2 className="text-[17px] font-bold text-[#121a34]">
              작성자 / 참여자
            </h2>
            <span className="flex h-[28px] w-[112px] items-center justify-center rounded-[14px] border border-[#c9d9ee] bg-[#edf4fd] text-[12px] font-semibold text-[#2e569d]">
              총 {participants.length}명
            </span>
          </div>
          <p className="mt-[12px] text-[13px] text-[#5c6a84]">
            프로젝트에 등록된 작성자와 참여자입니다.
          </p>

          <div className="mt-[14px] h-[124px] overflow-y-auto pr-[10px] [scrollbar-color:#7ea2f3_#e6eef8] [scrollbar-width:thin]">
            <div className="space-y-[8px]">
              {participants.map(([initial, name, role], index) => (
                <div
                  className={[
                    'flex h-[34px] w-[300px] items-center rounded-[10px] px-[10px]',
                    index === 0
                      ? 'border-[1.5px] border-[#5f99f5] bg-[#f7fbff]'
                      : 'border border-[#dde7f3] bg-white',
                  ].join(' ')}
                  key={name}
                >
                  <span
                    className={[
                      'flex size-[22px] shrink-0 items-center justify-center rounded-full text-[10px] font-semibold',
                      index === 0
                        ? 'bg-[#2e569d] text-white'
                        : 'border border-[#c9d9ee] bg-[#edf4fd] text-[#2e569d]',
                    ].join(' ')}
                  >
                    {initial}
                  </span>
                  <strong className="ml-[12px] w-[74px] text-[13px] font-semibold text-[#102047]">
                    {name}
                  </strong>
                  <span className="text-[11px] text-[#61708a]">{role}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <section className="absolute left-[48px] top-[769px] h-[374px] w-[1184px] rounded-[16px] border border-[#c9d5e7] bg-white p-[50px]">
          <h2 className="text-[19px] font-bold text-[#121a34]">상세 설명</h2>
          <p className="mt-[54px] text-[14px] leading-[32px] text-[#5c6a84]">
            프로젝트 배경, 주요 기능, 아키텍처, 구현 과정과 회고를 정리한 본문 영역입니다.
            <br />
            텍스트가 길어질 경우 상세 화면 내부에서 스크롤됩니다.
          </p>
        </section>
      </section>
    </main>
  )
}

export default PortfolioDetailPage
