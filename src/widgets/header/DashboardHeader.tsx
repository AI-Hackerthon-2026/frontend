interface DashboardHeaderProps {
  active?: 'main' | 'portfolio' | 'ranking' | 'mypage'
  logo: string
}

import NotificationDropdown from './NotificationDropdown'

function DashboardHeader({ active, logo }: DashboardHeaderProps) {
  return (
    <header className="absolute left-0 top-0 h-[72px] w-[1280px] bg-[#2e569d]">
      <a
        className="absolute left-[24px] top-[14px] flex h-[44px] w-[162px] items-center rounded-[12px] border border-[rgba(205,232,247,0.88)] bg-gradient-to-r from-white via-[#f6faff] via-[58%] to-[#e3f0fd] shadow-[0px_8px_18px_-8px_rgba(9,14,32,0.24)]"
        href="#main"
      >
        <img
          alt="가천 Bridge"
          className="ml-[10px] h-[34px] w-[44px] object-contain"
          src={logo}
        />
        <span className="ml-[8px] text-[15px] font-bold text-[#2e569d]">
          가천 Bridge
        </span>
      </a>

      <nav className="absolute left-[235px] top-[18px] flex gap-[48px]">
        <HeaderLink active={active === 'portfolio'} href="#portfolio" width="w-[104px]">
          포트폴리오
        </HeaderLink>
        <HeaderLink active={active === 'ranking'} href="#ranking" width="w-[72px]">
          랭킹
        </HeaderLink>
        <HeaderLink active={active === 'mypage'} href="#mypage" width="w-[84px]">
          마이페이지
        </HeaderLink>
      </nav>

      <NotificationDropdown />
      <a
        className="absolute left-[1080px] top-[14px] flex h-[44px] w-[164px] items-center rounded-[22px] border border-[rgba(255,255,255,0.42)] bg-[rgba(255,255,255,0.96)]"
        href="#mypage"
      >
        <span className="ml-[14px] flex size-[28px] items-center justify-center rounded-full bg-[#2e569d] text-[13px] font-bold text-white">
          J
        </span>
        <span className="ml-[8px]">
          <span className="block text-[13px] font-semibold leading-[18px] text-[#121a34]">
            김진우
          </span>
          <span className="block text-[10px] font-medium leading-[14px] text-[#5c6a84]">
            내 포트폴리오
          </span>
        </span>
      </a>
    </header>
  )
}

interface HeaderLinkProps {
  active: boolean
  children: string
  href: string
  width: string
}

function HeaderLink({ active, children, href, width }: HeaderLinkProps) {
  return (
    <a
      className={[
        'flex h-[36px] items-center justify-center rounded-[8px] text-[15px] font-semibold text-white',
        width,
        active ? 'bg-[rgba(37,62,134,0.75)]' : '',
      ].join(' ')}
      href={href}
    >
      {children}
    </a>
  )
}

export default DashboardHeader
