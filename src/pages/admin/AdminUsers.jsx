import React, { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { adminAPI } from '../../api/endpoints'
import { formatDate } from '../../utils/helpers'
import Button from '../../components/ui/Button'
import DataTable from '../../components/ui/DataTable'
import toast from 'react-hot-toast'

const AdminUsers = () => {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['adminUsers', page, search],
    queryFn: () => adminAPI.getUsers({ page, limit: 20, search: search || undefined }),
  })

  const blockMutation = useMutation({
    mutationFn: (id) => adminAPI.blockUser(id, 'Violation of terms'),
    onSuccess: () => { toast.success('User blocked'); refetch() },
  })

  const unblockMutation = useMutation({
    mutationFn: (id) => adminAPI.unblockUser(id),
    onSuccess: () => { toast.success('User unblocked'); refetch() },
  })

  const users = data?.data?.data || []
  const pagination = data?.data?.pagination

  const columns = [
    { header: 'User', render: (row) => (
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center"><span className="text-sm font-semibold text-indigo-600">{row.name?.charAt(0)}</span></div>
        <div><p className="font-medium">{row.name}</p><p className="text-xs text-gray-500">{row.email}</p></div>
      </div>
    )},
    { header: 'Role', render: (row) => <span className="capitalize">{row.role}</span> },
    { header: 'Joined', render: (row) => <span className="text-sm">{formatDate(row.createdAt)}</span> },
    { header: 'Verified', render: (row) => row.isVerified ? <span className="badge-success">Yes</span> : <span className="badge-danger">No</span> },
    { header: 'Status', render: (row) => row.isBlocked ? <span className="badge-danger">Blocked</span> : <span className="badge-success">Active</span> },
    { header: 'Actions', render: (row) => (
      row.isBlocked
        ? <Button size="sm" onClick={() => unblockMutation.mutate(row._id)} loading={unblockMutation.isPending}>Unblock</Button>
        : <Button size="sm" variant="danger" onClick={() => { if (confirm('Block this user?')) blockMutation.mutate(row._id) }} loading={blockMutation.isPending}>Block</Button>
    )},
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Users</h1>
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search users..." className="px-4 py-2 border border-gray-300 rounded-lg text-sm w-64" />
      </div>
      <DataTable columns={columns} data={users} loading={isLoading} pagination={pagination} onPageChange={setPage} />
    </div>
  )
}

export default AdminUsers
