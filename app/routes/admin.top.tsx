import type { LoaderFunctionArgs } from '@remix-run/cloudflare'
import { Link, useLoaderData, useRevalidator } from '@remix-run/react'
import { hc } from 'hono/client'
import { ChevronLeft, ChevronRight, Loader, Star } from 'lucide-react'
import { useState } from 'react'
import type { AppType } from 'server'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import { useToast } from '~/hooks/use-toast'
import { getAuthenticator } from '~/services/auth.server'

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const jwtToken =
    (await getAuthenticator().isAuthenticated(request))?.jwt ?? ''

  const client = hc<AppType>(import.meta.env.VITE_API_URL)
  const res = await (await client.api.getReports.$get()).json()
  return { reports: res.reports, jwtToken }
}

export default function AdminTop() {
  const data = useLoaderData<typeof loader>()
  const { revalidate } = useRevalidator()

  return (
    <>
      <Link to="/admin/add-report">
        <Button>レポートを追加</Button>
      </Link>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.reports.map(report => (
          <ReportCard
            key={report.id}
            report={{
              ...report,
              date: `${report.dateYYYYMMDD.slice(
                0,
                4,
              )}-${report.dateYYYYMMDD.slice(4, 6)}-${report.dateYYYYMMDD.slice(
                6,
                8,
              )}`,
            }}
            jwtToken={data.jwtToken}
            revalidate={revalidate}
          />
        ))}
      </div>
      <div className="flex justify-center mt-8 gap-2">
        <Link to={'/reports?page=1'}>
          <Button variant="outline">
            <ChevronLeft className="h-4 w-4 mr-2" />
            前へ
          </Button>
        </Link>
        <Link to={`/reports?page=${1}`}>
          <Button variant="outline">
            次へ
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </Link>
      </div>
    </>
  )
}

const ReportCard = ({
  report: { id, shopName, name, imgUrl, rating, comment, date },
  jwtToken,
  revalidate,
}: {
  report: {
    id: string
    shopName: string
    name: string
    imgUrl: string
    rating: number
    comment: string
    date: string
  }
  jwtToken: string
  revalidate: () => void
}) => {
  const { toast } = useToast()

  const [isSubmitting, setIsSubmitting] = useState(false)

  const onClick = async () => {
    setIsSubmitting(true)
    const client = hc<AppType>(import.meta.env.VITE_API_URL, {
      headers: { Authorization: `Bearer ${jwtToken}` },
    })
    await client.api.auth.deleteReport.$delete({ query: { id } })
    setIsSubmitting(false)
    revalidate()
    toast({ title: 'レポートを削除しました' })
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{`${shopName} ${name}`}</span>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-primary" />
            {rating}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="aspect-video relative mb-4">
          <img src={imgUrl} alt={name} className="object-cover rounded-md" />
        </div>
        <p className="text-sm text-muted-foreground">{comment}</p>
      </CardContent>
      <CardFooter>
        <div className="flex-col">
          <p className="text-sm text-muted-foreground">{date}</p>
          <div className="flex gap-1">
            <Link to={`/admin/edit-report/${id}`}>
              <Button variant="outline">編集</Button>
            </Link>
            <form>
              <input type="hidden" name="reportId" value={id} />
              <Button
                variant="outline"
                type="submit"
                onClick={onClick}
                disabled={isSubmitting}
                className="min-w-4"
              >
                {isSubmitting ? <Loader className="animate-spin" /> : '削除'}
              </Button>
            </form>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
