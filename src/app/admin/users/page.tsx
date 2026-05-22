import { createAdminClient } from '@/lib/supabase/admin';
import { requireAdmin } from '@/lib/auth/admin';
import { setUserAdmin } from './_actions';

interface PageProps {
  searchParams: Promise<{ ok?: string; error?: string }>;
}

const OK_NOTICE: Record<string, string> = {
  granted:         'Admin access granted.',
  revoked:         'Admin access revoked.',
  profile_created: 'Profile created.',
};

function shortDate(iso: string | null | undefined): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default async function AdminUsersPage({ searchParams }: PageProps) {
  const { user: currentUser } = await requireAdmin('/admin/users');
  const sp = await searchParams;
  const admin = createAdminClient();

  // List auth users (emails live here) + all profiles (admin flag + name)
  const [{ data: authData, error: authErr }, { data: profileRows }] = await Promise.all([
    admin.auth.admin.listUsers({ perPage: 200 }),
    admin.from('profiles').select('id, display_name, is_admin'),
  ]);

  if (authErr) {
    return (
      <div role="alert" className="rounded-lg border border-red-500/30 bg-red-500/[0.06] p-4 text-sm text-red-300">
        Failed to list users: {authErr.message}
      </div>
    );
  }

  const profileById = new Map(
    (profileRows ?? []).map((p) => [
      (p as { id: string }).id,
      p as { id: string; display_name: string | null; is_admin: boolean | null },
    ]),
  );

  const users = (authData?.users ?? []).map((u) => {
    const profile = profileById.get(u.id);
    return {
      id: u.id,
      email: u.email ?? '(no email)',
      displayName: profile?.display_name ?? null,
      isAdmin: profile?.is_admin ?? false,
      hasProfile: Boolean(profile),
      createdAt: u.created_at,
      lastSignIn: u.last_sign_in_at ?? null,
    };
  });
  users.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

  const adminCount = users.filter((u) => u.isAdmin).length;

  return (
    <section aria-labelledby="users-heading">
      {sp.ok && OK_NOTICE[sp.ok] && (
        <div role="status" aria-live="polite" className="mb-4 rounded-lg border border-emerald-500/30 bg-emerald-500/[0.06] p-3 text-sm text-emerald-300">
          {OK_NOTICE[sp.ok]}
        </div>
      )}
      {sp.error && (
        <div role="alert" aria-live="assertive" className="mb-4 rounded-lg border border-red-500/30 bg-red-500/[0.06] p-3 text-sm text-red-300">
          {sp.error}
        </div>
      )}

      <header className="mb-6">
        <h1 id="users-heading" className="text-2xl font-black tracking-tight text-white">
          Users
        </h1>
        <p className="mt-1 text-sm text-gray-400">
          {users.length} registered · {adminCount} admin{adminCount === 1 ? '' : 's'}
        </p>
      </header>

      {users.length === 0 ? (
        <div className="rounded-2xl border border-white/[0.07] bg-brand-card p-10 text-center">
          <p className="text-base text-gray-400">No registered users yet.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-brand-card">
          <table className="w-full">
            <caption className="sr-only">Registered users and their admin status</caption>
            <thead className="border-b border-white/[0.07] bg-white/[0.02]">
              <tr className="text-left text-2xs font-bold uppercase tracking-[0.12em] text-gray-500">
                <th scope="col" className="px-5 py-3">User</th>
                <th scope="col" className="px-5 py-3">Role</th>
                <th scope="col" className="px-5 py-3">Joined</th>
                <th scope="col" className="px-5 py-3">Last sign-in</th>
                <th scope="col" className="px-5 py-3 sr-only">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05] text-sm">
              {users.map((u) => {
                const isSelf = u.id === currentUser.id;
                const toggle = setUserAdmin.bind(null, u.id, !u.isAdmin);
                return (
                  <tr key={u.id} className="text-white">
                    <td className="px-5 py-3">
                      <div className="font-semibold text-white">
                        {u.displayName ?? u.email}
                        {isSelf && <span className="ml-2 text-2xs font-bold uppercase tracking-wider text-brand-accent">You</span>}
                      </div>
                      <div className="mt-0.5 text-xs text-gray-500">
                        {u.email}
                        {!u.hasProfile && (
                          <span className="ml-2 text-amber-400">no profile row</span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      {u.isAdmin ? (
                        <span className="rounded-full border border-emerald-500/30 bg-emerald-500/[0.08] px-2 py-0.5 text-2xs font-bold uppercase tracking-wide text-emerald-400">
                          Admin
                        </span>
                      ) : (
                        <span className="text-gray-500">User</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-gray-400">{shortDate(u.createdAt)}</td>
                    <td className="px-5 py-3 text-gray-400">{shortDate(u.lastSignIn)}</td>
                    <td className="px-5 py-3 text-right">
                      <form action={toggle}>
                        <button
                          type="submit"
                          disabled={isSelf && u.isAdmin}
                          title={isSelf && u.isAdmin ? "You can't remove your own admin access" : undefined}
                          className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent disabled:cursor-not-allowed disabled:opacity-40 ${
                            u.isAdmin
                              ? 'border-red-500/30 text-red-300 hover:bg-red-500/[0.08]'
                              : 'border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/[0.08]'
                          }`}
                        >
                          {u.isAdmin ? 'Revoke admin' : 'Make admin'}
                        </button>
                      </form>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <p className="mt-4 text-xs text-gray-600">
        Emails are read live from Supabase Auth via the service role. The admin flag lives on
        each user&apos;s <code className="text-gray-500">profiles</code> row.
      </p>
    </section>
  );
}
