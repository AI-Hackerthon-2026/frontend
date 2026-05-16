import { useState } from 'react'
import DashboardHeader from '../../../widgets/header/DashboardHeader'

const imgHeaderLogoMark =
  'https://www.figma.com/api/mcp/asset/7d2eeb11-5bef-4541-bd2f-3c6ad5cc43dd'

const userTypes = ['Student 학생', 'Professor 교수', 'Admin 관리자']

function ProfileEditPage() {
  const [userType, setUserType] = useState(userTypes[0])

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

        <form className="absolute left-[240px] top-[168px] h-[560px] w-[800px] rounded-[18px] border border-[#c9d5e7] bg-white">
          <ProfileField
            className="absolute left-[60px] top-[61px]"
            label="이름"
            placeholder="이름을 입력하세요"
            value="김진우"
            width="w-[300px]"
          />
          <ProfileField
            className="absolute left-[420px] top-[61px]"
            label="아이디"
            placeholder="아이디"
            readOnly
            value="jinwoo743@gachon.ac.kr"
            width="w-[300px]"
          />
          <ProfileField
            className="absolute left-[60px] top-[171px]"
            label="학년"
            placeholder="학년을 입력하세요"
            value="3학년"
            width="w-[300px]"
          />
          <ProfileField
            className="absolute left-[420px] top-[171px]"
            label="학번"
            placeholder="학번을 입력하세요"
            value="202135946"
            width="w-[300px]"
          />
          <ProfileField
            className="absolute left-[60px] top-[281px]"
            label="GitHub 링크"
            placeholder="https://github.com/username"
            value="https://github.com/jinwoo743"
            width="w-[660px]"
          />

          <label className="absolute left-[60px] top-[391px]">
            <span className="block text-[13px] font-semibold leading-[18px] text-[#102047]">
              사용자 유형
            </span>
            <input
              className="mt-[13px] h-[52px] w-[300px] rounded-[10px] border border-[#c9d9ee] bg-[#edf4fd] px-[14px] text-[14px] font-semibold text-[#2e569d] outline-none"
              value={userType}
              disabled
              readOnly
            />
          </label>

          <a
            className="absolute left-[460px] top-[450px] flex h-[40px] w-[120px] items-center justify-center rounded-[8px] border border-[#2e569d] bg-white text-[13px] font-semibold text-[#2e569d]"
            href="#mypage"
          >
            취소
          </a>
          <a
            className="absolute left-[600px] top-[450px] flex h-[40px] w-[120px] items-center justify-center rounded-[8px] bg-[#e2842a] text-[13px] font-semibold text-white"
            href="#mypage"
          >
            저장
          </a>
        </form>
      </section>
    </main>
  )
}

interface ProfileFieldProps {
  className?: string
  label: string
  placeholder: string
  readOnly?: boolean
  value: string
  width: string
}

function ProfileField({
  className,
  label,
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
        defaultValue={value}
        placeholder={placeholder}
        readOnly={readOnly}
      />
    </label>
  )
}

export default ProfileEditPage
