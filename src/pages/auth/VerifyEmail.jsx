import React, { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { authAPI } from '../../api/endpoints'
import Spinner from '../../components/ui/Spinner'

const VerifyEmail = () => {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const [status, setStatus] = useState('verifying')

  useEffect(() => {
    if (!token) { setStatus('invalid'); return }
    authAPI.verifyEmail(token)
      .then(() => setStatus('success'))
      .catch(() => setStatus('error'))
  }, [token])

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {status === 'verifying' && (
          <div>
            <Spinner size="lg" />
            <p className="mt-4 text-gray-500">Verifying your email...</p>
          </div>
        )}
        {status === 'success' && (
          <div>
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Email Verified!</h2>
            <p className="text-gray-500 mb-6">Your email has been successfully verified.</p>
            <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-medium">Continue to Login</Link>
          </div>
        )}
        {(status === 'error' || status === 'invalid') && (
          <div>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Verification Failed</h2>
            <p className="text-gray-500 mb-6">The verification link is invalid or has expired.</p>
            <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-medium">Back to Login</Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default VerifyEmail
