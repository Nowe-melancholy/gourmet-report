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

export const loader = async () => {
  return {};
};

export default function AddReport() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      rating: 3,
      date: new Date().toISOString().split('T')[0],
      comment: '',
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

  const onSubmit = () => {
    const client = hc<AppType>(import.meta.env.VITE_API_URL);

    client.api.createReport.$post({
      form: {
        name: form.getValues('name'),
        rating: form.getValues('rating').toString(),
        dateYYMMDD: form.getValues('date').replace(/-/g, ''),
        comment: form.getValues('comment'),
        image: form.getValues('image'),
        link: '',
      },
    });
  };

  return (
    <div className='container mx-auto py-8'>
      <h1 className='text-3xl font-bold mb-8'>新しい料理レポートを登録</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
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
                  レポートする料理の名前を入力してください。
                </FormDescription>
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
        </form>
      </Form>
    </div>
  );
}

const formSchema = z.object({
  name: z.string().min(1, {
    message: '料理名は必須です。',
  }),
  rating: z.number().min(1).max(5),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: '日付は YYYY-MM-DD 形式で入力してください。',
  }),
  comment: z.string().min(10, {
    message: 'コメントは最低10文字必要です。',
  }),
  image: z
    .any()
    .refine(
      (file) => file?.size <= MAX_FILE_SIZE,
      `最大ファイルサイズは5MBです。`
    )
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
      'JPG、PNGのみアップロード可能です。'
    ),
});

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png'];