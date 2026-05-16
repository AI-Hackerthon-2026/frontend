import { useState } from 'react'

const userTypes = ['Student 학생', 'Professor 교수', 'Admin 관리자']

function SignUpPage() {
  const [selectedUserType, setSelectedUserType] = useState(userTypes[0])

  return (
    <main className="min-h-screen overflow-auto bg-[#f3f7fc]">
      <section
        className="relative mx-auto h-[892px] w-[1280px] bg-[#f3f7fc]"
        data-name="02 Sign Up"
        data-node-id="38:22"
      >
        <form className="absolute left-[274px] top-[53px] h-[786px] w-[731px] rounded-[22px] border border-[#c9d5e7] bg-white px-[60px] pt-[62px] shadow-[0px_18px_28px_-16px_rgba(13,20,46,0.12)]">
          <h1 className="text-[30px] font-bold leading-[40px] text-[#121a34]">
            회원가입
          </h1>
          <p className="mt-[4px] text-[14px] leading-[24px] text-[#5c6a84]">
            가천대 컴퓨터공학부 프로젝트 커뮤니티에 참여하세요.
          </p>

          <div className="mt-[31px] grid grid-cols-2 gap-x-[40px] gap-y-[24px]">
            <Field label="아이디" placeholder="아이디" type="email" />
            <Field label="이름" placeholder="김진우" />
            <Field label="학년" placeholder="3학년" />
            <Field label="학번" placeholder="학번 9자리" />
            <Field label="비밀번호" placeholder="8자 이상" type="password" />
            <Field
              label="비밀번호 확인"
              placeholder="비밀번호 재입력"
              type="password"
            />
          </div>

          <div className="mt-[28px]">
            <label
              className="text-[12px] font-semibold leading-[18px] text-[#121a34]"
              htmlFor="github"
            >
              GitHub 링크
            </label>
            <input
              className="mt-[9px] h-[44px] w-[600px] rounded-[8px] border border-[#c9d5e7] px-[14px] text-[13px] text-[#5c6a84] outline-none transition focus:border-[#2e569d]"
              id="github"
              placeholder="https://github.com/username"
              type="url"
            />
          </div>

          <div className="mt-[26px]">
            <p className="text-[13px] font-semibold text-[#102047]">
              사용자 유형
            </p>
            <div className="mt-[13px] flex h-[48px] w-[600px] items-center gap-[12px] rounded-[12px] border border-[#d4e1f2] bg-[#f3f7fc] px-[8px]">
              {userTypes.map((type) => {
                const isSelected = selectedUserType === type

                return (
                  <button
                    aria-pressed={isSelected}
                    className={[
                      'h-[32px] w-[180px] rounded-[10px] text-[12px] font-semibold transition',
                      isSelected
                        ? 'bg-[#2e569d] text-white'
                        : 'border border-[#d4e1f2] bg-white text-[#2e569d] hover:bg-[#edf4fd]',
                    ].join(' ')}
                    key={type}
                    onClick={() => setSelectedUserType(type)}
                    type="button"
                  >
                    {type}
                  </button>
                )
              })}
            </div>
          </div>

          <a
            className="mt-[28px] flex h-[40px] w-[600px] items-center justify-center rounded-[8px] bg-[#e2842a] text-[13px] font-semibold text-white transition hover:bg-[#cf761f]"
            href="#main"
          >
            가입하기
          </a>
          <a
            className="mt-[22px] block w-[600px] text-center text-[13px] font-semibold leading-[22px] text-[#2e569d]"
            href="#login"
          >
            로그인으로 돌아가기
          </a>
        </form>
      </section>
    </main>
  )
}

interface FieldProps {
  label: string
  placeholder: string
  type?: string
}

function Field({ label, placeholder, type = 'text' }: FieldProps) {
  return (
    <div className="h-[76px]">
      <label className="text-[12px] font-semibold leading-[18px] text-[#121a34]">
        {label}
      </label>
      <input
        className="mt-[9px] h-[44px] w-[280px] rounded-[8px] border border-[#c9d5e7] bg-white px-[14px] text-[13px] text-[#5c6a84] outline-none transition focus:border-[#2e569d]"
        placeholder={placeholder}
        type={type}
      />
    </div>
  )
}

export default SignUpPage
