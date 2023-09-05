import Link from "next/link";

export default function IndexPage() {
  return (
    <div>
      <p>Welcome to todobeast!</p>
      <Link href="/a/planner/today">Login</Link>
    </div>
  );
}
