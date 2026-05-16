import { type FormEvent, useState } from 'react'
import { authApi, type UserLevel } from '../../../services/api'

const userTypes = ['Student 학생', 'Professor 교수', 'Admin 관리자']
const userLevelByLabel: Record<string, UserLevel> = {
  'Admin 관리자': 'ADMIN',
  'Professor 교수': 'PROFESSOR',
  'Student 학생': 'STUDENT',
}

function SignUpPage() {
  const [form, setForm] = useState({
    githubLink: '',
    grade: '1',
    name: '',
    studentId: '',
  })
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedUserType, setSelectedUserType] = useState(userTypes[0])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage('')

    if (!/^\d{9}$/.test(form.studentId)) {
      setErrorMessage('학번은 9자리 숫자여야 합니다')
      return
    }

    setIsSubmitting(true)

    try {
      await authApi.register({
        githubLink: form.githubLink || undefined,
        grade: Number(form.grade),
        name: form.name,
        studentId: form.studentId,
        userLevel: userLevelByLabel[selectedUserType],
      })
      window.location.hash = 'main'
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : '회원가입 중 오류가 발생했습니다',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen overflow-auto bg-[#f3f7fc]">
      <section
        className="relative mx-auto h-[892px] w-[1280px] bg-[#f3f7fc]"
        data-name="02 Sign Up"
        data-node-id="38:22"
      >
        <form
          className="absolute left-[274px] top-[53px] h-[786px] w-[731px] rounded-[22px] border border-[#c9d5e7] bg-white px-[60px] pt-[62px] shadow-[0px_18px_28px_-16px_rgba(13,20,46,0.12)]"
          onSubmit={handleSubmit}
        >
          <h1 className="text-[30px] font-bold leading-[40px] text-[#121a34]">
            회원가입
          </h1>
          <p className="mt-[4px] text-[14px] leading-[24px] text-[#5c6a84]">
            가천대 컴퓨터공학부 프로젝트 커뮤니티에 참여하세요.
          </p>

          <div className="mt-[31px] grid grid-cols-2 gap-x-[40px] gap-y-[24px]">
            <Field
              label="이름"
              onChange={(value) => setForm((current) => ({ ...current, name: value }))}
              placeholder="김진우"
              value={form.name}
            />
            <Field
              label="학년"
              onChange={(value) => setForm((current) => ({ ...current, grade: value }))}
              placeholder="1"
              type="number"
              value={form.grade}
            />
            <Field
              label="학번"
              onChange={(value) =>
                setForm((current) => ({ ...current, studentId: value }))
              }
              placeholder="학번 9자리"
              value={form.studentId}
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
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  githubLink: event.target.value,
                }))
              }
              placeholder="https://github.com/username"
              type="url"
              value={form.githubLink}
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

          {errorMessage && (
            <p className="mt-[14px] text-[12px] font-semibold text-[#c7252e]">
              {errorMessage}
            </p>
          )}

          <button
            className="mt-[28px] flex h-[40px] w-[600px] items-center justify-center rounded-[8px] bg-[#e2842a] text-[13px] font-semibold text-white transition hover:bg-[#cf761f]"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? '가입 중...' : '가입하기'}
          </button>
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
  onChange: (value: string) => void
  placeholder: string
  type?: string
  value: string
}

function Field({ label, onChange, placeholder, type = 'text', value }: FieldProps) {
  return (
    <div className="h-[76px]">
      <label className="text-[12px] font-semibold leading-[18px] text-[#121a34]">
        {label}
      </label>
      <input
        className="mt-[9px] h-[44px] w-[280px] rounded-[8px] border border-[#c9d5e7] bg-white px-[14px] text-[13px] text-[#5c6a84] outline-none transition focus:border-[#2e569d]"
        max={type === 'number' ? 4 : undefined}
        min={type === 'number' ? 1 : undefined}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        type={type}
        value={value}
      />
    </div>
  )
}

export default SignUpPage
