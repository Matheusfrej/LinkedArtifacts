import { Zap } from 'lucide-react'
import BaseRepositoryTable from './BaseRepositoryTable'
import { OtherRepository } from '@/@types'
import ValidationAction from '@/components/ValidationAction'
import { ValidationField } from './ValidationField'

interface OtherRepositoriesTableProps {
  paperName: string
  data: OtherRepository[]
}

export default function OtherRepositoriesTable({
  paperName,
  data,
}: OtherRepositoriesTableProps) {
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
          header: <ValidationField />,
          align: 'right' as const,
          render: (_value: unknown, item: OtherRepository) => (
            <ValidationAction
              paperName={paperName}
              initialValidation={item.validation}
            />
          ),
        },
      ]}
    />
  )
}
