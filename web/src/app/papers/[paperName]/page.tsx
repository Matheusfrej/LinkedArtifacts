export default async function Page(props: PageProps<'/papers/[paperName]'>) {
  const paperName = decodeURIComponent((await props.params).paperName)

  return <h1>{paperName}</h1>
}