import { useAppSelector, useLogout } from '../app/hooks';
import { formatDate } from '../utils/formatters';

export default function ProfilePage() {
  const handleLogout = useLogout();
  const { user } = useAppSelector((s) => s.auth);

  if (!user) return null;

  return (
    <div className="mx-auto max-w-lg">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex items-center gap-4">
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt="" className="h-20 w-20 rounded-full" />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-2xl text-white">
              {user.name?.[0]?.toUpperCase()}
            </div>
          )}
          <div>
            <h1 className="text-xl font-bold">{user.name}</h1>
            <p className="text-gray-500">{user.email}</p>
            <span className="mt-1 inline-block rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium">
              {user.role}
            </span>
          </div>
        </div>
        {user.createdAt && (
          <p className="mt-6 text-sm text-gray-500">Member since {formatDate(user.createdAt)}</p>
        )}
        <button
          type="button"
          onClick={handleLogout}
          className="mt-6 w-full rounded-lg border border-red-300 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
