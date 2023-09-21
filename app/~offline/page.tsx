export default function OfflinePage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen v-screen text-center gap-2">
      <p>You are offline and Todobeast app isn't available in your cache.</p>

      {/* Use a instead of Link because next-pwa does support it on offline page */}
      <a href="/a" className="text-blue-500 underline">
        Click here to reload.
      </a>
    </div>
  );
}
