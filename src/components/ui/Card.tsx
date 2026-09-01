import type { ReactNode } from "react";

/**
 * Kartu glass utama dashboard — header opsional (icon + title + action)
 * dengan body yang bisa dikustomisasi.
 */
export function Card({
  title,
  icon,
  action,
  children,
  className = "",
  bodyClassName = "px-5 py-5 sm:px-6",
}: {
  title?: ReactNode;
  icon?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section className={`glass-card animate-fade-up ${className}`}>
      {(title || action) && (
        <header className="flex items-center justify-between gap-3 border-b border-white/[0.06] px-5 py-4 sm:px-6">
          <h2 className="flex min-w-0 items-center gap-2.5 text-sm font-bold tracking-wide text-slate-200">
            {icon && (
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-grass-500/10 text-grass-400 ring-1 ring-inset ring-grass-400/20 [&>svg]:h-4 [&>svg]:w-4">
                {icon}
              </span>
            )}
            <span className="truncate">{title}</span>
          </h2>
          {action}
        </header>
      )}
      <div className={bodyClassName}>{children}</div>
    </section>
  );
}
