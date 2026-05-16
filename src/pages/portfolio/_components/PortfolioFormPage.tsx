import { type ChangeEvent, useMemo, useState } from 'react'
import DashboardHeader from '../../../widgets/header/DashboardHeader'

const imgHeaderLogoMark =
  'https://www.figma.com/api/mcp/asset/9e3de58f-437b-4576-9f09-d7eb1bfcb00d'

interface PortfolioFormPageProps {
  mode: 'create' | 'modify'
}

interface Participant {
  id: number
  name: string
  role: string
  fixed?: boolean
}

const categories = ['졸업 프로젝트', 'P-프로젝트', '자율 프로젝트']
const roles = ['Frontend', 'Backend', 'AI / Data', 'Design', 'DevOps', 'PM']
const defaultMarkdown = `# 프로젝트 개요
## 문제 상황
- GitHub PR 리뷰 과정에서 반복되는 코멘트 작성 시간이 길어졌습니다.

## 핵심 기능
- PR 변경 사항 분석
- 리뷰 코멘트 초안 생성
- 팀별 리뷰 기록 관리

## 실행 화면
![서비스 미리보기](https://placehold.co/640x360)

## 기대 효과
- 리뷰 시간을 줄이고 코드 품질을 일정하게 유지합니다.`

function PortfolioFormPage({ mode }: PortfolioFormPageProps) {
  const isModify = mode === 'modify'
  const [category, setCategory] = useState(categories[0])
  const [markdown, setMarkdown] = useState(defaultMarkdown)
  const [stackInput, setStackInput] = useState('')
  const [techStacks, setTechStacks] = useState(['React', 'Spring', 'GPT API'])
  const [startDate, setStartDate] = useState('2026-05-01')
  const [endDate, setEndDate] = useState('2026-06-10')
  const [newParticipantName, setNewParticipantName] = useState('')
  const [participants, setParticipants] = useState<Participant[]>([
    { id: 1, name: '김진우', role: 'Frontend', fixed: true },
    { id: 2, name: '이서연', role: 'Backend' },
    { id: 3, name: '박민재', role: 'AI / Data' },
  ])

  const renderedMarkdown = useMemo(() => renderMarkdown(markdown), [markdown])

  const addTechStack = () => {
    const nextStack = stackInput.trim()

    if (!nextStack || techStacks.includes(nextStack)) {
      return
    }

    setTechStacks((current) => [...current, nextStack])
    setStackInput('')
  }

  const addParticipant = () => {
    const nextName = newParticipantName.trim()

    if (!nextName) {
      return
    }

    setParticipants((current) => [
      ...current,
      { id: Date.now(), name: nextName, role: roles[0] },
    ])
    setNewParticipantName('')
  }

  const updateParticipantRole = (id: number, role: string) => {
    setParticipants((current) =>
      current.map((participant) =>
        participant.id === id ? { ...participant, role } : participant,
      ),
    )
  }

  return (
    <main className="min-h-screen overflow-auto bg-[#f3f7fc]">
      <section
        className="relative mx-auto h-[1530px] w-[1280px] bg-[#f3f7fc]"
        data-name={isModify ? '07 Portfolio Modify' : '05 Portfolio Create'}
      >
        <DashboardHeader active="portfolio" logo={imgHeaderLogoMark} />

        <div className="absolute left-[48px] top-[103px]">
          <h1 className="text-[28px] font-bold leading-[42px] text-[#121a34]">
            {isModify ? '포트폴리오 수정' : '포트폴리오 작성'}
          </h1>
          <p className="text-[14px] leading-[24px] text-[#5c6a84]">
            {isModify
              ? '기존 포트폴리오 정보를 수정하고 변경 내용을 확인합니다.'
              : '프로젝트 정보, 참여자, 기술 스택을 입력해 포트폴리오를 등록합니다.'}
          </p>
        </div>

        <form className="absolute left-[48px] top-[184px] h-[1308px] w-[1184px] rounded-[18px] border border-[#c9d5e7] bg-white">
          <h2 className="absolute left-[40px] top-[41px] text-[19px] font-bold leading-[28px] text-[#121a34]">
            기본 정보
          </h2>

          <TextField
            className="absolute left-[40px] top-[91px]"
            label="프로젝트명"
            placeholder="프로젝트명을 입력하세요"
            value={isModify ? 'AI 코드 리뷰 도우미' : ''}
            width="w-[500px]"
          />
          <TextField
            className="absolute left-[40px] top-[182px]"
            label="프로젝트 요약"
            placeholder="프로젝트를 한 줄로 소개하세요"
            value={isModify ? 'PR을 분석하고 리뷰 코멘트를 생성합니다' : ''}
            width="w-[500px]"
          />

          <button
            className="absolute left-[600px] top-[90px] flex h-[234px] w-[504px] flex-col items-center justify-center rounded-[14px] border border-[#c9d5e7] bg-[#e7f0fa]"
            type="button"
          >
            <span className="text-[34px] font-bold text-[#2e569d]">+</span>
            <span className="mt-[12px] text-[13px] font-medium text-[#5c6a84]">
              대표 이미지 업로드 · PNG/JPG 5MB 이하
            </span>
          </button>

          <div className="absolute left-[40px] top-[272px]">
            <p className="text-[13px] font-semibold text-[#102047]">
              프로젝트 카테고리
            </p>
            <div className="mt-[10px] flex h-[38px] w-[455px] items-center gap-[10px] rounded-[12px] border border-[#d4e1f2] bg-[#f3f7fc] px-[8px]">
              {categories.map((item) => (
                <button
                  className={[
                    'h-[26px] w-[138px] rounded-[10px] text-[12px] font-semibold transition',
                    category === item
                      ? 'bg-[#2e569d] text-white shadow-[0px_6px_12px_-8px_rgba(46,86,157,0.45)]'
                      : 'border border-[#d4e1f2] bg-white text-[#2e569d] hover:bg-[#edf4fd]',
                  ].join(' ')}
                  key={item}
                  onClick={() => setCategory(item)}
                  type="button"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="absolute left-[40px] top-[348px] grid w-[1064px] grid-cols-[320px_320px_376px] gap-[24px]">
            <TextField
              label="GitHub 링크"
              placeholder="https://github.com/username/repository"
              value={isModify ? 'https://github.com/team/project' : ''}
              width="w-[320px]"
            />
            <TextField
              label="배포 링크"
              placeholder="https://project.example.com"
              value={isModify ? 'https://project.vercel.app' : ''}
              width="w-[320px]"
            />
            <div>
              <span className="block text-[12px] font-semibold leading-[18px] text-[#121a34]">
                개발 기간
              </span>
              <div className="mt-[9px] flex h-[44px] w-[376px] items-center rounded-[8px] border border-[#c9d5e7] bg-white px-[12px]">
                <DateInput
                  ariaLabel="개발 시작일"
                  value={startDate}
                  onChange={(event) => setStartDate(event.target.value)}
                />
                <span className="mx-[10px] text-[12px] font-semibold text-[#8a97ad]">
                  ~
                </span>
                <DateInput
                  ariaLabel="개발 종료일"
                  value={endDate}
                  onChange={(event) => setEndDate(event.target.value)}
                />
              </div>
            </div>
          </div>

          <section className="absolute left-[40px] top-[451px] h-[134px] w-[1064px] rounded-[14px] border border-[#d4e1f2] bg-[#fafcff] p-[18px]">
            <div className="flex items-end gap-[12px]">
              <label>
                <span className="block text-[12px] font-semibold leading-[18px] text-[#121a34]">
                  사용 기술 스택
                </span>
                <div className="mt-[9px] flex h-[42px] w-[420px] overflow-hidden rounded-[8px] border border-[#c9d5e7] bg-white">
                  <input
                    className="h-full flex-1 px-[14px] text-[13px] text-[#5c6a84] outline-none placeholder:text-[#9ca8ba]"
                    onChange={(event) => setStackInput(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        event.preventDefault()
                        addTechStack()
                      }
                    }}
                    placeholder="예: React"
                    value={stackInput}
                  />
                  <button
                    className="h-full w-[42px] border-l border-[#d4e1f2] text-[20px] font-semibold text-[#2e569d] hover:bg-[#edf4fd]"
                    onClick={addTechStack}
                    type="button"
                  >
                    +
                  </button>
                </div>
              </label>
              <div className="flex max-h-[74px] flex-1 flex-wrap content-start gap-[8px] overflow-y-auto pr-[4px]">
                {techStacks.map((stack) => (
                  <span
                    className="flex h-[28px] items-center gap-[8px] rounded-full border border-[#c9d9ee] bg-[#edf4fd] px-[12px] text-[12px] font-semibold text-[#2e569d]"
                    key={stack}
                  >
                    {stack}
                    <button
                      className="text-[14px] leading-none text-[#61708a]"
                      onClick={() =>
                        setTechStacks((current) =>
                          current.filter((item) => item !== stack),
                        )
                      }
                      type="button"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </section>

          <p className="absolute left-[40px] top-[626px] text-[12px] font-semibold text-[#121a34]">
            프로젝트 상세 설명
          </p>
          <section className="absolute left-[40px] top-[657px] h-[419px] w-[1064px] rounded-[12px] border border-[#c9d9ee] bg-white shadow-[0px_10px_20px_-10px_rgba(46,86,157,0.06)]">
            <p className="absolute left-[18px] top-[21px] text-[12px] font-semibold text-[#2e569d]">
              Markdown 입력
            </p>
            <p className="absolute left-[566px] top-[21px] text-[12px] font-semibold text-[#2e569d]">
              미리보기
            </p>
            <textarea
              className="absolute left-[16px] top-[48px] h-[351px] w-[484px] resize-none rounded-[10px] border border-[#dde7f3] bg-[#fafcff] p-[18px] text-[13px] leading-[20px] text-[#61708a] outline-none placeholder:text-[#9ca8ba] focus:border-[#2e569d]"
              onChange={(event) => setMarkdown(event.target.value)}
              placeholder="# 프로젝트 개요&#10;- 상세 설명을 마크다운으로 입력하세요"
              value={markdown}
            />
            <div className="absolute left-[532px] top-[48px] h-[351px] w-px bg-[#dde7f3]" />
            <div className="absolute left-[564px] top-[48px] h-[351px] w-[484px] overflow-y-auto rounded-[10px] border border-[#dde7f3] bg-white p-[18px]">
              {renderedMarkdown}
            </div>
          </section>

          <section className="absolute left-[40px] top-[1114px] h-[120px] w-[1064px] rounded-[14px] border border-[#d4e1f2] bg-[#fafcff] px-[16px] py-[12px]">
            <div className="flex items-start gap-[12px]">
              <label>
                <span className="block text-[12px] font-semibold leading-[18px] text-[#121a34]">
                  참여자
                </span>
                <input
                  className="mt-[7px] h-[38px] w-[240px] rounded-[8px] border border-[#c9d5e7] bg-white px-[12px] text-[13px] text-[#5c6a84] outline-none placeholder:text-[#9ca8ba] focus:border-[#2e569d]"
                  onChange={(event) => setNewParticipantName(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault()
                      addParticipant()
                    }
                  }}
                  placeholder="참여자 이름 입력"
                  value={newParticipantName}
                />
              </label>
              <button
                className="mt-[25px] h-[38px] w-[96px] rounded-[8px] border border-[#5f99f5] bg-[#edf4fd] text-[12px] font-semibold text-[#2e569d] hover:bg-[#e1edff]"
                onClick={addParticipant}
                type="button"
              >
                + 참여자 추가
              </button>
              <div className="mt-[25px] flex max-h-[70px] flex-1 flex-wrap gap-[8px] overflow-y-auto pr-[4px]">
                {participants.map((participant) => (
                  <ParticipantChip
                    key={participant.id}
                    participant={participant}
                    onRemove={() =>
                      setParticipants((current) =>
                        current.filter((item) => item.id !== participant.id),
                      )
                    }
                    onRoleChange={(role) =>
                      updateParticipantRole(participant.id, role)
                    }
                  />
                ))}
              </div>
            </div>
          </section>

          <a
            className="absolute left-[872px] top-[1252px] flex h-[40px] w-[112px] items-center justify-center rounded-[8px] border border-[#2e569d] bg-white text-[13px] font-semibold text-[#2e569d]"
            href="#portfolio"
          >
            취소
          </a>
          <a
            className="absolute left-[1000px] top-[1252px] flex h-[40px] w-[136px] items-center justify-center rounded-[8px] bg-[#e2842a] text-[13px] font-semibold text-white"
            href="#portfolio-detail"
          >
            {isModify ? '수정하기' : '등록하기'}
          </a>
        </form>
      </section>
    </main>
  )
}

interface TextFieldProps {
  className?: string
  label: string
  placeholder: string
  value: string
  width: string
}

function TextField({ className, label, placeholder, value, width }: TextFieldProps) {
  return (
    <label className={className}>
      <span className="block text-[12px] font-semibold leading-[18px] text-[#121a34]">
        {label}
      </span>
      <input
        className={`mt-[9px] h-[44px] ${width} rounded-[8px] border border-[#c9d5e7] bg-white px-[14px] text-[13px] text-[#5c6a84] outline-none placeholder:text-[#9ca8ba] focus:border-[#2e569d]`}
        defaultValue={value}
        placeholder={placeholder}
      />
    </label>
  )
}

interface DateInputProps {
  ariaLabel: string
  value: string
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
}

function DateInput({ ariaLabel, value, onChange }: DateInputProps) {
  return (
    <input
      aria-label={ariaLabel}
      className="h-[34px] w-[154px] rounded-[6px] bg-[#f7fbff] px-[8px] text-[12px] font-semibold text-[#5c6a84] outline-none"
      onChange={onChange}
      type="date"
      value={value}
    />
  )
}

interface ParticipantChipProps {
  participant: Participant
  onRemove: () => void
  onRoleChange: (role: string) => void
}

function ParticipantChip({
  participant,
  onRemove,
  onRoleChange,
}: ParticipantChipProps) {
  return (
    <article
      className={[
        'flex h-[52px] items-center gap-[8px] rounded-[12px] border bg-white px-[10px]',
        participant.fixed
          ? 'border-[#5f99f5] shadow-[0px_8px_16px_-12px_rgba(46,86,157,0.25)]'
          : 'border-[#c9d9ee]',
      ].join(' ')}
    >
      <strong className="max-w-[78px] truncate text-[13px] font-semibold text-[#102047]">
        {participant.name}
      </strong>
      <select
        className="h-[28px] rounded-[7px] border border-[#dde7f3] bg-[#f3f7fc] px-[8px] text-[11px] font-semibold text-[#2e569d] outline-none"
        onChange={(event) => onRoleChange(event.target.value)}
        value={participant.role}
      >
        {roles.map((role) => (
          <option key={role} value={role}>
            {role}
          </option>
        ))}
      </select>
      {!participant.fixed && (
        <button
          className="text-[15px] font-semibold leading-none text-[#9ca8ba]"
          onClick={onRemove}
          type="button"
        >
          ×
        </button>
      )}
    </article>
  )
}

function renderMarkdown(markdown: string) {
  const lines = markdown.split('\n')

  return lines.map((line, index) => {
    const imageMatch = line.match(/^!\[(.*)]\((.*)\)$/)

    if (imageMatch) {
      return (
        <figure className="my-[14px]" key={`${line}-${index}`}>
          <img
            alt={imageMatch[1]}
            className="max-h-[160px] w-full rounded-[10px] object-cover"
            src={imageMatch[2]}
          />
        </figure>
      )
    }

    if (line.startsWith('# ')) {
      return (
        <h1
          className="mb-[12px] mt-[2px] text-[19px] font-bold text-[#121a34]"
          key={`${line}-${index}`}
        >
          {line.replace('# ', '')}
        </h1>
      )
    }

    if (line.startsWith('## ')) {
      return (
        <h2
          className="mb-[8px] mt-[16px] text-[15px] font-bold text-[#102047]"
          key={`${line}-${index}`}
        >
          {line.replace('## ', '')}
        </h2>
      )
    }

    if (line.startsWith('- ')) {
      return (
        <p
          className="mb-[6px] pl-[10px] text-[12px] leading-[20px] text-[#61708a]"
          key={`${line}-${index}`}
        >
          • {line.replace('- ', '')}
        </p>
      )
    }

    if (!line.trim()) {
      return <div className="h-[6px]" key={`empty-${index}`} />
    }

    return (
      <p
        className="mb-[8px] text-[12px] leading-[20px] text-[#61708a]"
        key={`${line}-${index}`}
      >
        {line}
      </p>
    )
  })
}

export default PortfolioFormPage
