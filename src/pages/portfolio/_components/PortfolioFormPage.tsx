import {
  type ChangeEvent,
  type ClipboardEvent,
  type DragEvent,
  type FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { imageApi, portfolioApi, userApi } from '../../../services/api'
import {
  categoryValues,
  detailToSaveFields,
  getSelectedPortfolioId,
} from '../../../services/portfolioMapper'
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
  userId: number
  fixed?: boolean
}

const categories = ['졸업 프로젝트', 'P-프로젝트', '자율 프로젝트']
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
const maxImageSize = 5 * 1024 * 1024
const roles = ['Frontend', 'Backend', 'AI / Data', 'Design', 'DevOps', 'PM']
const defaultMarkdown = `# 프로젝트 개요

## 문제 상황

## 해결 방법

# 핵심 기능

# 실행 화면

# 기대 효과
`

function PortfolioFormPage({ mode }: PortfolioFormPageProps) {
  const isModify = mode === 'modify'
  const [category, setCategory] = useState(categories[0])
  const [deploymentLink, setDeploymentLink] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [githubLink, setGithubLink] = useState('')
  const [markdown, setMarkdown] = useState(defaultMarkdown)
  const [myRole, setMyRole] = useState('Frontend')
  const [projectName, setProjectName] = useState('')
  const [stackInput, setStackInput] = useState('')
  const [summary, setSummary] = useState('')
  const [techStacks, setTechStacks] = useState<string[]>([])
  const [thumbnailUrl, setThumbnailUrl] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [newParticipantName, setNewParticipantName] = useState('')
  const [participants, setParticipants] = useState<Participant[]>([])
  const markdownTextareaRef = useRef<HTMLTextAreaElement>(null)

  const renderedMarkdown = useMemo(() => renderMarkdown(markdown), [markdown])

  const addTechStack = () => {
    const nextStack = stackInput.trim()

    if (!nextStack || techStacks.includes(nextStack)) {
      return
    }

    setTechStacks((current) => [...current, nextStack])
    setStackInput('')
  }

  useEffect(() => {
    if (!isModify) {
      return
    }

    const loadPortfolio = async () => {
      setErrorMessage('')

      try {
        const portfolio = await portfolioApi.getDetail(getSelectedPortfolioId())
        const fields = detailToSaveFields(portfolio)
        setCategory(categories.find((item) => categoryValues[item] === fields.category) ?? categories[0])
        setDeploymentLink(fields.deploymentLink)
        setGithubLink(fields.githubLink)
        setMarkdown(fields.description)
        setProjectName(fields.projectName)
        setStartDate(fields.startDate)
        setEndDate(fields.endDate)
        setSummary(fields.summary)
        setTechStacks(fields.skills)
        setThumbnailUrl(fields.thumbnailUrl)
        setParticipants(
          portfolio.participants.map((participant) => ({
            fixed: participant.owner,
            id: participant.userId,
            name: participant.name,
            role: participant.role,
            userId: participant.userId,
          })),
        )
        setMyRole(portfolio.participants.find((participant) => participant.owner)?.role ?? 'Frontend')
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : '포트폴리오 정보를 불러오지 못했습니다.',
        )
      }
    }

    loadPortfolio()
  }, [isModify])

  const addParticipant = async () => {
    const nextName = newParticipantName.trim()

    if (!nextName) {
      return
    }

    try {
      const users = await userApi.search(nextName)
      const user = users[0]

      if (!user) {
        setErrorMessage('검색된 참여자가 없습니다.')
        return
      }

      setParticipants((current) => {
        if (current.some((participant) => participant.userId === user.id)) {
          return current
        }

        return [
          ...current,
          {
            id: user.id,
            name: `${user.name} (${user.studentId})`,
            role: roles[0],
            userId: user.id,
          },
        ]
      })
      setNewParticipantName('')
      setErrorMessage('')
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : '참여자 검색에 실패했습니다.',
      )
    }
  }

  const updateParticipantRole = (id: number, role: string) => {
    setParticipants((current) =>
      current.map((participant) =>
        participant.id === id ? { ...participant, role } : participant,
      ),
    )
  }

  const handleThumbnailUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    if (!imageMimeTypes.includes(file.type)) {
      setErrorMessage('jpg, png, gif, webp 형식의 이미지만 업로드 가능합니다.')
      event.target.value = ''
      return
    }

    if (file.size > maxImageSize) {
      setErrorMessage('대표 이미지는 5MB 이하만 업로드할 수 있습니다.')
      event.target.value = ''
      return
    }

    try {
      const data = await imageApi.upload(file)
      setThumbnailUrl(data.imageUrl)
      setErrorMessage('')
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : '이미지 업로드에 실패했습니다.',
      )
    }
  }

  const insertMarkdownImage = async (file: File, cursorIndex?: number) => {
    const validationMessage = validateImageFile(file)

    if (validationMessage) {
      setErrorMessage(validationMessage)
      return
    }

    try {
      const data = await imageApi.upload(file)
      const imageMarkdown = `![서비스 미리보기](${data.imageUrl})`

      let nextCursorIndex: number | undefined

      setMarkdown((current) => {
        if (cursorIndex === undefined) {
          return current.trim() ? `${current}\n\n${imageMarkdown}` : imageMarkdown
        }

        const safeCursorIndex = Math.min(cursorIndex, current.length)
        const beforeCursor = current.slice(0, safeCursorIndex)
        const afterCursor = current.slice(safeCursorIndex)
        const prefix = beforeCursor && !beforeCursor.endsWith('\n') ? '\n' : ''
        const suffix = afterCursor && !afterCursor.startsWith('\n') ? '\n' : ''
        nextCursorIndex =
          beforeCursor.length + prefix.length + imageMarkdown.length + suffix.length

        return `${beforeCursor}${prefix}${imageMarkdown}${suffix}${afterCursor}`
      })
      window.setTimeout(() => {
        if (nextCursorIndex !== undefined && markdownTextareaRef.current) {
          markdownTextareaRef.current.focus()
          markdownTextareaRef.current.setSelectionRange(nextCursorIndex, nextCursorIndex)
        }
      })
      setErrorMessage('')
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : '?대?吏 ?낅줈?쒖뿉 ?ㅽ뙣?덉뒿?덈떎.',
      )
    }
  }

  const handleMarkdownPaste = (event: ClipboardEvent<HTMLTextAreaElement>) => {
    const imageFile = Array.from(event.clipboardData.files).find((file) =>
      file.type.startsWith('image/'),
    )

    if (!imageFile) {
      return
    }

    event.preventDefault()
    insertMarkdownImage(imageFile, event.currentTarget.selectionStart)
  }

  const handleMarkdownDrop = (event: DragEvent<HTMLTextAreaElement>) => {
    const imageFile = Array.from(event.dataTransfer.files).find((file) =>
      file.type.startsWith('image/'),
    )

    if (!imageFile) {
      return
    }

    event.preventDefault()
    insertMarkdownImage(imageFile)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage('')

    const requestBody = {
      category: categoryValues[category] ?? 'AUTONOMOUS',
      deploymentLink: deploymentLink || undefined,
      description: markdown,
      endDate,
      githubLink: githubLink || undefined,
      myRole,
      participants: participants
        .filter((participant) => !participant.fixed)
        .map((participant) => ({
          role: participant.role,
          userId: participant.userId,
        })),
      projectName,
      skills: techStacks,
      startDate,
      summary,
      thumbnailUrl: thumbnailUrl || undefined,
    }

    try {
      const savedPortfolio = isModify
        ? await portfolioApi.update(getSelectedPortfolioId(), requestBody)
        : await portfolioApi.create(requestBody)
      window.sessionStorage.setItem('selectedPortfolioId', String(savedPortfolio.id))
      window.location.hash = 'portfolio-detail'
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : '포트폴리오 저장에 실패했습니다.',
      )
    }
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

        <form
          className="absolute left-[48px] top-[184px] h-[1308px] w-[1184px] rounded-[18px] border border-[#c9d5e7] bg-white"
          onSubmit={handleSubmit}
        >
          <h2 className="absolute left-[40px] top-[41px] text-[19px] font-bold leading-[28px] text-[#121a34]">
            기본 정보
          </h2>

          <TextField
            className="absolute left-[40px] top-[91px]"
            label="프로젝트명"
            onChange={setProjectName}
            placeholder="프로젝트명을 입력하세요"
            value={projectName}
            width="w-[500px]"
          />
          <TextField
            className="absolute left-[40px] top-[182px]"
            label="프로젝트 요약"
            onChange={setSummary}
            placeholder="프로젝트를 한 줄로 소개하세요"
            value={summary}
            width="w-[500px]"
          />

          <label
            className="absolute left-[600px] top-[90px] flex h-[234px] w-[504px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-[14px] border border-[#c9d5e7] bg-[#e7f0fa]"
          >
            {thumbnailUrl && (
              <>
                <img
                  alt="대표 이미지 미리보기"
                  className="h-full w-full object-cover"
                  src={thumbnailUrl}
                />
                <span className="absolute bottom-[14px] rounded-full bg-white/90 px-[14px] py-[7px] text-[12px] font-semibold text-[#2e569d] shadow-[0px_8px_18px_-12px_rgba(18,26,52,0.35)]">
                  대표 이미지 변경
                </span>
              </>
            )}
            {!thumbnailUrl && (
              <span className="text-[34px] font-bold text-[#2e569d]">+</span>
            )}
            <span className={thumbnailUrl ? 'hidden' : 'mt-[12px] text-[13px] font-medium text-[#5c6a84]'}>
              {thumbnailUrl || '대표 이미지 업로드 · PNG/JPG 5MB 이하'}
            </span>
            <input
              accept="image/png,image/jpeg,image/gif,image/webp"
              className="hidden"
              onChange={handleThumbnailUpload}
              type="file"
            />
          </label>

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
              onChange={setGithubLink}
              placeholder="https://github.com/username/repository"
              value={githubLink}
              width="w-[320px]"
            />
            <TextField
              label="배포 링크"
              onChange={setDeploymentLink}
              placeholder="https://project.example.com"
              value={deploymentLink}
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
                  본인 역할
                </span>
                <select
                  className="mt-[9px] h-[42px] w-[160px] rounded-[8px] border border-[#c9d5e7] bg-white px-[12px] text-[12px] font-semibold text-[#2e569d] outline-none"
                  onChange={(event) => setMyRole(event.target.value)}
                  value={myRole}
                >
                  {roles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </label>
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
              ref={markdownTextareaRef}
              onChange={(event) => setMarkdown(event.target.value)}
              onDragOver={(event) => event.preventDefault()}
              onDrop={handleMarkdownDrop}
              onPaste={handleMarkdownPaste}
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
                  placeholder="참여자 학번 입력"
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

          {errorMessage && (
            <p className="absolute left-[40px] top-[1248px] text-[12px] font-semibold text-[#c7252e]">
              {errorMessage}
            </p>
          )}

          <a
            className="absolute left-[872px] top-[1252px] flex h-[40px] w-[112px] items-center justify-center rounded-[8px] border border-[#2e569d] bg-white text-[13px] font-semibold text-[#2e569d]"
            href="#portfolio"
          >
            취소
          </a>
          <button
            className="absolute left-[1000px] top-[1252px] flex h-[40px] w-[136px] items-center justify-center rounded-[8px] bg-[#e2842a] text-[13px] font-semibold text-white"
            type="submit"
          >
            {isModify ? '수정하기' : '등록하기'}
          </button>
        </form>
      </section>
    </main>
  )
}

function validateImageFile(file: File) {
  if (!imageMimeTypes.includes(file.type)) {
    return 'jpg, png, gif, webp 형식의 이미지만 업로드할 수 있습니다.'
  }

  if (file.size > maxImageSize) {
    return '이미지는 5MB 이하만 업로드할 수 있습니다.'
  }

  return ''
}

interface TextFieldProps {
  className?: string
  label: string
  onChange: (value: string) => void
  placeholder: string
  value: string
  width: string
}

function TextField({
  className,
  label,
  onChange,
  placeholder,
  value,
  width,
}: TextFieldProps) {
  return (
    <label className={className}>
      <span className="block text-[12px] font-semibold leading-[18px] text-[#121a34]">
        {label}
      </span>
      <input
        className={`mt-[9px] h-[44px] ${width} rounded-[8px] border border-[#c9d5e7] bg-white px-[14px] text-[13px] text-[#5c6a84] outline-none placeholder:text-[#9ca8ba] focus:border-[#2e569d]`}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        value={value}
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
