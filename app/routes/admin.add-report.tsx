import { zodResolver } from '@hookform/resolvers/zod'
import type { LoaderFunctionArgs } from '@remix-run/cloudflare'
import { useLoaderData, useNavigate } from '@remix-run/react'
import { hc } from 'hono/client'
import { Loader } from 'lucide-react'
import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import type { AppType } from 'server'
import * as z from 'zod'
import { Button } from '~/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { Textarea } from '~/components/ui/textarea'
import { useToast } from '~/hooks/use-toast'
import { getAuthenticator } from '~/services/auth.server'

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const jwtToken = (await getAuthenticator().isAuthenticated(request))?.jwt

  return { jwtToken }
}

export default function AddReport() {
  const formMethod = useForm<z.infer<typeof formSchema>>({
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
  })

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setPreviewImage(null)
    }
  }

  const navigate = useNavigate()
  const { toast } = useToast()

  const { jwtToken } = useLoaderData<typeof loader>()

  const onSubmit = async ({
    shopName,
    name,
    place,
    rating,
    date,
    comment,
    link,
    image,
  }: z.infer<typeof formSchema>) => {
    const client = hc<AppType>(import.meta.env.VITE_API_URL, {
      headers: { Authorization: `Bearer ${jwtToken}` },
    })

    const result = await (
      await client.api.auth.createReport.$post({
        form: {
          shopName,
          name,
          place,
          rating: rating.toString(),
          comment,
          link: link,
          image: image ?? 'null',
          dateYYYYMMDD: date.replace(/-/g, ''),
        },
      })
    ).json()

    if (result.error) {
      toast({
        title: 'エラーが発生しました',
        description: result.error.message,
      })
      return
    }

    navigate('/admin/top')

    toast({ title: 'レポートを登録しました' })
  }

  return (
    <>
      <Button onClick={() => navigate('/admin/top')}>一覧に戻る</Button>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">新しい料理レポートを登録</h1>
        <Form {...formMethod}>
          <form
            method="post"
            onSubmit={formMethod.handleSubmit(onSubmit)}
            className="space-y-8"
          >
            <FormField
              control={formMethod.control}
              name="shopName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>店名</FormLabel>
                  <FormControl>
                    <Input placeholder="例: ほげ食堂" {...field} />
                  </FormControl>
                  <FormDescription>
                    店の名前を入力してください。
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={formMethod.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>料理名</FormLabel>
                  <FormControl>
                    <Input placeholder="例: 特製ラーメン" {...field} />
                  </FormControl>
                  <FormDescription>
                    料理の名前を入力してください。
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={formMethod.control}
              name="place"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>場所</FormLabel>
                  <FormControl>
                    <Input placeholder="例: 東京" {...field} />
                  </FormControl>
                  <FormDescription>場所を入力してください。</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={formMethod.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>評価</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      max={5}
                      {...field}
                      onChange={e =>
                        field.onChange(Number.parseInt(e.target.value, 10))
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
              control={formMethod.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>日付</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormDescription>
                    レポートの日付を選択してください。
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={formMethod.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>コメント</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="料理の感想を書いてください"
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
              control={formMethod.control}
              name="link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>リンク</FormLabel>
                  <FormControl>
                    <Input placeholder="例: https://example.com" {...field} />
                  </FormControl>
                  <FormDescription>
                    関連するリンクを貼り付けてください
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={formMethod.control}
              name="image"
              render={({ field: { onChange } }) => (
                <FormItem>
                  <FormLabel>画像</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={e => {
                        handleImageChange(e)
                        onChange(e.target.files?.[0])
                      }}
                      ref={fileInputRef}
                    />
                  </FormControl>
                  <FormDescription>
                    料理の画像をアップロードしてください（最大5MB、JPG、PNG形式）
                  </FormDescription>
                  <FormMessage />
                  {previewImage && (
                    <div className="mt-4">
                      <img
                        src={previewImage}
                        alt="プレビュー"
                        width={200}
                        height={200}
                        className="object-cover rounded-md"
                      />
                    </div>
                  )}
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={
                formMethod.formState.isSubmitting ||
                formMethod.formState.isSubmitted
              }
              className="min-w-28"
            >
              {formMethod.formState.isSubmitting ? (
                <Loader className="animate-spin" />
              ) : (
                'レポートを登録'
              )}
            </Button>
          </form>
        </Form>
      </div>
    </>
  )
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
      file => file?.size <= MAX_FILE_SIZE,
      '最大ファイルサイズは10MBです。',
    )
    .refine(
      file => ACCEPTED_IMAGE_TYPES.includes(file?.type),
      'JPG、PNGのみアップロード可能です。',
    ),
})

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 5MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png']
