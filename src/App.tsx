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

function App() {
  const [page, setPage] = useState(() => window.location.hash.replace('#', ''))

  useEffect(() => {
    const handleHashChange = () => {
      setPage(window.location.hash.replace('#', ''))
    }

    window.addEventListener('hashchange', handleHashChange)

    return () => {
      window.removeEventListener('hashchange', handleHashChange)
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
