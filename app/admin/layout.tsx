import { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getAuthContext } from '@/lib/auth';
import { logoutAndRedirect } from '@/app/login/actions';

export const metadata = {
  title: 'Admin Dashboard'
};

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const { user, role } = await getAuthContext();

  if (!user) {
    redirect('/login');
  }

  if (role !== 'admin') {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <header className="border-b border-neutral-200 dark:border-neutral-800 bg-white/60 dark:bg-neutral-900/70 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4 text-sm">
          <div>
            <Link href="/admin" className="font-semibold text-neutral-900 dark:text-neutral-100">
              NoStress AI Admin
            </Link>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">Signed in as {user.email ?? 'admin'}.</p>
          </div>
          <form action={logoutAndRedirect}>
            <button
              type="submit"
              className="rounded-full border border-neutral-300 dark:border-neutral-700 px-3 py-1 text-xs font-medium text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800"
            >
              Sign out
            </button>
          </form>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-5 py-10">{children}</main>
    </div>
  );
}
