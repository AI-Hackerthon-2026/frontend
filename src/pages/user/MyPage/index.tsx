import { type MouseEvent, useEffect, useState } from 'react'
import {
  authApi,
  portfolioApi,
  userApi,
  type PortfolioListItem,
  type UserProfile,
} from '../../../services/api'
import {
  getInitial,
  toModifyPortfolioHash,
  toSelectedPortfolioHash,
} from '../../../services/portfolioMapper'
import DashboardHeader from '../../../widgets/header/DashboardHeader'

const imgHeaderLogoMark =
  'https://www.figma.com/api/mcp/asset/1c395c8b-e9b5-4c97-a4b2-21fd12fb9ee1'

function MyPage() {
  const [errorMessage, setErrorMessage] = useState('')
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [myPortfolios, setMyPortfolios] = useState<PortfolioListItem[]>([])
  const [profile, setProfile] = useState<UserProfile | null>(null)

  useEffect(() => {
    const loadMyPage = async () => {
      setErrorMessage('')

      try {
        const [profileData, portfolioData] = await Promise.all([
          userApi.getMe(),
          userApi.getMyPortfolios(),
        ])
        setProfile(profileData)
        setMyPortfolios(portfolioData)
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : '마이페이지 정보를 불러오지 못했습니다.',
        )
      }
    }

    loadMyPage()
  }, [])

  const handleDelete = async (portfolioId: number) => {
    try {
      await portfolioApi.delete(portfolioId)
      setMyPortfolios((current) =>
        current.filter((portfolio) => portfolio.id !== portfolioId),
      )
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : '포트폴리오 삭제에 실패했습니다.',
      )
    }
  }

  const stopCardNavigation = (event: MouseEvent) => {
    event.stopPropagation()
  }

  const handleLogout = async () => {
    setIsLoggingOut(true)
    setErrorMessage('')

    try {
      await authApi.logout()
      window.sessionStorage.removeItem('selectedPortfolioId')
      window.location.hash = 'login'
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : '로그아웃에 실패했습니다.',
      )
      setIsLogoutModalOpen(false)
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <main className="min-h-screen overflow-auto bg-[#f3f7fc]">
      <section
        className="relative mx-auto h-[892px] w-[1280px] overflow-hidden rounded-[18px] border border-[#d1d8e3] bg-[#f3f7fc]"
        data-name="09 My Page"
        data-node-id="38:56"
      >
        <DashboardHeader active="mypage" logo={imgHeaderLogoMark} />

        <div className="absolute left-[48px] top-[103px]">
          <h1 className="text-[28px] font-bold leading-[42px] text-[#121a34]">
            마이페이지
          </h1>
          <p className="text-[14px] leading-[24px] text-[#5c6a84]">
            내 프로필과 내가 작성하거나 참여자로 지정된 포트폴리오를 관리합니다.
          </p>
        </div>

        <section className="absolute left-[48px] top-[184px] flex h-[188px] w-[1184px] items-center rounded-[18px] border border-[#c9d5e7] bg-white px-[48px] shadow-[0px_12px_22px_-14px_rgba(18,26,56,0.08)]">
          <div className="flex size-[92px] items-center justify-center rounded-full bg-[#2e569d] text-[30px] font-bold text-white">
            {getInitial(profile?.name)}
          </div>
          <div className="ml-[32px]">
            <h2 className="text-[24px] font-bold leading-[32px] text-[#121a34]">
              {profile?.name ?? '사용자'}
            </h2>
            <p className="mt-[8px] text-[14px] text-[#5c6a84]">
              {profile
                ? `${profile.userLevel} · ${profile.studentId} · ${profile.grade}학년`
                : '프로필 정보를 불러오는 중입니다.'}
            </p>
            <p className="mt-[12px] text-[13px] font-semibold text-[#2e569d]">
              {profile?.githubLink ?? 'GitHub 링크 없음'}
            </p>
          </div>
          <div className="ml-auto flex gap-[10px]">
            <a
              className="flex h-[40px] w-[126px] items-center justify-center rounded-[8px] border border-[#2e569d] bg-white text-[13px] font-semibold text-[#2e569d]"
              href="#profile-edit"
            >
              프로필 수정
            </a>
            <button
              className="flex h-[40px] w-[92px] items-center justify-center rounded-[8px] border border-[#c9d5e7] bg-[#f7fbff] text-[13px] font-semibold text-[#5c6a84] transition hover:bg-[#edf4fd]"
              onClick={() => setIsLogoutModalOpen(true)}
              type="button"
            >
              로그아웃
            </button>
          </div>
        </section>

        <div className="absolute left-[48px] top-[404px] flex h-[58px] w-[1184px] items-center rounded-[12px] border border-[#c9d5e7] bg-white px-[24px]">
          <span className="flex h-[28px] w-[118px] items-center justify-center rounded-[14px] border border-[#c9d5e7] bg-[#e7f0fa] text-[12px] font-semibold text-[#2e569d]">
            내 포트폴리오
          </span>
        </div>

        <div className="absolute left-[48px] top-[494px] space-y-[24px]">
          {errorMessage && (
            <p className="w-[1184px] text-[13px] font-semibold text-[#c7252e]">
              {errorMessage}
            </p>
          )}
          {myPortfolios.map((portfolio) => (
            <article
              className="flex h-[80px] w-[1184px] cursor-pointer items-center rounded-[12px] border border-[#c9d5e7] bg-white px-[22px] transition hover:bg-[#f8fbff]"
              key={portfolio.id}
              onClick={() => toSelectedPortfolioHash(portfolio.id)}
            >
              <span className="w-[60px] text-[14px] font-bold text-[#c7252e]">
                ♥ {portfolio.likeCount}
              </span>
              <div>
                <h3 className="text-[16px] font-semibold text-[#121a34]">
                  {portfolio.projectName}
                </h3>
                <p className="mt-[8px] text-[12px] text-[#5c6a84]">
                  참여자 {portfolio.participantCount}명
                </p>
              </div>
              <button
                className="ml-auto flex h-[40px] w-[64px] items-center justify-center rounded-[8px] border border-[#2e569d] bg-white text-[13px] font-semibold text-[#2e569d]"
                onClick={(event) => {
                  stopCardNavigation(event)
                  toModifyPortfolioHash(portfolio.id)
                }}
                type="button"
              >
                수정
              </button>
              <button
                className="ml-[12px] h-[40px] w-[64px] rounded-[8px] bg-[#b83232] text-[13px] font-semibold text-white"
                onClick={(event) => {
                  stopCardNavigation(event)
                  handleDelete(portfolio.id)
                }}
                type="button"
              >
                삭제
              </button>
            </article>
          ))}
        </div>

        {isLogoutModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#121a34]/45 px-[24px]">
            <section
              aria-modal="true"
              className="w-[392px] rounded-[18px] border border-[#d8e2f0] bg-white px-[28px] py-[26px] shadow-[0px_24px_54px_-20px_rgba(18,26,52,0.45)]"
              role="dialog"
            >
              <div className="mx-auto flex size-[48px] items-center justify-center rounded-full bg-[#edf4fd] text-[22px] font-bold text-[#2e569d]">
                i
              </div>
              <h2 className="mt-[18px] text-center text-[20px] font-bold leading-[30px] text-[#121a34]">
                로그아웃하시겠습니까?
              </h2>
              <p className="mt-[10px] text-center text-[13px] leading-[21px] text-[#5c6a84]">
                현재 세션이 종료되고 로그인 화면으로 이동합니다.
              </p>
              <div className="mt-[24px] flex gap-[10px]">
                <button
                  className="h-[42px] flex-1 rounded-[8px] border border-[#c9d5e7] bg-white text-[13px] font-semibold text-[#2e569d] hover:bg-[#f3f7fc]"
                  disabled={isLoggingOut}
                  onClick={() => setIsLogoutModalOpen(false)}
                  type="button"
                >
                  취소
                </button>
                <button
                  className="h-[42px] flex-1 rounded-[8px] bg-[#2e569d] text-[13px] font-semibold text-white shadow-[0px_8px_16px_-8px_rgba(46,86,157,0.35)] disabled:bg-[#9db4d7]"
                  disabled={isLoggingOut}
                  onClick={handleLogout}
                  type="button"
                >
                  {isLoggingOut ? '로그아웃 중' : '로그아웃'}
                </button>
              </div>
            </section>
          </div>
        )}
      </section>
    </main>
  )
}

export default MyPage
