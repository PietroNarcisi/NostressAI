'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  return (
    <div className="space-y-8 max-w-xl">
      <h1 className="text-3xl font-semibold tracking-tight">Contact</h1>
      <p className="text-neutral-600 dark:text-neutral-300">Question, collaboration or specific need? Write to me.</p>
      {sent ? (
        <div className="p-4 rounded-md border border-green-300 bg-green-50 text-green-700 text-sm">Message (simulated) sent. Implement real delivery later.</div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-xs font-medium mb-1">Name</label>
            <input required name="name" className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Email</label>
            <input required name="email" type="email" className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Message</label>
            <textarea required name="message" rows={5} className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2 text-sm" />
          </div>
          <Button type="submit">Send</Button>
        </form>
      )}
      <p className="text-xs text-neutral-500">Delivery not wired yet. Add an email service (Resend / Brevo) later.</p>
    </div>
  );
}
