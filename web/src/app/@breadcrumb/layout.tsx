export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <div className="w-full max-w-7xl mx-auto">{children}</div>
}
