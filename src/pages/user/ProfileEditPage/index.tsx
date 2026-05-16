import { type FormEvent, useEffect, useState } from 'react'
import { userApi } from '../../../services/api'
import { userLevelLabels } from '../../../services/portfolioMapper'
import DashboardHeader from '../../../widgets/header/DashboardHeader'

const imgHeaderLogoMark =
  'https://www.figma.com/api/mcp/asset/7d2eeb11-5bef-4541-bd2f-3c6ad5cc43dd'

function ProfileEditPage() {
  const [errorMessage, setErrorMessage] = useState('')
  const [form, setForm] = useState({
    githubLink: '',
    grade: '1',
    name: '',
    portalId: '',
    studentId: '',
    userType: 'Student 학생',
  })
  const [successMessage, setSuccessMessage] = useState('')

  const updateGrade = (nextGrade: number) => {
    const safeGrade = Math.min(4, Math.max(1, nextGrade))
    setForm((current) => ({ ...current, grade: String(safeGrade) }))
  }

  useEffect(() => {
    const loadProfile = async () => {
      setErrorMessage('')

      try {
        const profile = await userApi.getMe()
        setForm({
          githubLink: profile.githubLink ?? '',
          grade: String(profile.grade),
          name: profile.name,
          portalId: profile.portalId,
          studentId: profile.studentId,
          userType: userLevelLabels[profile.userLevel],
        })
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : '프로필을 불러오지 못했습니다.',
        )
      }
    }

    loadProfile()
  }, [])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage('')
    setSuccessMessage('')

    if (!form.name.trim()) {
      setErrorMessage('이름은 필수 입력 항목입니다')
      return
    }

    try {
      await userApi.updateMe({
        githubLink: form.githubLink || undefined,
        grade: Number(form.grade),
        name: form.name,
      })
      setSuccessMessage('프로필이 수정되었습니다')
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : '프로필 수정에 실패했습니다.',
      )
    }
  }

  return (
    <main className="min-h-screen overflow-auto bg-[#f3f7fc]">
      <section
        className="relative mx-auto h-screen w-[1280px] overflow-hidden rounded-[18px] border border-[#d1d8e3] bg-[#f3f7fc]"
        data-name="08 Ranking Awards"
        data-node-id="1:206"
      >
        <DashboardHeader active="mypage" logo={imgHeaderLogoMark} />

        <div className="absolute left-[47px] top-[90px]">
          <h1 className="text-[28px] font-bold leading-[42px] text-[#121a34]">
            프로필 수정
          </h1>
          <p className="mt-[1px] text-[14px] leading-[24px] text-[#5c6a84]">
            학번과 사용자 유형은 변경할 수 없고, 이름과 관심 분야를 업데이트할 수 있습니다.
          </p>
        </div>

        <form
          className="absolute left-[240px] top-[168px] h-[560px] w-[800px] rounded-[18px] border border-[#c9d5e7] bg-white"
          onSubmit={handleSubmit}
        >
          <ProfileField
            className="absolute left-[60px] top-[61px]"
            label="이름"
            onChange={(value) => setForm((current) => ({ ...current, name: value }))}
            placeholder="이름을 입력하세요"
            value={form.name}
            width="w-[300px]"
          />
          <ProfileField
            className="absolute left-[420px] top-[61px]"
            label="아이디"
            placeholder="아이디"
            readOnly
            value={form.portalId}
            width="w-[300px]"
          />
          <GradeField
            className="absolute left-[60px] top-[171px]"
            onDecrease={() => updateGrade(Number(form.grade) - 1)}
            onIncrease={() => updateGrade(Number(form.grade) + 1)}
            value={form.grade}
          />
          <ProfileField
            className="absolute left-[420px] top-[171px]"
            label="학번"
            placeholder="학번을 입력하세요"
            value={form.studentId}
            width="w-[300px]"
          />
          <ProfileField
            className="absolute left-[60px] top-[281px]"
            label="GitHub 링크"
            onChange={(value) =>
              setForm((current) => ({ ...current, githubLink: value }))
            }
            placeholder="https://github.com/username"
            value={form.githubLink}
            width="w-[660px]"
          />

          <label className="absolute left-[60px] top-[391px]">
            <span className="block text-[13px] font-semibold leading-[18px] text-[#102047]">
              사용자 유형
            </span>
            <input
              className="mt-[13px] h-[52px] w-[300px] rounded-[10px] border border-[#c9d9ee] bg-[#edf4fd] px-[14px] text-[14px] font-semibold text-[#2e569d] outline-none"
              value={form.userType}
              disabled
              readOnly
            />
          </label>

          {(errorMessage || successMessage) && (
            <p
              className={[
                'absolute left-[60px] top-[486px] text-[12px] font-semibold',
                errorMessage ? 'text-[#c7252e]' : 'text-[#2e7d32]',
              ].join(' ')}
            >
              {errorMessage || successMessage}
            </p>
          )}

          <a
            className="absolute left-[460px] top-[506px] flex h-[40px] w-[120px] items-center justify-center rounded-[8px] border border-[#2e569d] bg-white text-[13px] font-semibold text-[#2e569d]"
            href="#mypage"
          >
            취소
          </a>
          <button
            className="absolute left-[600px] top-[506px] flex h-[40px] w-[120px] items-center justify-center rounded-[8px] bg-[#e2842a] text-[13px] font-semibold text-white"
            type="submit"
          >
            저장
          </button>
        </form>
      </section>
    </main>
  )
}

interface GradeFieldProps {
  className?: string
  onDecrease: () => void
  onIncrease: () => void
  value: string
}

function GradeField({
  className,
  onDecrease,
  onIncrease,
  value,
}: GradeFieldProps) {
  return (
    <label className={className}>
      <span className="block text-[12px] font-semibold leading-[18px] text-[#121a34]">
        학년
      </span>
      <div className="mt-[9px] flex h-[44px] w-[300px] overflow-hidden rounded-[8px] border border-[#c9d5e7] bg-white">
        <button
          className="flex h-full w-[44px] items-center justify-center border-r border-[#d4e1f2] text-[18px] font-semibold text-[#2e569d] transition hover:bg-[#edf4fd] disabled:text-[#9ca8ba]"
          disabled={Number(value) <= 1}
          onClick={onDecrease}
          type="button"
        >
          -
        </button>
        <input
          className="h-full flex-1 px-[14px] text-center text-[13px] font-semibold text-[#5c6a84] outline-none"
          readOnly
          value={`${value}학년`}
        />
        <button
          className="flex h-full w-[44px] items-center justify-center border-l border-[#d4e1f2] text-[18px] font-semibold text-[#2e569d] transition hover:bg-[#edf4fd] disabled:text-[#9ca8ba]"
          disabled={Number(value) >= 4}
          onClick={onIncrease}
          type="button"
        >
          +
        </button>
      </div>
    </label>
  )
}

interface ProfileFieldProps {
  className?: string
  label: string
  onChange?: (value: string) => void
  placeholder: string
  readOnly?: boolean
  value: string
  width: string
}

function ProfileField({
  className,
  label,
  onChange,
  placeholder,
  readOnly = false,
  value,
  width,
}: ProfileFieldProps) {
  return (
    <label className={className}>
      <span className="block text-[12px] font-semibold leading-[18px] text-[#121a34]">
        {label}
      </span>
      <input
        className={[
          'mt-[9px] h-[44px] rounded-[8px] px-[14px] text-[13px] text-[#5c6a84] outline-none placeholder:text-[#9ca8ba]',
          width,
          readOnly
            ? 'border border-[#c9d5e7] bg-[#e7f0fa]'
            : 'border border-[#c9d5e7] bg-white focus:border-[#2e569d]',
        ].join(' ')}
        onChange={(event) => onChange?.(event.target.value)}
        placeholder={placeholder}
        readOnly={readOnly}
        value={value}
      />
    </label>
  )
}

export default ProfileEditPage
