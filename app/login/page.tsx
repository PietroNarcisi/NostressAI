import Link from 'next/link';
import { LoginForm } from './LoginForm';

export const metadata = {
  title: 'Admin Login',
  description: 'Sign in to manage NoStress AI content and courses.'
};

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md py-16">
      <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/70 backdrop-blur px-8 py-10 shadow-sm">
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">Welcome back</h1>
        <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
          Sign in with your administrator credentials to access the dashboard.
        </p>
        <div className="mt-8">
          <LoginForm />
        </div>
      </div>
      <p className="mt-6 text-center text-sm text-neutral-500 dark:text-neutral-400">
        <Link href="/" className="text-primary-600 dark:text-primary-400 hover:underline">
          ← Back to site
        </Link>
      </p>
    </div>
  );
}
