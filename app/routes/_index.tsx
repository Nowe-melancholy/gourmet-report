import type { MetaFunction } from '@remix-run/cloudflare'
import { Form, Link, useLoaderData } from '@remix-run/react'
import { hc } from 'hono/client'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'
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

export const meta: MetaFunction = () => {
	return [
		{ title: '料理レポート一覧' },
		{ name: '料理レポート一覧', content: '料理レポート一覧' },
	]
}

export const loader = async () => {
	const client = hc<AppType>(import.meta.env.VITE_API_URL)
	const res = await client.api.getReports.$get()
	return res.json()
}

export default function Index() {
	const data = useLoaderData<typeof loader>()
	return (
		<div className="container mx-auto py-8">
			<div className="flex justify-between">
				<h1 className="text-3xl font-bold mb-8">料理レポート一覧</h1>
				<Form action="/auth/google" method="post">
					<Button>管理者ログイン</Button>
				</Form>
			</div>
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
					/>
				))}
			</div>
			<div className="flex justify-center mt-8 gap-2">
				<Link to={`/reports?page=1`}>
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
		</div>
	)
}

const ReportCard = ({
	report: { shopName, name, imgUrl, rating, comment, date },
}: {
	report: {
		shopName: string
		name: string
		imgUrl: string
		rating: number
		comment: string
		date: string
	}
}) => {
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
				<p className="text-sm text-muted-foreground">{date}</p>
			</CardFooter>
		</Card>
	)
}
