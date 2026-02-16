import { HelpCircle } from 'lucide-react'
import Link from 'next/link'

export function ValidationField() {
  return (
    <div>
      Validation
      <Link
        target="_blank"
        href={`/about/validation`}
        aria-label="About validation"
        className="ml-2 inline-flex items-center justify-center rounded-full w-5 h-5 bg-foreground/5 text-foreground/80 hover:bg-foreground/10"
        tabIndex={0}
      >
        <HelpCircle className="w-3 h-3" />
      </Link>
    </div>
  )
}
