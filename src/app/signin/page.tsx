import { redirect } from 'next/navigation';

// Old sign-in route — permanently redirect to the new Clerk-powered page
export default function OldSignInPage() {
  redirect('/sign-in');
}
