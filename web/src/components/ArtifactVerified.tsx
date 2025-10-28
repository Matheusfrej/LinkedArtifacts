import { CheckCircle } from 'lucide-react'

export function ArtifactVerified() {
  return (
    <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-500">
      <CheckCircle className="w-5 h-5" />
      <span className="text-sm">Verified</span>
    </div>
  )
}
