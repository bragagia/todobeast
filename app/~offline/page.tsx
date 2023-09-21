export default function OfflinePage() {
  return (
    <div>
      <p>You are offline and this page is not accessible through cache.</p>

      {/* Use a instead of Link because next-pwa does support it on offline page */}
      <a href="/a" className="text-blue-500 underline">
        Click here to try loading the app from cache.
      </a>
    </div>
  );
}
