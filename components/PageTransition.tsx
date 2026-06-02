"use client";

import { usePathname } from "next/navigation";
import { ReactNode } from "react";

export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <main key={pathname} className="scalehub-page-enter">
      {children}
    </main>
  );
}
