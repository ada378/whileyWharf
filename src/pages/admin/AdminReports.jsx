import React, { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { adminAPI } from '../../api/endpoints'
import Button from '../../components/ui/Button'
import toast from 'react-hot-toast'

const AdminReports = () => {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [format, setFormat] = useState('excel')

  const mutation = useMutation({
    mutationFn: () => adminAPI.getSalesReport({ startDate: startDate || undefined, endDate: endDate || undefined, format }),
    onSuccess: (res) => {
      const blob = new Blob([res.data], { type: format === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `sales-report.${format === 'pdf' ? 'pdf' : 'xlsx'}`
      a.click()
      window.URL.revokeObjectURL(url)
      toast.success('Report downloaded!')
    },
    onError: () => toast.error('Failed to generate report'),
  })

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Sales Reports</h1>
      <div className="card p-8 max-w-lg">
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="input-field" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Format</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="format" value="excel" checked={format === 'excel'} onChange={(e) => setFormat(e.target.value)} className="text-indigo-600" />
                <span>Excel (.xlsx)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="format" value="pdf" checked={format === 'pdf'} onChange={(e) => setFormat(e.target.value)} className="text-indigo-600" />
                <span>PDF</span>
              </label>
            </div>
          </div>
          <Button onClick={() => mutation.mutate()} loading={mutation.isPending} className="w-full">Generate Report</Button>
        </div>
      </div>
    </div>
  )
}

export default AdminReports
