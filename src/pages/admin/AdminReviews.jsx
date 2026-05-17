import React, { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { reviewAPI } from '../../api/endpoints'
import { formatDate } from '../../utils/helpers'
import StarRating from '../../components/ui/StarRating'
import Button from '../../components/ui/Button'
import DataTable from '../../components/ui/DataTable'
import toast from 'react-hot-toast'

const AdminReviews = () => {
  const [page, setPage] = useState(1)
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['pendingReviews', page],
    queryFn: () => reviewAPI.getPending({ page, limit: 20 }),
  })

  const approveMutation = useMutation({
    mutationFn: (id) => reviewAPI.approve(id),
    onSuccess: () => { toast.success('Review approved!'); refetch() },
  })

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }) => reviewAPI.reject(id, reason),
    onSuccess: () => { toast.success('Review rejected'); refetch() },
  })

  const reviews = data?.data?.data || []
  const pagination = data?.data?.pagination

  const columns = [
    { header: 'Product', render: (row) => (
      <div className="flex items-center gap-3">
        <img src={row.product?.images?.[0] || 'https://via.placeholder.com/40'} alt={row.product?.name} className="w-10 h-10 object-cover rounded" />
        <span className="text-sm font-medium">{row.product?.name || 'N/A'}</span>
      </div>
    )},
    { header: 'User', render: (row) => <span>{row.user?.name}</span> },
    { header: 'Rating', render: (row) => <StarRating rating={row.rating} /> },
    { header: 'Review', render: (row) => <div><p className="text-sm font-medium">{row.title}</p><p className="text-xs text-gray-500 truncate max-w-xs">{row.comment}</p></div> },
    { header: 'Date', render: (row) => <span className="text-sm">{formatDate(row.createdAt)}</span> },
    { header: 'Actions', render: (row) => (
      <div className="flex gap-2">
        <Button size="sm" onClick={() => approveMutation.mutate(row._id)} loading={approveMutation.isPending}>Approve</Button>
        <Button size="sm" variant="danger" onClick={() => { const r = prompt('Rejection reason?'); if (r) rejectMutation.mutate({ id: row._id, reason: r }) }} loading={rejectMutation.isPending}>Reject</Button>
      </div>
    )},
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Review Moderation</h1>
      <DataTable columns={columns} data={reviews} loading={isLoading} pagination={pagination} onPageChange={setPage} emptyMessage="No pending reviews" />
    </div>
  )
}

export default AdminReviews
