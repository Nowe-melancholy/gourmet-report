import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { Textarea } from '~/components/ui/textarea';
import { Button } from '~/components/ui/button';
import { hc } from 'hono/client';
import { AppType } from 'server';
import { useFetcher, useNavigate, Form as RemixForm } from '@remix-run/react';
import { useToast } from '~/hooks/use-toast';
import { ActionFunction, redirect } from '@remix-run/cloudflare';
import { getAuthenticator } from '~/services/auth.server';

export const loader = async () => {
  return {};
};

export const action: ActionFunction = async ({ request, context }) => {
  const formData = await request.formData();

  const auth = await getAuthenticator(context).isAuthenticated(request);

  const client = hc<AppType>(import.meta.env.VITE_API_URL, {
    headers: { Authorization: `Bearer ${auth?.jwt}` },
  });

  await client.api.auth.createReport.$post({
    form: {
      shopName: formData.get('shopName')!.toString(),
      name: formData.get('name')!.toString(),
      place: formData.get('place')!.toString(),
      rating: formData.get('rating')!.toString(),
      comment: formData.get('comment')!.toString(),
      link: formData.get('link')!.toString() ?? 'null',
      image:
        formData.get('image') instanceof File
          ? (formData.get('image') as File)
          : ('null' as const),
      dateYYYYMMDD: formData.get('dateYYYYMMDD')!.toString().replace(/-/g, ''),
    },
  });

  return redirect('/admin/top');
};

export default function AddReport() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      shopName: '',
      name: '',
      place: '',
      rating: 3,
      date: new Date().toISOString().split('T')[0],
      comment: '',
      link: '',
      image: null,
    },
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null);
    }
  };

  const navigate = useNavigate();
  const { toast } = useToast();
  const fetcher = useFetcher();

  const onSubmit = async (form: z.infer<typeof formSchema>) => {
    const data = new FormData();
    data.append('shopName', form.shopName);
    data.append('name', form.name);
    data.append('place', form.place);
    data.append('rating', form.rating.toString());
    data.append('dateYYYYMMDD', form.date.replace(/-/g, ''));
    data.append('comment', form.comment);
    data.append('image', form.image ?? '');
    data.append('link', form.link);

    fetcher.submit(data, { method: 'post', encType: 'multipart/form-data' });
    toast({ title: 'レポート内容を変更しました' });
  };

  return (
    <>
      <Button onClick={() => navigate('/admin/top')}>一覧に戻る</Button>
      <div className='container mx-auto py-8'>
        <h1 className='text-3xl font-bold mb-8'>新しい料理レポートを登録</h1>
        <Form {...form}>
          <RemixForm
            method='post'
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-8'
          >
            <FormField
              control={form.control}
              name='shopName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>店名</FormLabel>
                  <FormControl>
                    <Input placeholder='例: ほげ食堂' {...field} />
                  </FormControl>
                  <FormDescription>
                    店の名前を入力してください。
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>料理名</FormLabel>
                  <FormControl>
                    <Input placeholder='例: 特製ラーメン' {...field} />
                  </FormControl>
                  <FormDescription>
                    料理の名前を入力してください。
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='place'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>場所</FormLabel>
                  <FormControl>
                    <Input placeholder='例: 東京' {...field} />
                  </FormControl>
                  <FormDescription>場所を入力してください。</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='rating'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>評価</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      min={1}
                      max={5}
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value, 10))
                      }
                    />
                  </FormControl>
                  <FormDescription>
                    1から5の間で評価してください。
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='date'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>日付</FormLabel>
                  <FormControl>
                    <Input type='date' {...field} />
                  </FormControl>
                  <FormDescription>
                    レポートの日付を選択してください。
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='comment'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>コメント</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='料理の感想を書いてください'
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    最低10文字以上のコメントを入力してください。
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='link'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>リンク</FormLabel>
                  <FormControl>
                    <Input placeholder='例: https://example.com' {...field} />
                  </FormControl>
                  <FormDescription>
                    関連するリンクを貼り付けてください
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='image'
              render={({ field: { onChange } }) => (
                <FormItem>
                  <FormLabel>画像</FormLabel>
                  <FormControl>
                    <Input
                      type='file'
                      accept='image/*'
                      onChange={(e) => {
                        handleImageChange(e);
                        onChange(e.target.files?.[0]);
                      }}
                      ref={fileInputRef}
                    />
                  </FormControl>
                  <FormDescription>
                    料理の画像をアップロードしてください（最大5MB、JPG、PNG形式）
                  </FormDescription>
                  <FormMessage />
                  {previewImage && (
                    <div className='mt-4'>
                      <img
                        src={previewImage}
                        alt='プレビュー'
                        width={200}
                        height={200}
                        className='object-cover rounded-md'
                      />
                    </div>
                  )}
                </FormItem>
              )}
            />
            <Button type='submit'>レポートを登録</Button>
          </RemixForm>
        </Form>
      </div>
    </>
  );
}

const formSchema = z.object({
  shopName: z.string().min(1, {
    message: '店名は必須です。',
  }),
  name: z.string().min(1, {
    message: '料理名は必須です。',
  }),
  place: z.string().min(1, {
    message: '場所は必須です。',
  }),
  rating: z.number().min(1).max(5),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: '日付は YYYY-MM-DD 形式で入力してください。',
  }),
  comment: z.string().min(10, {
    message: 'コメントは最低10文字必要です。',
  }),
  link: z.string().url().or(z.string().length(0)),
  image: z
    .any()
    .refine(
      (file) => file?.size <= MAX_FILE_SIZE,
      `最大ファイルサイズは10MBです。`
    )
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
      'JPG、PNGのみアップロード可能です。'
    ),
});

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png'];
