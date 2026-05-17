import React, { useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import toast from 'react-hot-toast'
import { loginSuccess } from '../../store/slices/authSlice'
import Spinner from '../../components/ui/Spinner'

const OAuthCallback = () => {
  const [searchParams] = useSearchParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    const accessToken = searchParams.get('accessToken')
    const refreshToken = searchParams.get('refreshToken')

    if (accessToken && refreshToken) {
      dispatch(loginSuccess({ accessToken, refreshToken, user: null }))
      toast.success('Login successful!')
      navigate('/', { replace: true })
    } else {
      toast.error('OAuth login failed')
      navigate('/login', { replace: true })
    }
  }, [])

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <Spinner size="lg" />
    </div>
  )
}

export default OAuthCallback
