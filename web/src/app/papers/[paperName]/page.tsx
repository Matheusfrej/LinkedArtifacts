import PaperDetailClient from './components/PaperDetailClient'

interface PageProps {
  params: Promise<{ paperName: string }>
}

export default async function Page({ params }: PageProps) {
  const { paperName } = await params
  const decodedPaperName = decodeURIComponent(paperName)

  return (
    <div className="py-8 space-y-8 max-w-6xl mx-auto px-4">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">
          {decodedPaperName}
        </h1>
        <h2 className="text-xl text-foreground/70">Artifacts</h2>
      </div>

      <PaperDetailClient paperName={decodedPaperName} />
    </div>
  )
}
