import {
  ArrowRight,
  BadgeCheck,
  BrainCircuit,
  ClipboardList,
  Search,
  Sparkles,
  ShieldCheck,
  Wand2,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAppSettings } from '../context/AppSettingsContext.jsx'

export default function LearnMorePage() {
  const navigate = useNavigate()
  const { t } = useAppSettings()

  return (
    <div className="min-h-dvh bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-slate-100">
      <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/70 backdrop-blur dark:border-slate-800 dark:bg-slate-900/70">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            ← {t('back')}
          </button>
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-gradient-to-r from-blue-600/10 to-purple-600/10 px-3 py-1.5 text-xs font-medium text-blue-700 dark:border-blue-900 dark:text-blue-300">
            <Sparkles className="h-3.5 w-3.5" />
            SchemeScout
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/2 top-[-9rem] h-[30rem] w-[30rem] -translate-x-1/2 rounded-full bg-gradient-to-tr from-blue-500/25 to-purple-500/25 blur-3xl" />
          </div>

          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
            <div className="mx-auto max-w-3xl text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-4 py-2 text-xs font-medium text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-200">
                <Wand2 className="h-4 w-4 text-blue-600 dark:text-blue-300" />
                Modern eligibility discovery, simplified
              </div>

              <h1 className="mt-6 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
                Learn more about SchemeScout
              </h1>
              <p className="mt-4 text-pretty text-base leading-relaxed text-slate-600 dark:text-slate-300 sm:text-lg">
                Find the most relevant government schemes based on your profile, with AI
                explanations that are easy to understand.
              </p>

              <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
                <button
                  type="button"
                  onClick={() => navigate('/signup')}
                  className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-blue-500/25 transition hover:-translate-y-0.5 hover:brightness-110"
                >
                  Try Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    document
                      .getElementById('how-it-works')
                      ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  }
                  className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  How It Works
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-semibold tracking-tight">How It Works</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Three steps to get personalized scheme suggestions.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              {
                icon: <Search className="h-5 w-5" />,
                title: 'Enter your details',
                text: 'Tell us your age, category, state, and income in a simple form.',
              },
              {
                icon: <BrainCircuit className="h-5 w-5" />,
                title: 'We match & explain',
                text: 'We filter schemes and use AI to explain eligibility in plain language.',
              },
              {
                icon: <ClipboardList className="h-5 w-5" />,
                title: 'Apply confidently',
                text: 'Save schemes and apply using a guided application flow.',
              },
            ].map((step) => (
              <div
                key={step.title}
                className="rounded-3xl border border-slate-200/80 bg-white/70 p-6 shadow-sm backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/70"
              >
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-sm shadow-blue-500/20">
                  {step.icon}
                </div>
                <h3 className="text-sm font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-semibold tracking-tight">Features</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Built like a premium SaaS product: fast, clean, and user-first.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: <BadgeCheck className="h-5 w-5" />,
                title: 'Eligibility-first search',
                text: 'See schemes you can actually apply for based on your profile.',
              },
              {
                icon: <Sparkles className="h-5 w-5" />,
                title: 'AI explanations',
                text: 'Understand why you match in simple, friendly language.',
              },
              {
                icon: <ShieldCheck className="h-5 w-5" />,
                title: 'Saved schemes',
                text: 'Bookmark schemes and revisit anytime from your dashboard.',
              },
            ].map((f) => (
              <div
                key={f.title}
                className="rounded-3xl border border-slate-200/80 bg-white/70 p-6 shadow-sm backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/70"
              >
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600/10 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
                  {f.icon}
                </div>
                <h3 className="text-sm font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{f.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Benefits */}
        <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">Benefits</h2>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                SchemeScout reduces confusion and helps you take action faster — like a
                premium assistant for public benefits.
              </p>
              <ul className="mt-6 space-y-3 text-sm text-slate-700 dark:text-slate-200">
                {[
                  'Less time searching, more time applying',
                  'Clear eligibility explanations',
                  'Bookmark & track schemes you care about',
                ].map((b) => (
                  <li key={b} className="flex items-start gap-2">
                    <BadgeCheck className="mt-0.5 h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl border border-slate-200/80 bg-white/70 p-6 shadow-sm backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/70">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                Example use case
              </p>
              <p className="mt-3 text-sm text-slate-700 dark:text-slate-200">
                “I’m a student from Delhi with family income under 3L. SchemeScout shows
                scholarships I’m eligible for and explains the exact next steps.”
              </p>
              <div className="mt-5 rounded-2xl border border-blue-200/60 bg-gradient-to-r from-blue-600/10 to-purple-600/10 p-4 text-sm text-slate-700 dark:border-blue-900 dark:text-slate-200">
                AI tip: Save 2–3 schemes first, then apply one-by-one.
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
          <div className="rounded-3xl border border-blue-200/60 bg-gradient-to-r from-blue-600/15 via-indigo-500/15 to-purple-600/15 p-8 text-center shadow-md shadow-blue-500/10 backdrop-blur-xl dark:border-blue-900">
            <h2 className="text-2xl font-semibold tracking-tight">Ready to try?</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Jump to the eligibility form and get recommended schemes in seconds.
            </p>
            <button
              type="button"
              onClick={() => navigate('/signup')}
              className="mt-6 inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-blue-500/25 transition hover:brightness-110"
            >
              Try Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        </section>
      </main>
    </div>
  )
}

