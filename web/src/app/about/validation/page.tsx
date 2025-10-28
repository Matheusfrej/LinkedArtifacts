import { ArtifactVerified } from '@/components/ArtifactVerified'
import { ThumbsDown, ThumbsUp } from 'lucide-react'

export default async function Page() {
  return (
    <div className="py-12 max-w-4xl mx-auto px-6 space-y-6">
      <h2 className="text-2xl font-semibold">About Artifact Validation</h2>

      <p className="text-base leading-relaxed">
        Our mission is to help researchers and practitioners easily discover
        reliable artifacts linked to academic papers. To ensure both accuracy
        and transparency, we use a combination of <strong>manual</strong> and{' '}
        <strong>automated</strong> validation methods.
      </p>

      <section className="space-y-3">
        <h3 className="text-lg font-medium">Manual Verification</h3>
        <p className="text-base leading-relaxed">
          When an artifact has been manually reviewed, the{' '}
          <strong>Validation</strong> field indicates that it was verified by
          our trusted sources. These artifacts are individually checked to
          confirm that they genuinely belong to the associated paper. The
          following symbol is displayed when a manual validation is present:
        </p>
        <ArtifactVerified />
      </section>

      <section className="space-y-3">
        <h3 className="text-lg font-medium">Automated Discovery</h3>
        <p className="text-base leading-relaxed">
          Unfortunately, it’s not feasible to manually review every artifact. In
          such cases, we rely on an automated search process powered by
          heuristics to identify potential artifact links.
        </p>
        <p className="text-base leading-relaxed">
          When artifacts are discovered automatically, we invite community
          members to contribute by confirming whether each artifact truly
          belongs to the corresponding paper.
        </p>
        <p className="text-base leading-relaxed flex items-center gap-1 flex-wrap">
          You can provide feedback by giving an upvote{' '}
          <ThumbsUp className="w-4 h-4 text-emerald-600 dark:text-emerald-500" />{' '}
          if the artifact is correct, or a downvote{' '}
          <ThumbsDown className="w-4 h-4 text-red-600 dark:text-red-500" /> if
          it isn’t.
        </p>
      </section>

      <section className="space-y-3">
        <h3 className="text-lg font-medium">Your Feedback Matters</h3>
        <p className="text-base leading-relaxed">
          Your feedback plays a vital role in improving the quality of our
          dataset. By verifying artifacts, you help ensure that each link is
          accurate and genuinely related to its paper—making research more
          transparent, trustworthy, and reproducible for everyone in the
          community.
        </p>
      </section>
    </div>
  )
}
