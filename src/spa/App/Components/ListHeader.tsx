import { ReactNode } from "react";
import { Link } from "react-router-dom";

export function ListHeader({
  to,
  children,
  chip,
}: {
  to?: string;
  children: ReactNode;
  chip?: string | number;
}) {
  const Container = to
    ? ({ ...props }) => <Link {...props} to={to}></Link>
    : ({ ...props }) => <div {...props}></div>;

  return (
    <Container className="py-1 page-padding bg-gray-100 text-gray-700 flex flex-row items-center sticky top-0 z-10">
      {/* TODO: Sticky doesn't work because of page header */}
      <span className="text-sm ml-1">{children}</span>

      {chip && (
        <span className="ml-2 text-sm font-light text-gray-400">{chip}</span>
      )}
    </Container>
  );
}
