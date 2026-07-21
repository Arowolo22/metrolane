import { Card, CardContent } from "@/components/ui/card"

interface PlaceholderPageProps {
  title: string
  description: string
}

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <Card>
      <CardContent className="flex min-h-[320px] flex-col items-center justify-center p-8 text-center">
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        <p className="mt-2 max-w-md text-sm text-gray-500">{description}</p>
      </CardContent>
    </Card>
  )
}
