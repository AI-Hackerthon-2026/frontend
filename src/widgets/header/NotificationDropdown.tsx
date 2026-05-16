import { useEffect, useRef, useState } from 'react'

interface Notification {
  id: string
  title: string
  message: string
  timestamp: string
  isRead: boolean
}

function NotificationDropdown() {
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: '포트폴리오 평가',
      message: '님의 포트폴리오가 평가되었습니다.',
      timestamp: '2분 전',
      isRead: false,
    },
    {
      id: '2',
      title: '랭킹 업데이트',
      message: '현재 랭킹이 상승했습니다.',
      timestamp: '1시간 전',
      isRead: false,
    },
    {
      id: '3',
      title: '새로운 메시지',
      message: '김교수님이 메시지를 보냈습니다.',
      timestamp: '3시간 전',
      isRead: true,
    },
  ])

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, isRead: true } : notif))
    )
  }

  const unreadCount = notifications.filter((notif) => !notif.isRead).length

  useEffect(() => {
    if (!isOpen) {
      return undefined
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute left-[1031px] top-[17px] size-[36px] rounded-[10px] border border-[rgba(220,232,247,0.55)] bg-[rgba(255,255,255,0.18)] text-white flex items-center justify-center hover:bg-[rgba(255,255,255,0.24)] transition-colors"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-[#e2842a] flex items-center justify-center text-xs font-bold text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-[56px] w-[360px] bg-white border border-[#c9d9ee] rounded-[14px] shadow-[0px_18px_36px_-10px_rgba(27,36,81,0.18)] z-50 overflow-hidden">
          <div className="p-4 border-b border-[#e7f0fa] bg-[#f9fbfd]">
            <h3 className="text-[14px] font-bold text-[#121a34]">알림</h3>
          </div>

          <div className="max-h-[400px] overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((notif) => (
                <button
                  key={notif.id}
                  onClick={() => handleMarkAsRead(notif.id)}
                  className={[
                    'w-full px-4 py-3 border-b border-[#e7f0fa] hover:bg-[#f9fbfd] transition-colors text-left',
                    !notif.isRead ? 'bg-[#edf4fd]' : 'bg-white',
                  ].join(' ')}
                >
                  <div className="flex items-start gap-3">
                    {!notif.isRead && (
                      <div className="mt-2 h-2 w-2 rounded-full bg-[#2e569d] flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-[#121a34] truncate">
                        {notif.title}
                      </p>
                      <p className="text-[12px] text-[#5c6a84] mt-1 line-clamp-2">
                        {notif.message}
                      </p>
                      <p className="text-[11px] text-[#9ca8ba] mt-2">{notif.timestamp}</p>
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <div className="px-4 py-8 text-center text-[13px] text-[#9ca8ba]">
                알림이 없습니다.
              </div>
            )}
          </div>


        </div>
      )}
    </div>
  )
}

export default NotificationDropdown
