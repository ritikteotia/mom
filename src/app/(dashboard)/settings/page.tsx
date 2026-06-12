export default function SettingsPage() {
  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-2xl font-semibold text-text-primary mb-2">Settings</h1>
      <p className="text-text-secondary mb-8">
        Manage your account and preferences.
      </p>

      <div className="glass-card p-6">
        <h3 className="font-medium text-text-primary mb-4">Account</h3>
        <p className="text-sm text-text-secondary">
          Account settings are managed through Clerk. Click your avatar in the
          sidebar to access your profile, email, and security settings.
        </p>
      </div>
    </div>
  );
}
