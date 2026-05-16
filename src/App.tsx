import { useEffect, useState } from 'react'
import LoginPage from './pages/auth/LoginPage'
import SignUpPage from './pages/auth/SignUpPage'
import MainDashboardPage from './pages/dashboard/MainDashboardPage'
import PortfolioBoardPage from './pages/portfolio/PortfolioBoardPage'
import PortfolioCreatePage from './pages/portfolio/PortfolioCreatePage'
import PortfolioDetailPage from './pages/portfolio/PortfolioDetailPage'
import PortfolioModifyPage from './pages/portfolio/PortfolioModifyPage'
import RankingAwardsPage from './pages/ranking/RankingAwardsPage'
import MyPage from './pages/user/MyPage'
import ProfileEditPage from './pages/user/ProfileEditPage'
import { userApi } from './services/api'

const privatePages = new Set(['mypage', 'portfolio-create', 'portfolio-modify', 'profile-edit'])

function getCurrentPage() {
  return window.location.hash.replace('#', '').split('?')[0]
}

function App() {
  const [page, setPage] = useState(() => getCurrentPage())

  useEffect(() => {
    const handleHashChange = () => {
      setPage(getCurrentPage())
    }

    window.addEventListener('hashchange', handleHashChange)

    return () => {
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [])

  useEffect(() => {
    const currentPage = getCurrentPage()
    let isCancelled = false

    if (currentPage === 'signup') {
      return
    }

    userApi
      .getMe()
      .then(() => {
        if (!isCancelled && (!currentPage || currentPage === 'login')) {
          window.location.hash = 'main'
        }
      })
      .catch(() => {
        if (!isCancelled && privatePages.has(currentPage)) {
          window.location.hash = 'login'
        }
      })

    return () => {
      isCancelled = true
    }
  }, [])

  if (page === 'signup') {
    return <SignUpPage />
  }

  if (page === 'main') {
    return <MainDashboardPage />
  }

  if (page === 'portfolio') {
    return <PortfolioBoardPage />
  }

  if (page === 'portfolio-create') {
    return <PortfolioCreatePage />
  }

  if (page === 'portfolio-modify') {
    return <PortfolioModifyPage />
  }

  if (page === 'portfolio-detail') {
    return <PortfolioDetailPage />
  }

  if (page === 'ranking') {
    return <RankingAwardsPage />
  }

  if (page === 'mypage') {
    return <MyPage />
  }

  if (page === 'profile-edit') {
    return <ProfileEditPage />
  }

  return <LoginPage />
}

export default App
