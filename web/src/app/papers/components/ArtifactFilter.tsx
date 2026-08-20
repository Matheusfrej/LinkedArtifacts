export const artifactFilterOptions = [
  { value: 'artifact', label: 'With artifact' },
  { value: 'Available', label: 'Available' },
  { value: 'Evaluated & Functional', label: 'Evaluated & Functional' },
  { value: 'Evaluated & Reusable', label: 'Evaluated & Reusable' },
  { value: 'Results Reproduced', label: 'Results Reproduced' },
  { value: 'Results Replicated', label: 'Results Replicated' },
] as const

export type ArtifactFilterValue =
  (typeof artifactFilterOptions)[number]['value']

export default function ArtifactFilter({
  selected,
  onChange,
}: {
  selected: ArtifactFilterValue[]
  onChange: (value: ArtifactFilterValue[]) => void
}) {
  return (
    <fieldset className="flex flex-wrap justify-end gap-x-4 gap-y-2">
      <legend className="sr-only">Filter papers</legend>
      {artifactFilterOptions.map((option) => (
        <label
          key={option.value}
          className="flex cursor-pointer select-none items-center gap-2"
        >
          <input
            type="checkbox"
            checked={selected.includes(option.value)}
            onChange={(event) => {
              if (event.target.checked) {
                onChange([...selected, option.value])
              } else {
                onChange(selected.filter((value) => value !== option.value))
              }
            }}
            className="h-4 w-4"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            {option.label}
          </span>
        </label>
      ))}
    </fieldset>
  )
}
