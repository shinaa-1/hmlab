import Link from 'next/link';
export const dynamic = 'force-dynamic';
export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <nav className="border-b border-slate-800 px-6 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-indigo-400">H+M Lab</div>
        <div className="space-x-4">
          <Link href="/login" className="text-slate-300 hover:text-white">Login</Link>
          <Link href="/register" className="bg-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-700">Get Started</Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto text-center pt-20 px-4">
        <h1 className="text-5xl font-bold mb-6">Human Voice, Machine Precision</h1>
        <p className="text-xl text-slate-400 mb-8">
          Create stunning AI voices, clone your own voice, and generate professional audio in seconds.
        </p>
        <div className="space-x-4">
          <Link href="/register" className="bg-indigo-600 px-8 py-3 rounded-xl text-lg font-semibold hover:bg-indigo-700 inline-block">
            Start Free
          </Link>
          <Link href="/pricing" className="border border-slate-700 px-8 py-3 rounded-xl text-lg hover:border-slate-500 inline-block">
            View Pricing
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-20 px-4 pb-20">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { title: 'Text to Speech', desc: 'Type anything. Hear it spoken naturally in 50+ voices.' },
            { title: 'Voice Cloning', desc: 'Upload 1 minute of your voice. Clone it perfectly.' },
            { title: 'Studio Quality', desc: 'Export in MP3, WAV, or OGG. Commercial ready.' },
          ].map((f) => (
            <div key={f.title} className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
              <h3 className="text-xl font-bold mb-2 text-indigo-400">{f.title}</h3>
              <p className="text-slate-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}