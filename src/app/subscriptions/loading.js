export default function SubscriptionsLoading() {
  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 px-4 py-8">
      <div className="space-y-2">
        <div className="skeleton h-8 w-64" />
        <div className="skeleton h-4 w-48" />
      </div>
      <div className="skeleton h-32 w-full" />
      <div className="skeleton h-96 w-full" />
    </div>
  );
}
