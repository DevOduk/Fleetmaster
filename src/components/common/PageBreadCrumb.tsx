import Link from "next/link";
import React from "react";

interface BreadcrumbItem {
  label: string;
  href?: string; // Optional: last item usually isn't a link
}

interface BreadcrumbProps {
  pageTitle: string;
  items?: BreadcrumbItem[]; // New prop for middle routes
}

const PageBreadcrumb: React.FC<BreadcrumbProps> = ({
  pageTitle,
  items = [],
}) => {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white/90">
        {pageTitle}
      </h2>
      <nav>
        <ol className="flex items-center gap-1.5">
          {/* Always show Home */}
          <li>
            <Link
              className="hover:text-brand-500 inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400"
              href="/"
            >
              Home
              <ChevronIcon />
            </Link>
          </li>

          {/* Map through dynamic middle items */}
          {items.map((item, index) => (
            <li key={index}>
              {item.href ? (
                <Link
                  className="hover:text-brand-500 inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400"
                  href={item.href}
                >
                  {item.label}
                  <ChevronIcon />
                </Link>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                  {item.label}
                  <ChevronIcon />
                </span>
              )}
            </li>
          ))}

          {/* The Current Page (Title) */}
          <li className="text-sm font-medium text-gray-800 dark:text-white/90">
            {pageTitle}
          </li>
        </ol>
      </nav>
    </div>
  );
};

// Extracted SVG to keep the code clean
const ChevronIcon = () => (
  <svg
    className="stroke-current"
    width="17"
    height="16"
    viewBox="0 0 17 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6.0765 12.667L10.2432 8.50033L6.0765 4.33366"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default PageBreadcrumb;
