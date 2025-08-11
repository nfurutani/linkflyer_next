export default function HomePage() {
  // 一時的にシンプルなホームページを表示
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">
          🎵 LinkFlyer Next
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Music Discovery Platform
        </p>
        <div className="space-y-4">
          <a 
            href="/naof219" 
            className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition"
          >
            View Profile: naof219
          </a>
          <div className="text-sm text-gray-500">
            <p>✅ Next.js 15 Production Build</p>
            <p>✅ Vercel Deployment</p>
            <p>🔧 Debugging Environment Variables</p>
          </div>
        </div>
      </div>
    </div>
  )
  
  // 元のリダイレクトコード（コメントアウト）
  // redirect('/naof219')
}