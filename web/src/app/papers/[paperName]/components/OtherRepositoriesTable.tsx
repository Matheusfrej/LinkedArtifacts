import { useState } from 'react'
import { Zap } from 'lucide-react'
import BaseRepositoryTable from './BaseRepositoryTable'
import { OtherRepository } from '../../../@types/types'
import ValidationAction from '../../../../components/ValidationAction'
import { vote } from '../../../../lib/service/artifacts'

interface OtherRepositoriesTableProps {
  data: OtherRepository[]
}

export default function OtherRepositoriesTable({
  data: initialData,
}: OtherRepositoriesTableProps) {
  const [data, setData] = useState(initialData)

  if (data.length === 0) return null

  return (
    <BaseRepositoryTable
      title="Other Repositories"
      description="Artifacts from other repositories"
      icon={<Zap className="w-5 h-5 text-foreground/70" />}
      data={data}
      columns={[
        {
          key: 'validation' as const,
          header: 'Validation',
          align: 'right' as const,
          render: (_value: unknown, item: OtherRepository) => (
            <ValidationAction
              artifactId={item.id}
              validation={item.validation}
              onVote={async (type, { increasing }) => {
                const result = await vote({
                  artifactId: item.id,
                  type,
                  increasing,
                })
                setData(
                  data.map((artifact) =>
                    artifact.id === item.id
                      ? { ...artifact, validation: result }
                      : artifact,
                  ),
                )
              }}
            />
          ),
        },
      ]}
    />
  )
}
