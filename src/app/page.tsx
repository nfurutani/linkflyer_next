import { redirect } from 'next/navigation'

export default function HomePage() {
  // デフォルトでnaof219（Iori）のプロファイルページにリダイレクト
  redirect('/naof219')
}