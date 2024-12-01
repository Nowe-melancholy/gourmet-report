import { Link, useLoaderData, useRevalidator } from '@remix-run/react';
import { hc } from 'hono/client';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { AppType } from 'server';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '~/components/ui/card';
import { useToast } from '~/hooks/use-toast';

export const loader = async () => {
  const client = hc<AppType>(import.meta.env.VITE_API_URL);
  const res = await client.api.getReports.$get();
  return res.json();
};

export default function AdminTop() {
  const data = useLoaderData<typeof loader>();
  const { revalidate } = useRevalidator();

  return (
    <>
      <Link to='/admin/add-report'>
        <Button>レポートを追加</Button>
      </Link>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {data.reports.map((report) => (
          <ReportCard
            key={report.id}
            report={{
              ...report,
              date: `${report.dateYYYYMMDD.slice(
                0,
                4
              )}-${report.dateYYYYMMDD.slice(4, 6)}-${report.dateYYYYMMDD.slice(
                6,
                8
              )}`,
            }}
            revalidate={revalidate}
          />
        ))}
      </div>
      <div className='flex justify-center mt-8 gap-2'>
        <Link to={`/reports?page=1`}>
          <Button variant='outline'>
            <ChevronLeft className='h-4 w-4 mr-2' />
            前へ
          </Button>
        </Link>
        <Link to={`/reports?page=${1}`}>
          <Button variant='outline'>
            次へ
            <ChevronRight className='h-4 w-4 ml-2' />
          </Button>
        </Link>
      </div>
    </>
  );
}

const ReportCard = ({
  report: { id, name, imgUrl, rating, comment, date },
  revalidate,
}: {
  report: {
    id: string;
    name: string;
    imgUrl: string;
    rating: number;
    comment: string;
    date: string;
  };
  revalidate: () => void;
}) => {
  const client = hc<AppType>(import.meta.env.VITE_API_URL);

  const { toast } = useToast();

  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle className='flex justify-between items-center'>
          <span>{name}</span>
          <Badge variant='secondary' className='flex items-center gap-1'>
            <Star className='w-4 h-4 fill-primary' />
            {rating}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='aspect-video relative mb-4'>
          <img src={imgUrl} alt={name} className='object-cover rounded-md' />
        </div>
        <p className='text-sm text-muted-foreground'>{comment}</p>
      </CardContent>
      <CardFooter>
        <p className='text-sm text-muted-foreground'>{date}</p>
        <Button variant='outline'>編集</Button>
        <Button
          variant='outline'
          onClick={async () => {
            await client.api.deleteReport.$delete({ query: { id } });
            toast({ title: 'レポートを削除しました' });
            revalidate();
          }}
        >
          削除
        </Button>
      </CardFooter>
    </Card>
  );
};
