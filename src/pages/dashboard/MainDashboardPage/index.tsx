import { useState } from 'react'
import DashboardHeader from '../../../widgets/header/DashboardHeader'

const imgHeaderLogoMark =
  'https://www.figma.com/api/mcp/asset/32ce995a-f29b-4ccb-b7d3-03a243641f94'

const slideData = {
  thisTermSlides: [
    {
      title: 'AI 코드 리뷰 도우미',
      description: 'GitHub PR을 분석하고 리뷰 코멘트를 생성하는',
      description2: '가천대 컴공 학생들의 베스트 프로젝트',
      author: '김진우',
      stack: 'React · Spring · GPT',
      likes: 42,
      badge: '♛',
    },
    {
      title: '캠퍼스 스터디 매칭',
      description: '관심 분야와 시간표 기반으로',
      description2: '스터디 팀을 연결합니다',
      author: '이수진',
      stack: 'Next.js · Prisma',
      likes: 35,
      badge: '♛',
    },
    {
      title: '알고리즘 배틀 플랫폼',
      description: '문제 풀이 기록과 랭킹으로',
      description2: '학습 동기를 만드는 서비스',
      author: '박준호',
      stack: 'Vue · Node.js',
      likes: 28,
      badge: '♛',
    },
  ],
  lastTermSlides: [
    {
      title: '이커머스 플랫폼 개발',
      description: '학교 협력사와 함께 만든',
      description2: '실제 상용 이커머스 플랫폼',
      author: '최민준',
      stack: 'React · Django · PostgreSQL',
      likes: 38,
      badge: '♛',
    },
    {
      title: 'SNS 서비스',
      description: '가천대 학생들을 위한',
      description2: '소셜 네트워킹 플랫폼',
      author: '정지훈',
      stack: 'Vue · Express · MongoDB',
      likes: 32,
      badge: '♛',
    },
    {
      title: 'AI 이미지 생성 도구',
      description: 'Stable Diffusion을 활용한',
      description2: '이미지 생성 웹 애플리케이션',
      author: '김영희',
      stack: 'Next.js · Python · FastAPI',
      likes: 29,
      badge: '♛',
    },
  ],
  allTimeSlides: [
    {
      title: '채용 매칭 플랫폼',
      description: '기업과 학생을 연결하는',
      description2: '스마트 채용 플랫폼',
      author: '이준호',
      stack: 'React · Spring Boot · MySQL',
      likes: 56,
      badge: '♛',
    },
    {
      title: '클라우드 스토리지 서비스',
      description: '안전한 파일 관리를 위한',
      description2: '클라우드 스토리지 솔루션',
      author: '박지민',
      stack: 'Vue · Node.js · AWS',
      likes: 45,
      badge: '♛',
    },
    {
      title: '머신러닝 모델 배포 플랫폼',
      description: '머신러닝 모델 학습과',
      description2: '배포를 간편하게 하는 플랫폼',
      author: '최영준',
      stack: 'React · Python · Kubernetes',
      likes: 51,
      badge: '♛',
    },
  ],
}

const popularPortfolios = [
  ['AI 코드 리뷰 도우미', 'GitHub PR을 분석하고 리뷰 코멘트를 생성하는 프로젝트', 'React · Spring · GPT', '42'],
  ['캠퍼스 스터디 매칭', '관심 분야와 시간표 기반으로 스터디 팀을 연결합니다', 'Next.js · Prisma', '35'],
  ['알고리즘 배틀 플랫폼', '문제 풀이 기록과 랭킹으로 학습 동기를 만드는 서비스', 'Vue · Node.js', '28'],
]

const recentPortfolios = [
  ['졸업 프로젝트 웹 포트폴리오', 'FE 1명 · BE 1명', 'React, Spring Boot'],
  ['운영체제 스터디', '발표자 3명', 'C, Linux'],
  ['해커톤 사이드 프로젝트', '디자이너 · BE', 'Figma, NestJS'],
  ['데이터 시각화 포트폴리오', 'FE 1명 · Data 1명', 'D3.js, Python'],
  ['학식 알림 봇', 'BE 1명', 'Python, Discord'],
  ['강의실 예약 도우미', 'FE 1명 · BE 1명', 'Next.js, Supabase'],
]

function MainDashboardPage() {
  const [term, setTerm] = useState<'thisTerm' | 'lastTerm' | 'allTime'>('thisTerm')
  const [slideIndex, setSlideIndex] = useState(0)

  const getSlides = () => {
    switch (term) {
      case 'lastTerm':
        return slideData.lastTermSlides
      case 'allTime':
        return slideData.allTimeSlides
      default:
        return slideData.thisTermSlides
    }
  }

  const slides = getSlides()
  const currentSlide = slides[slideIndex]

  const handlePrevSlide = () => {
    const newIndex = slideIndex === 0 ? slides.length - 1 : slideIndex - 1
    setSlideIndex(newIndex)
    updateTermBySlideIndex(newIndex)
  }

  const handleNextSlide = () => {
    const newIndex = slideIndex === slides.length - 1 ? 0 : slideIndex + 1
    setSlideIndex(newIndex)
    updateTermBySlideIndex(newIndex)
  }

  const updateTermBySlideIndex = (index: number) => {
    switch (index) {
      case 0:
        setTerm('thisTerm')
        break
      case 1:
        setTerm('lastTerm')
        break
      case 2:
        setTerm('allTime')
        break
    }
  }

  const handleTermChange = (newTerm: 'thisTerm' | 'lastTerm' | 'allTime') => {
    setTerm(newTerm)
    switch (newTerm) {
      case 'thisTerm':
        setSlideIndex(0)
        break
      case 'lastTerm':
        setSlideIndex(1)
        break
      case 'allTime':
        setSlideIndex(2)
        break
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
              onClick={() => handleTermChange('thisTerm')}
              className={[
                'px-[16px] py-[6px] rounded-[6px] text-[12px] font-semibold transition-all',
                term === 'thisTerm'
                  ? 'bg-white text-[#253e86]'
                  : 'bg-[rgba(255,255,255,0.2)] text-white hover:bg-[rgba(255,255,255,0.3)]',
              ].join(' ')}
            >
              이번학기
            </button>
            <button
              onClick={() => handleTermChange('lastTerm')}
              className={[
                'px-[16px] py-[6px] rounded-[6px] text-[12px] font-semibold transition-all',
                term === 'lastTerm'
                  ? 'bg-white text-[#253e86]'
                  : 'bg-[rgba(255,255,255,0.2)] text-white hover:bg-[rgba(255,255,255,0.3)]',
              ].join(' ')}
            >
              저번학기
            </button>
            <button
              onClick={() => handleTermChange('allTime')}
              className={[
                'px-[16px] py-[6px] rounded-[6px] text-[12px] font-semibold transition-all',
                term === 'allTime'
                  ? 'bg-white text-[#253e86]'
                  : 'bg-[rgba(255,255,255,0.2)] text-white hover:bg-[rgba(255,255,255,0.3)]',
              ].join(' ')}
            >
              전체
            </button>
          </div>

          <p className="absolute left-[36px] top-[112px] text-[22px] font-bold leading-[34px] text-[#62b7e6]">
            {term === 'thisTerm' ? '이번 학기 1위 포트폴리오' : term === 'lastTerm' ? '저번 학기 1위 포트폴리오' : '전체 1위 포트폴리오'}
          </p>
          <h2 className="absolute left-[36px] top-[164px] text-[54px] font-bold leading-[74px] text-white">
            {currentSlide.title}
          </h2>
          <div className="absolute left-[40px] top-[238px] h-[8px] w-[348px] rounded-[4px] bg-[#ffc32f]" />
          <p className="absolute left-[40px] top-[270px] w-[560px] text-[18px] font-medium leading-[32px] text-white">
            {currentSlide.description}
            <br />
            {currentSlide.description2}
          </p>
          <a
            className="absolute left-[40px] top-[370px] flex h-[42px] w-[172px] items-center justify-center rounded-[9px] bg-[#e2842a] text-[13px] font-semibold text-white"
            href="#portfolio-detail"
          >
            포트폴리오 상세 보기
          </a>

          <div className="absolute left-[655px] top-[58px] h-[318px] w-[360px] rounded-[22px] bg-[rgba(255,255,255,0.96)] shadow-[0px_24px_36px_-18px_rgba(5,10,31,0.3)]">
            <div className="absolute left-[28px] top-[28px] flex h-[138px] w-[304px] items-center justify-center rounded-[16px] border border-[#c9d5e7] bg-[#e7f0fa] text-[15px] font-bold text-[#2e569d]">
              PROJECT PREVIEW
            </div>
            <div className="absolute -left-[8px] -top-[8px] flex size-[58px] items-center justify-center rounded-full border border-white bg-[#ffc32f] text-[25px] font-bold text-[#121a34]">
              {currentSlide.badge}
            </div>
            <p className="absolute left-[28px] top-[204px] text-[20px] font-bold leading-[28px] text-[#121a34]">
              {currentSlide.title}
            </p>
            <p className="absolute left-[28px] top-[238px] text-[13px] font-medium text-[#5c6a84]">
              {currentSlide.author} · {currentSlide.stack}
            </p>
            <div className="absolute left-[28px] top-[269px] flex h-[34px] w-[92px] items-center justify-center rounded-[17px] bg-[#2e569d] text-[14px] font-bold text-white">
              ♥ {currentSlide.likes}
            </div>
          </div>

          <div className="absolute left-[1048px] top-[325px] overflow-hidden rounded-[12px] bg-[rgba(255,255,255,0.94)]">
            <div className="h-[54px] w-[112px] text-center text-[13px] font-bold leading-[54px] text-[#2e569d]">
              {slideIndex + 1} / {slides.length}
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
              style={{ width: `${((slideIndex + 1) / slides.length) * 100}%` }}
            />
          </div>
        </section>

        <SectionTitle top={691}>인기 포트폴리오</SectionTitle>
        <div className="absolute left-[47px] top-[729px] flex gap-[24px]">
          {popularPortfolios.map(([title, summary, stack, likes]) => (
            <article
              className="h-[238px] w-[352px] rounded-[12px] border border-[#c9d5e7] bg-white p-[16px]"
              key={title}
            >
              <div className="flex h-[108px] items-center justify-center rounded-[10px] bg-[#e7f0fa] text-[13px] font-medium text-[#5c6a84]">
                프로젝트 썸네일
              </div>
              <h3 className="mt-[15px] text-[17px] font-semibold text-[#121a34]">
                {title}
              </h3>
              <p className="mt-[8px] text-[12px] leading-[17px] text-[#5c6a84]">
                {summary}
              </p>
              <div className="mt-[12px] flex justify-between text-[12px] font-medium text-[#2e569d]">
                <span>{stack}</span>
                <span className="text-[13px] font-semibold text-[#c7252e]">
                  ♥ {likes}
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
            {recentPortfolios.map(([title, members, stack]) => (
              <article
                className="h-[132px] w-[360px] shrink-0 rounded-[12px] border border-[#c9d5e7] bg-white p-[20px]"
                key={title}
              >
                <h3 className="text-[17px] font-semibold text-[#121a34]">
                  {title}
                </h3>
                <p className="mt-[12px] text-[13px] text-[#5c6a84]">
                  {members}
                </p>
                <p className="mt-[10px] text-[13px] font-medium text-[#2e569d]">
                  {stack}
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
