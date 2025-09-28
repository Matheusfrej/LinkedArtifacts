export default function PapersLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <div className="w-full max-w-4xl mx-auto">{children}</div>
}
