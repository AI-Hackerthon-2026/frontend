import { type FormEvent, useState } from 'react'
import { authApi } from '../../../services/api'

const imgHeaderLogoMark =
  'https://www.figma.com/api/mcp/asset/078a6be5-34dd-4cf0-899c-c6ba59d19b9a'
const imgLoginHeroGridLine =
  'https://www.figma.com/api/mcp/asset/43f7fcd2-8536-4ab7-8a66-a6215f519bb0'
const imgLoginHeroVerticalLine =
  'https://www.figma.com/api/mcp/asset/34e6a2e2-4127-471b-befb-27fa7c61f0fb'

function LoginPage() {
  const [portalId, setPortalId] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage('')
    setIsSubmitting(true)

    try {
      const user = await authApi.login({ password, portalId })
      window.location.hash = user.firstLogin ? 'signup' : 'main'
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : '아이디 또는 비밀번호가 올바르지 않습니다',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="flex h-screen items-center justify-center overflow-hidden bg-[#f3f7fc]">
      <section
        className="relative h-[928px] w-[1280px] shrink-0 scale-[min(100vw/1280,100vh/928)] bg-[#f3f7fc]"
        data-name="01 Login"
        data-node-id="38:2"
      >
        <div className="absolute left-[48px] top-[104px] h-[720px] w-[1184px] rounded-[24px] bg-[#2e569d] shadow-[0px_24px_40px_-18px_rgba(13,20,46,0.18)]" />
        <div className="absolute left-[80px] top-[136px] h-[656px] w-[520px] rounded-[20px] bg-gradient-to-r from-[#1b2451] via-[#253e86] via-[56%] to-[#2e569d] shadow-[0px_20px_34px_-18px_rgba(8,13,36,0.28)]" />

        <div className="absolute left-[418px] top-[186px] size-[160px] rounded-[80px] bg-[rgba(98,183,230,0.16)]" />
        <div className="absolute left-[106px] top-[636px] size-[94px] rounded-[47px] bg-[rgba(226,132,42,0.16)]" />

        {[522, 558, 594, 630, 666, 702].map((top) => (
          <div
            className="absolute left-[124px] h-0 w-[376px]"
            key={top}
            style={{ top }}
          >
            <div className="absolute inset-[-1px_0_0_0]">
              <img
                alt=""
                className="block size-full max-w-none"
                src={imgLoginHeroGridLine}
              />
            </div>
          </div>
        ))}
        {[156, 224, 292, 360, 428].map((left) => (
          <div
            className="absolute top-[458px] flex h-0 w-[228px] items-center justify-center"
            key={left}
            style={{ left }}
          >
            <div className="-rotate-90 flex-none">
              <div className="relative h-[228px] w-0">
                <div className="absolute bottom-full left-0 right-0 top-[-0.44%]">
                  <img
                    alt=""
                    className="block size-full max-w-none"
                    src={imgLoginHeroVerticalLine}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}

        <div className="absolute left-[124px] top-[163px] h-[54px] w-[64px] rounded-[14px] bg-[rgba(255,255,255,0.96)] shadow-[0px_10px_18px_-10px_rgba(8,13,36,0.18)]" />
        <img
          alt="Gachon Bridge"
          className="absolute left-[134px] top-[173px] h-[34px] w-[44px] object-contain"
          src={imgHeaderLogoMark}
        />

        <div className="absolute left-[124px] top-[279px] h-[30px] w-[138px] rounded-[15px] border border-white bg-[rgba(255,255,255,0.14)]" />
        <p className="absolute left-[140px] top-[284px] flex h-[20px] w-[106px] items-center justify-center text-center text-[12px] font-semibold leading-[20px] text-white">
          Gachon Bridge
        </p>
        <h1 className="absolute left-[124px] top-[316px] w-[392px] text-[32px] font-bold leading-[46px] text-white">
          프로젝트의 시작부터
          <br />
          완성작의 인정까지
        </h1>
        <div className="absolute left-[124px] top-[410px] h-[6px] w-[268px] rounded-[3px] bg-[#62b7e6]" />
        <div className="absolute left-[124px] top-[410px] h-[6px] w-[268px] rounded-[3px] bg-[rgba(98,183,230,0.45)] shadow-[0px_0px_14px_0px_rgba(98,183,230,0.55)]" />
        <p className="absolute left-[124px] top-[440px] w-[392px] text-[15px] font-medium leading-[26px] text-[rgba(255,255,255,0.82)]">
          포트폴리오 게시 및 관리, 공감 랭킹까지
          <br />
          가천대 컴공 프로젝트 활동을 한 흐름으로 이어갑니다.
        </p>

        <form
          className="absolute left-[704px] top-[190px] h-[548px] w-[440px] rounded-[20px] border border-[#c9d5e7] bg-white px-[48px] pt-[57px]"
          onSubmit={handleSubmit}
        >
          <h2 className="text-[28px] font-bold leading-[36px] text-[#121a34]">
            로그인
          </h2>
          <p className="mt-[4px] text-[14px] leading-[22px] text-[#5c6a84]">
            학번과 비밀번호로 시작하세요.
          </p>

          <label
            className="mt-[39px] block text-[12px] font-semibold leading-[18px] text-[#121a34]"
            htmlFor="login-id"
          >
            아이디
          </label>
          <input
            className="mt-[9px] h-[44px] w-[344px] rounded-[8px] border border-[#c9d5e7] bg-white px-[14px] text-[13px] text-[#5c6a84] outline-none transition focus:border-[#2e569d]"
            id="login-id"
            placeholder="아이디"
            onChange={(event) => setPortalId(event.target.value)}
            type="text"
            value={portalId}
          />

          <label
            className="mt-[26px] block text-[12px] font-semibold leading-[18px] text-[#121a34]"
            htmlFor="login-password"
          >
            비밀번호
          </label>
          <div className="relative mt-[9px] h-[44px] w-[344px]">
            <input
              className="h-full w-full rounded-[8px] border border-[#c9d5e7] bg-white px-[14px] pr-[46px] text-[13px] text-[#5c6a84] outline-none transition focus:border-[#2e569d]"
              id="login-password"
              placeholder="비밀번호"
              onChange={(event) => setPassword(event.target.value)}
              type={isPasswordVisible ? 'text' : 'password'}
              value={password}
            />
            <button
              aria-label={
                isPasswordVisible ? '비밀번호 숨기기' : '비밀번호 보기'
              }
              className="absolute right-[10px] top-1/2 flex size-[26px] -translate-y-1/2 items-center justify-center rounded-[6px] text-[#5c6a84] transition hover:bg-[#e7f0fa]"
              onClick={() => setIsPasswordVisible((current) => !current)}
              type="button"
            >
              {isPasswordVisible ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>

          {errorMessage && (
            <p className="mt-[14px] text-[12px] font-semibold text-[#c7252e]">
              {errorMessage}
            </p>
          )}

          <button
            className="mt-[45px] flex h-[40px] w-[344px] items-center justify-center rounded-[8px] bg-[#e2842a] text-[13px] font-semibold text-white transition hover:bg-[#cf761f]"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? '로그인 중...' : '로그인'}
          </button>
          <a
            className="mt-[24px] block h-[24px] w-[344px] text-center text-[13px] font-semibold leading-[24px] text-[#2e569d]"
            href="#signup"
          >
            아직 계정이 없나요? 회원가입 하기
          </a>
        </form>
      </section>
    </main>
  )
}

function EyeIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-[18px]"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  )
}

function EyeOffIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-[18px]"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="M3 3l18 18"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
      <path
        d="M10.7 5.2A10.3 10.3 0 0 1 12 5c6 0 9.5 7 9.5 7a16 16 0 0 1-3 3.7M6.1 6.7C3.8 8.3 2.5 12 2.5 12s3.5 7 9.5 7c1.7 0 3.1-.4 4.4-1"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  )
}

export default LoginPage
