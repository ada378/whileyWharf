import React from 'react'
import Button from './Button'

const EmptyState = ({ icon, title, description, actionText, onAction }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      {icon && <div className="text-gray-400 mb-4">{icon}</div>}
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      {description && <p className="text-gray-500 text-center max-w-md mb-6">{description}</p>}
      {actionText && onAction && <Button onClick={onAction}>{actionText}</Button>}
    </div>
  )
}

export default EmptyState
