"use client";

import { useMemo, useState } from 'react';
import type { ChartConfiguration } from 'chart.js/auto';
import { BaseChart, DonutChart } from '@/components/interactive/Charts';

type MainSection = 'thesis' | 'research';
type ResearchCategory = 'stats' | 'daycare' | 'hormones' | 'balance';

const THESIS_STEPS = [
  {
    title: 'Insight 1: The “Truth”',
    summary: 'A societal shift away from prioritising early parental presence drives the crisis.',
    detail:
      'The child mental health crisis—ADHD, anxiety, dysregulation—is not random. Chronic stress in infants and toddlers emerges when parental presence, especially maternal co-regulation during 0–3 years, is deprioritised.'
  },
  {
    title: 'Insight 2: The “Mechanism”',
    summary: 'Lack of co-regulation damages the brain’s stress circuitry and attachment.',
    detail:
      'Persistent absence overwhelms the developing amygdala–hippocampus system and produces insecure attachment, the foundational vulnerability for later mental health challenges.'
  },
  {
    title: 'Insight 3: The “Controversy”',
    summary: 'Modern defaults (institutional daycare, role confusion) amplify stress inputs.',
    detail:
      'High-stress institutional care during the critical window plus confusion around distinct nurturing roles (soothing vs. challenging) reduce access to the exact inputs children need for resilience.'
  }
] as const;

const RESEARCH_NAV: { id: ResearchCategory; label: string }[] = [
  { id: 'stats', label: 'Core Validation' },
  { id: 'daycare', label: 'Daycare & Development' },
  { id: 'hormones', label: 'Hormones & Roles' },
  { id: 'balance', label: 'Balancing Views' }
];

export default function ResearchBriefPage() {
  const [mainSection, setMainSection] = useState<MainSection>('thesis');
  const [category, setCategory] = useState<ResearchCategory>('stats');
  const [expandedStep, setExpandedStep] = useState<number | null>(null);

  const brainChartConfig = useMemo<ChartConfiguration>(
    () => ({
      type: 'bar',
      data: {
        labels: ['Right Brain Development'],
        datasets: [
          {
            label: '% by age 3',
            data: [85],
            backgroundColor: '#c28d2d',
            borderColor: '#a16207',
            borderWidth: 1,
            borderRadius: 6
          }
        ]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            beginAtZero: true,
            max: 100,
            ticks: {
              callback: (value) => `${value}%`
            },
            grid: { color: 'rgba(168, 162, 158, 0.2)' }
          },
          y: {
            ticks: {
              font: { size: 12, weight: 'bold' },
              color: '#78350f'
            },
            grid: { display: false }
          }
        },
        plugins: { legend: { display: false } }
      }
    }),
    []
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 text-stone-800 md:px-8 lg:px-12">
      <header className="mb-10 text-center md:mb-14">
        <h1 className="text-3xl font-semibold tracking-tight text-amber-900 sm:text-4xl lg:text-5xl">
          NoStress AI · Research Brief Hub
        </h1>
        <p className="mt-3 text-lg text-stone-600 sm:text-xl">
          Mapping the evidence behind “modern parenting stress” and how we rebuild resilience.
        </p>
      </header>

      <nav className="mb-8 flex justify-center gap-3">
        <button
          type="button"
          onClick={() => setMainSection('thesis')}
          className={`rounded-full px-5 py-2 text-sm font-medium transition ${
            mainSection === 'thesis' ? 'bg-amber-800 text-white shadow-md' : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
          }`}
        >
          Core Thesis
        </button>
        <button
          type="button"
          onClick={() => setMainSection('research')}
          className={`rounded-full px-5 py-2 text-sm font-medium transition ${
            mainSection === 'research' ? 'bg-amber-800 text-white shadow-md' : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
          }`}
        >
          Research Dashboard
        </button>
      </nav>

      {mainSection === 'thesis' && (
        <section className="mx-auto max-w-4xl space-y-6">
          <p className="text-center text-stone-600">
            Tap each insight to expand the causal argument distilled from the DOAC Phase 3 transcript.
          </p>
          {THESIS_STEPS.map((step, index) => (
            <div key={step.title} className="space-y-2">
              <button
                type="button"
                onClick={() => setExpandedStep((prev) => (prev === index ? null : index))}
                className="w-full rounded-2xl border border-amber-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
              >
                <h3 className="text-lg font-semibold text-amber-900">{step.title}</h3>
                <p className="text-sm text-stone-700">{step.summary}</p>
                {expandedStep === index && (
                  <p className="mt-3 text-sm text-stone-700">
                    <strong>Full insight:</strong> {step.detail}
                  </p>
                )}
              </button>
              {index < THESIS_STEPS.length - 1 && (
                <div className="flex justify-center">
                  <span className="text-amber-600">▼</span>
                </div>
              )}
            </div>
          ))}
        </section>
      )}

      {mainSection === 'research' && (
        <section className="space-y-8">
          <p className="mx-auto max-w-4xl text-center text-stone-600">
            Explore validation questions and counterpoints organised by theme. Each cluster includes target claims, suggested sources, and planned
            visualisations.
          </p>

          <div className="flex flex-wrap justify-center gap-2">
            {RESEARCH_NAV.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setCategory(item.id)}
                className={`rounded-full px-4 py-1.5 text-xs font-medium transition sm:text-sm ${
                  category === item.id
                    ? 'bg-amber-700 text-white shadow'
                    : 'bg-amber-50 text-amber-700 ring-1 ring-amber-200 hover:bg-amber-100'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {category === 'stats' && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <article className="flex h-full flex-col rounded-2xl border border-stone-200 bg-white p-5 shadow-md">
                <h4 className="text-lg font-semibold text-amber-800">Claim: “1 in 5” children</h4>
                <p className="text-sm text-stone-600">
                  <strong>Research goal:</strong> confirm 2024/2025 prevalence data for childhood mental illness. Prioritise WHO, CDC, global meta-analyses.
                </p>
              </article>

              <article className="rounded-2xl border border-stone-200 bg-white p-5 shadow-md">
                <h4 className="text-center text-lg font-semibold text-amber-800">Visual target</h4>
                <div className="mx-auto my-4 h-64 w-full max-w-xs">
                  <DonutChart labels={['1 in 5 (20%)', 'Other (80%)']} data={[20, 80]} colors={['#c28d2d', '#d6d3d1']} />
                </div>
                <p className="text-center text-xs text-stone-500">Part-to-whole visual for headline prevalence claim.</p>
              </article>

              <article className="rounded-2xl border border-stone-200 bg-white p-5 shadow-md">
                <h4 className="text-center text-lg font-semibold text-amber-800">Visual target</h4>
                <div className="mx-auto my-4 h-64 w-full max-w-xs">
                  <BaseChart config={brainChartConfig} />
                </div>
                <p className="text-center text-xs text-stone-500">Single-metric bar for the “85% of right brain by age three” claim.</p>
              </article>

              <article className="flex h-full flex-col rounded-2xl border border-stone-200 bg-white p-5 shadow-md lg:col-span-2">
                <h4 className="text-lg font-semibold text-amber-800">Claim: ADHD as stress response</h4>
                <p className="text-sm text-stone-600">
                  <strong>Research goal:</strong> find experts linking ADHD to chronic early stress while collecting mainstream counterpoints (purely
                  neurodevelopmental framing). Capture mechanisms, biomarkers, and intervention outcomes.
                </p>
              </article>
            </div>
          )}

          {category === 'daycare' && (
            <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
              <article className="rounded-2xl border border-stone-200 bg-white p-5 shadow-md">
                <h4 className="text-lg font-semibold text-amber-800">Daycare & cortisol</h4>
                <p className="text-sm text-stone-600">
                  <strong>Goal:</strong> retrieve NICHD, Quebec, and similar studies on salivary cortisol and socio-emotional outcomes in institutional care,
                  isolating quality variables (ratios, turnover, sensitivity scores).
                </p>
              </article>
              <article className="rounded-2xl border border-stone-200 bg-white p-5 shadow-md">
                <h4 className="text-lg font-semibold text-amber-800">Parallel play & socialisation</h4>
                <p className="text-sm text-stone-600">
                  <strong>Goal:</strong> examine developmental research on social needs <span className="whitespace-nowrap">0–3 yrs.</span> Validate or challenge
                  the claim that peer socialisation is non-essential pre-three.
                </p>
              </article>
            </div>
          )}

          {category === 'hormones' && (
            <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
              <article className="rounded-2xl border border-stone-200 bg-white p-5 shadow-md">
                <h4 className="text-lg font-semibold text-amber-800">Hormones & nurturing</h4>
                <p className="text-sm text-stone-600">
                  <strong>Goal:</strong> source endocrinology findings on oxytocin vs. vasopressin in caregiving contexts—do they map to empathic vs. playful
                  behavioural patterns?
                </p>
              </article>
              <article className="rounded-2xl border border-stone-200 bg-white p-5 shadow-md">
                <h4 className="text-lg font-semibold text-amber-800">Paternal care & testosterone</h4>
                <p className="text-sm text-stone-600">
                  <strong>Goal:</strong> review longitudinal studies on how intensive childcare time affects paternal testosterone and caregiving sensitivity.
                </p>
              </article>
            </div>
          )}

          {category === 'balance' && (
            <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
              <article className="rounded-2xl border border-stone-200 bg-white p-5 shadow-md">
                <h4 className="text-lg font-semibold text-amber-800">Benefits of modern daycare</h4>
                <p className="text-sm text-stone-600">
                  <strong>Goal:</strong> capture pro-daycare findings (language growth, executive function), especially from high-quality programmes, to ensure a
                  balanced narrative.
                </p>
              </article>
              <article className="rounded-2xl border border-stone-200 bg-white p-5 shadow-md">
                <h4 className="text-lg font-semibold text-amber-800">Alternative tantrum frameworks</h4>
                <p className="text-sm text-stone-600">
                  <strong>Goal:</strong> compare Komisar’s co-regulation model with Positive Discipline, 1-2-3 Magic, CBT-informed approaches, capturing evidence
                  for each.
                </p>
              </article>
            </div>
          )}
        </section>
      )}

      <footer className="mt-16 border-t border-amber-200 pt-6 text-center text-sm text-stone-500">
        Interactive research brief · curated by NoStress AI
      </footer>
    </div>
  );
}
