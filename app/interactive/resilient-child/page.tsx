import type { Metadata } from 'next';
import { InteractiveLayout } from '@/components/interactive/InteractiveLayout';
import { BaseChart, DonutChart } from '@/components/interactive/Charts';

export const metadata: Metadata = {
  title: 'Interactive Guide: Raising a Resilient Child',
  description:
    'Explore the neuroscience, childcare choices, and co-regulation practices behind resilient, low-stress parenting — with visuals and actionable checklists.',
  alternates: { canonical: 'https://www.nostress.ai/interactive/resilient-child' },
  openGraph: {
    title: 'Interactive Guide: Raising a Resilient Child',
    description:
      'Dive into the golden window of brain growth, the daycare decision, tantrum frameworks, and daily resilience builders through interactive visuals.',
    type: 'article',
    url: 'https://www.nostress.ai/interactive/resilient-child'
  }
};

const brainGrowthConfig = {
  type: 'bar',
  data: {
    labels: ['Right Hemisphere Development'],
    datasets: [
      {
        label: '% complete by age 3',
        data: [85],
        backgroundColor: '#D6A34A',
        borderColor: '#B7791F',
        borderWidth: 1,
        borderRadius: 8
      }
    ]
  },
  options: {
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        beginAtZero: true,
        max: 100,
        grid: { color: 'rgba(214, 163, 74, 0.2)' }
      },
      y: {
        ticks: { color: '#78350F', font: { weight: 'bold' } },
        grid: { display: false }
      }
    },
    plugins: { legend: { display: false } }
  }
} satisfies Parameters<typeof BaseChart>[0]['config'];

const cortisolDonut = {
  labels: ['Cortisol rises in daycare day', 'Cortisol falls at home'],
  data: [65, 35],
  colors: ['#B45309', '#F5F5F4']
};

const tantrumFrameworks = [
  {
    title: 'Empathy First (Komisar)',
    points: [
      'Recognise tantrum as dysregulation, not manipulation.',
      'Connect at eye-level, validate feeling before limits.',
      'Remain the “external nervous system” until calm returns.'
    ]
  },
  {
    title: 'Positive Discipline',
    points: [
      'Behaviour = communication; discipline should teach.',
      '“Connect before you correct” to keep attachment secure.',
      'Offer limited choices to restore agency while keeping boundaries.'
    ]
  },
  {
    title: '1-2-3 Magic',
    points: [
      'Provide two calm warnings, then brief reset without debate.',
      'No lectures mid-tantrum—keep tone neutral to avoid escalation.',
      'Follow through consistently so the child trusts the boundary.'
    ]
  },
  {
    title: 'Behavioural Reinforcement',
    points: [
      'Ensure safety; if attention-seeking, reduce reinforcement.',
      'Praise calm behaviour immediately to encode desired response.',
      'Track triggers to pre-empt dysregulation with co-regulation rituals.'
    ]
  }
];

const dailyBuilders = [
  {
    title: 'Nutrition & Rhythm',
    description:
      'Steady blood sugar (protein & complex carbs) + hydration protect mood and attention. Pair meals with calm sensory input (soft music, predictable seating).'
  },
  {
    title: 'Sleep Hygiene',
    description:
      'Protect the evening landing strip: dim lights, screens off, consistent wind-down cues. Morning sunlight anchors circadian rhythm and cortisol slope.'
  },
  {
    title: 'Workflow Relief',
    description:
      'Externalise schedules — visual timetables, prompt cards, checklists. Lightweight automations (AI summaries, shared boards) reduce parental cognitive load.'
  },
  {
    title: 'Analog Anchors',
    description:
      'Breath cards, tactile fidgets, mindful colouring batches keep kids connected to their bodies. Use them proactively before known transition stressors.'
  }
];

export default function ResilientChildInteractivePage() {
  return (
    <div className="min-h-screen bg-amber-50 text-stone-800">
      <header className="mx-auto max-w-4xl px-5 pt-12 text-center sm:px-8">
        <p className="text-xs font-medium uppercase tracking-[0.35em] text-amber-700">Interactive Guide</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-amber-900 sm:text-4xl lg:text-5xl">
          Raising a Resilient Child in a High-Stress World
        </h1>
        <p className="mt-4 text-base text-stone-600 sm:text-lg">
          Visualise the science of early attachment, evaluate childcare choices, and master co-regulation scripts with this interactive companion to the
          article.
        </p>
      </header>

      <InteractiveLayout
        tabs={[
          { id: 'golden-window', label: 'Golden Window' },
          { id: 'daycare-decision', label: 'Daycare Decision' },
          { id: 'tantrum-toolkit', label: 'Tantrum Toolkit' },
          { id: 'daily-builders', label: 'Daily Builders' }
        ]}
      >
        <section id="golden-window" className="space-y-12">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-amber-900">Why the first 1,000 days matter</h2>
            <p className="mt-2 text-stone-600">
              Right hemisphere networks for attachment and stress regulation grow fast between birth and age three — they need responsive co-regulation,
              not constant stimulation.
            </p>
          </div>
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <article className="rounded-3xl border border-amber-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-amber-900">Right brain before left brain</h3>
              <p className="mt-3 text-sm text-stone-700">
                Serve-and-return moments (eye contact, soothing touch, mirroring) wire the circuits that later make self-regulation possible. Every “you’re
                safe, I’m here” is a stress-buffering neural investment.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-stone-700">
                <li>• The brain reaches ~85% of adult volume by age three.</li>
                <li>• Right hemisphere dominance: emotion regulation & attachment.</li>
                <li>• Chronic stress during this phase = long-term cortisol dysregulation.</li>
              </ul>
            </article>
            <article className="rounded-3xl border border-amber-200 bg-white p-6 shadow-sm">
              <h3 className="text-center text-sm font-semibold uppercase tracking-[0.3em] text-amber-700">Visual Spotlight</h3>
              <div className="relative mt-4 h-64">
                <BaseChart config={brainGrowthConfig} />
              </div>
              <p className="mt-3 text-center text-xs text-stone-500">Source: neuroimaging studies (Chiron et al., 1997; LENA early development reports).</p>
            </article>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                title: 'Attachment = stress buffer',
                detail: 'Secure attachment lowers baseline cortisol, boosts resilience to later stressors.'
              },
              {
                title: 'Co-regulation reps',
                detail: 'Each calm, empathic response models the nervous system state the child will recreate alone later.'
              },
              {
                title: 'Playful left-brain later',
                detail: 'Structured learning & independence land better once the emotional brain trusts the environment.'
              }
            ].map((card) => (
              <div key={card.title} className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
                <h4 className="text-base font-semibold text-amber-900">{card.title}</h4>
                <p className="mt-2 text-sm text-stone-700">{card.detail}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="daycare-decision" className="space-y-12">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-amber-900">High-stress vs. high-quality care</h2>
            <p className="mt-2 text-stone-600">
              The data doesn’t condemn daycare — it highlights quality. Understand what raises cortisol and what builds capacity.
            </p>
          </div>
          <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
            <article className="rounded-3xl border border-amber-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-amber-900">What spikes stress?</h3>
              <ul className="mt-4 space-y-2 text-sm text-stone-700">
                <li>
                  • High ratios (&gt;4:1 toddlers), rotating caregivers, low sensitivity scores.
                </li>
                <li>• Over-stimulating environments without quiet co-regulation corners.</li>
                <li>• Lack of continuity between home rhythms and centre routines.</li>
                <li>• Quebec & NICHD studies track higher cortisol and aggression in such settings.</li>
              </ul>
            </article>
            <article className="rounded-3xl border border-amber-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-amber-900">What builds resilience?</h3>
              <ul className="mt-4 space-y-2 text-sm text-stone-700">
                <li>• Low turnover, primary caregiver model, responsive comforting.</li>
                <li>• Language-rich narration with plenty of serve-and-return play.</li>
                <li>• Predictable transitions, integration with family attachment rituals.</li>
                <li>• Balanced sensory input: cosy corners + outdoor time.</li>
              </ul>
            </article>
          </div>
          <div className="grid gap-6 lg:grid-cols-[0.5fr_1.5fr]">
            <div className="rounded-3xl border border-amber-200 bg-white p-5 shadow-sm">
              <h3 className="text-center text-sm font-semibold uppercase tracking-[0.3em] text-amber-700">Cortisol Profile</h3>
              <div className="relative mx-auto my-4 h-56 w-full max-w-[220px]">
                <DonutChart labels={cortisolDonut.labels} data={cortisolDonut.data} colors={cortisolDonut.colors} />
              </div>
              <p className="text-center text-xs text-stone-500">NICHD: majority of toddlers in institutional care show cortisol elevation across the day.</p>
            </div>
            <div className="rounded-3xl border border-amber-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-amber-900">Tour checklist</h3>
              <div className="mt-4 grid gap-3 text-sm text-stone-700 md:grid-cols-2">
                {[
                  'Ask about staff tenure & child-to-adult ratios.',
                  'Observe whether caregivers are on the floor, narrating, comforting.',
                  'Check for quiet spaces where kids can retreat and co-regulate.',
                  'Confirm communication cadence with families (photos, daily notes, shared rhythms).',
                  'Look for outdoor play and sensory balance versus constant bright stimulation.',
                  'Match discipline philosophy with your home approach (no shaming, punitive isolation).'
                ].map((item) => (
                  <div key={item} className="rounded-2xl border border-stone-100 bg-amber-50/70 p-3">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="tantrum-toolkit" className="space-y-10">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-amber-900">Co-regulation scripts for meltdowns</h2>
            <p className="mt-2 text-stone-600">
              Tantrums are dysregulation. Stay their external brakes with empathy first, then calm structure.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {tantrumFrameworks.map((framework) => (
              <article key={framework.title} className="rounded-3xl border border-amber-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-amber-900">{framework.title}</h3>
                <ul className="mt-3 space-y-2 text-sm text-stone-700">
                  {framework.points.map((point) => (
                    <li key={point}>• {point}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
          <div className="rounded-3xl border border-amber-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-amber-900">When you feel yourself tipping</h3>
            <p className="mt-2 text-sm text-stone-700">
              Use a two-step self-regulation routine before responding. Pause, ground your breath, and remind yourself: “My calm is the fastest way to their
              calm.” Only then offer empathy and limits.
            </p>
            <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm text-stone-700">
              <li>Inhale 4 seconds, hold 2, exhale 6. Repeat twice.</li>
              <li>Name what you see (“You’re so frustrated…”) before redirecting.</li>
            </ol>
          </div>
        </section>

        <section id="daily-builders" className="space-y-10">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-amber-900">Daily resilience builders</h2>
            <p className="mt-2 text-stone-600">
              Layer gentle habits across the nutrition, sleep, workflow, and analog pillars to keep the household nervous system regulated.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {dailyBuilders.map((builder) => (
              <article key={builder.title} className="rounded-3xl border border-amber-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-amber-900">{builder.title}</h3>
                <p className="mt-2 text-sm text-stone-700">{builder.description}</p>
              </article>
            ))}
          </div>
          <div className="rounded-3xl border border-amber-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-amber-900">Weekly reflection prompts</h3>
            <ul className="mt-3 space-y-2 text-sm text-stone-700">
              <li>• When was my child most dysregulated, and what preceded it?</li>
              <li>• Which co-regulation rituals worked best this week?</li>
              <li>• Where can AI or analog tools reduce tomorrow’s friction?</li>
              <li>• Did I keep a predictable landing strip before bedtime?</li>
            </ul>
          </div>
        </section>
      </InteractiveLayout>

      <footer className="mt-16 border-t border-amber-200 bg-amber-100/40 py-6 text-center text-sm text-stone-600">
        Interactive companion · NoStress AI parenting lab
      </footer>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            name: 'Interactive Guide: Raising a Resilient Child',
            url: 'https://www.nostress.ai/interactive/resilient-child',
            about: [
              'Attachment security',
              'Daycare quality',
              'Tantrum co-regulation',
              'Family resilience routines'
            ],
            inLanguage: 'en'
          })
        }}
      />
    </div>
  );
}
