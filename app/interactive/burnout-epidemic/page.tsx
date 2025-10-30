import type { Metadata } from 'next';
import React from 'react';
import { InteractiveLayout } from '@/components/interactive/InteractiveLayout';
import { HorizontalBarChart, DonutChart } from '@/components/interactive/Charts';

export const metadata: Metadata = {
  title: 'Interactive Report: Burnout Epidemic',
  description: 'Interactive exploration of modern workplace burnout: scale, causes, impact, solutions.',
  alternates: { canonical: 'https://www.nostress.ai/interactive/burnout-epidemic' },
  openGraph: {
    title: 'Interactive Report: Burnout Epidemic',
    description: 'Interactive exploration of modern workplace burnout: scale, causes, impact, solutions.',
    type: 'article',
    url: 'https://www.nostress.ai/interactive/burnout-epidemic'
  }
};

function StatCard({ title, value, color, note }: { title: string; value: string; color: string; note?: string }) {
  return (
    <div className="rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-5 shadow-sm transition hover:shadow-md">
      <h3 className="font-semibold text-neutral-700 dark:text-neutral-200 text-base">{title}</h3>
      <p className="text-4xl font-bold mt-2" style={{ color }}>{value}</p>
      {note && <p className="text-xs text-neutral-500 mt-2">{note}</p>}
    </div>
  );
}

export default function BurnoutInteractivePage() {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <header className="text-center pt-12 mb-10 px-4">
        <p className="text-xs font-mono tracking-[0.25em] text-primary-600 dark:text-primary-400 mb-3">INTERACTIVE REPORT</p>
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight bg-gradient-to-r from-primary-500 to-teal-500 bg-clip-text text-transparent mb-4">The Modern Workplace Burnout Epidemic</h1>
        <p className="text-lg md:text-xl max-w-3xl mx-auto text-neutral-600 dark:text-neutral-300">Explore prevalence, root causes, health impact and evidence‑based strategies via interactive visual modules.</p>
      </header>
      <InteractiveLayout
        tabs={[
          { id: 'problem', label: 'The Problem' },
          { id: 'causes', label: 'The Causes' },
          { id: 'impact', label: 'The Impact' },
            { id: 'solutions', label: 'The Solutions' }
        ]}
      >
        <section id="problem" className="space-y-12">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight mb-3">The Scale of the Crisis</h2>
            <p className="text-neutral-600 dark:text-neutral-300">Burnout is a systemic workplace issue with significant human and economic costs. Compare engagement segments and key prevalence indicators below.</p>
          </div>
          <div className="grid lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-1 space-y-5">
              <StatCard title="Global Stress Levels" value="44%" color="#2563EB" note="Employees reporting 'a lot of stress' daily (Gallup 2023)." />
              <StatCard title="Economic Impact" value="$8.8T" color="#DC2626" note="Estimated cost of low engagement ≈ 9% global GDP (Gallup 2023)." />
              <StatCard title="Healthcare Burnout" value="45.6%" color="#D97706" note="US health workers feeling burnout often / very often (CDC 2022)." />
            </div>
            <div className="lg:col-span-2 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-center mb-4">Employee Engagement Status</h3>
              <div className="h-72 relative">
                <HorizontalBarChart data={[23,59,18]} />
              </div>
            </div>
          </div>
        </section>
        <section id="causes" className="space-y-12">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight mb-3">The "Always On" Culture</h2>
            <p className="text-neutral-600 dark:text-neutral-300">Digital saturation blurs boundaries and drives technostress. Core drivers summarised below.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              ['Technostress','Both work & personal platforms elevate psychological strain (Singh 2022).'],
              ['Flexibility Paradox','Tools promising autonomy enforce always‑available norms (Adisa 2022).'],
              ['Work-Home Interference','Boundary erosion lowers engagement & satisfaction (Chi 2021).'],
              ['Remote Factor','Higher engagement but persistent stress vs structured on‑site (Gallup 2023).'],
              ['Lack of Support','Low managerial support amplifies burnout (Rapp 2021).'],
              ['Core Issue','Poor management & culture > location in driving disengagement (Gallup 2023).']
            ].map(([title,desc]) => (
              <div key={title} className="rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-5 shadow-sm hover:shadow-md transition">
                <h3 className="font-semibold mb-2 text-neutral-700 dark:text-neutral-200">{title}</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>
        <section id="impact" className="space-y-12">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight mb-3">Human & Health Impact</h2>
            <p className="text-neutral-600 dark:text-neutral-300">Burnout correlates with anxiety, depression and elevated cardiometabolic risk. Proportional breakdowns below.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-center mb-4">Mental Health Consequences</h3>
              <div className="h-72 relative">
                <DonutChart labels={['Anxiety','Depression','Emotional Exhaustion','Intent to Quit']} data={[25,20,31,23]} colors={['#60A5FA','#FBBF24','#F87171','#9CA3AF']} />
              </div>
              <p className="text-xs mt-4 text-center text-neutral-500">Harassed health workers: odds of anxiety 5x higher; depression 3.4x (CDC 2022).</p>
            </div>
            <div className="rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-center mb-4">Physical Health Consequences</h3>
              <div className="h-72 relative">
                <DonutChart labels={['Ischemic Heart Disease','Stroke','Sleep Disturbances','Musculoskeletal']} data={[35,25,25,15]} colors={['#34D399','#A78BFA','#F472B6','#FBBF24']} />
              </div>
              <p className="text-xs mt-4 text-center text-neutral-500">Long working hours stress linked to hundreds of thousands of annual deaths (WHO/ILO).</p>
            </div>
          </div>
          <div className="rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-center mb-5">Three Dimensions of Burnout (MBI)</h3>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              {[
                ['1','Emotional Exhaustion','Subjective depletion of emotional resources.'],
                ['2','Depersonalization','Detached / cynical attitude toward work.'],
                ['3','Reduced Accomplishment','Lowered sense of efficacy & achievement.']
              ].map(([n,t,d]) => (
                <div key={n}>
                  <div className="h-16 w-16 mx-auto rounded-full flex items-center justify-center text-3xl font-bold bg-gradient-to-br from-primary-500/15 to-teal-500/15 text-primary-600 dark:text-primary-400">{n}</div>
                  <h4 className="font-semibold mt-4 text-neutral-700 dark:text-neutral-200">{t}</h4>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1 leading-relaxed">{d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section id="solutions" className="space-y-12">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight mb-3">Strategies & Protective Factors</h2>
            <p className="text-neutral-600 dark:text-neutral-300">Dual approach: structural redesign + individual recovery protocols. Summaries below.</p>
          </div>
          <div className="rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Organizational Essentials (US Surgeon General)</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-neutral-700 dark:text-neutral-300">
              <li><strong>Protection from Harm</strong> – adequate staffing, safety, anti-harassment.</li>
              <li><strong>Connection & Community</strong> – relational support lowers burnout odds.</li>
              <li><strong>Work-Life Harmony</strong> – respect for non‑work boundaries (top worker priority).</li>
              <li><strong>Mattering at Work</strong> – reinforce contribution & meaning.</li>
              <li><strong>Opportunity for Growth</strong> – clear learning & advancement pathways.</li>
            </ol>
          </div>
          <div className="rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Individual Strategies (Evidence‑Based)</h3>
            <ul className="space-y-2 text-sm text-neutral-700 dark:text-neutral-300">
              <li><strong>Mindfulness / CBT / ACT</strong> – reduces stress reactivity.</li>
              <li><strong>Digital Boundary Setting</strong> – structured availability windows.</li>
              <li><strong>Social Support Seeking</strong> – leverage EAP / peer networks.</li>
              <li><strong>Physiological Recovery</strong> – micro-breaks & sleep hygiene cycles.</li>
              <li><strong>Expressive Writing</strong> – narrative processing for stressors.</li>
            </ul>
            <p className="text-xs mt-4 italic text-neutral-500">Meta-analyses: combined structural + individual interventions outperform isolated approaches.</p>
          </div>
        </section>
      </InteractiveLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            name: 'Interactive Burnout Report',
            url: 'https://www.nostress.ai/interactive/burnout-epidemic',
            about: 'Burnout prevalence, causes, impacts and solutions.',
            inLanguage: 'en'
          })
        }}
      />
    </div>
  );
}
