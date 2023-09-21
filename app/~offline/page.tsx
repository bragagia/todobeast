import { Link } from "react-router-dom";

export default function OfflinePage() {
  return (
    <div>
      <p>You are offline and this page is not accessible through cache.</p>

      <Link to="/a" className="text-blue-500 underline">
        Click here to try loading the app from cache.
      </Link>
    </div>
  );
}
