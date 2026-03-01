export default function ArtifactFilter({
  checked,
  onChange,
}: {
  checked: boolean
  onChange: (value: boolean) => void
}) {
  return (
    <label className="flex items-center gap-2 mt-4 mb-4 cursor-pointer select-none">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4"
      />
      <span className="text-sm text-gray-700 dark:text-gray-300">
        Only with artifacts
      </span>
    </label>
  )
}
