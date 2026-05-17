import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { userAPI } from '../../api/endpoints'
import { formatPrice } from '../../utils/helpers'
import LoadingScreen from '../../components/ui/LoadingScreen'

const WalletPage = () => {
  const { data, isLoading } = useQuery({ queryKey: ['wallet'], queryFn: () => userAPI.getWallet() })

  if (isLoading) return <LoadingScreen />
  const wallet = data?.data?.data

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">My Wallet</h1>
      <div className="card p-8">
        <div className="text-center">
          <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{formatPrice(wallet?.balance || 0)}</h2>
          <p className="text-gray-500">Available Balance</p>
        </div>
      </div>
    </div>
  )
}

export default WalletPage
