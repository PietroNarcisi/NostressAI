import { ReactNode } from 'react';

export function SectionHeading({ title, eyebrow, action }: { title: string; eyebrow?: string; action?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div>
        {eyebrow && (
          <p className="text-[0.7rem] font-medium uppercase tracking-[0.35em] text-primary-500/80 dark:text-primary-300/80">
            {eyebrow}
          </p>
        )}
        <h2 className="font-serif text-2xl font-semibold tracking-tight text-neutral-700 dark:text-neutral-50 md:text-[1.7rem]">
          {title}
        </h2>
      </div>
      {action && <div className="mt-2 md:mt-0">{action}</div>}
    </div>
  );
}
