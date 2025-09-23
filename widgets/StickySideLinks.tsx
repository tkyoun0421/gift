"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

type StickyItem = {
  href: string;
  // Optional mobile-specific href (e.g., "tel:01012345678"). Falls back to href when absent
  mobileHref?: string;
  image: { src: string; alt: string };
};

export default function StickySideLinks({
  items,
  mobileItem,
  mobileItems,
}: {
  items: StickyItem[];
  mobileItem?: StickyItem;
  mobileItems?: StickyItem[];
}) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const ua = navigator.userAgent || navigator.vendor;
    const uaMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
    const coarse =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(pointer: coarse)").matches;
    setIsMobile(Boolean(uaMobile || coarse));
  }, []);

  const listForMobile = mobileItems?.length
    ? mobileItems
    : mobileItem
      ? [mobileItem]
      : [];

  return (
    <>
      <div className="hidden md:flex fixed right-0 top-1/2 -translate-y-1/2 z-50 flex-col">
        {items.map((item, idx) => (
          <Link
            key={idx}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className="block shadow-lg transition-all duration-200 hover:shadow-xl"
            aria-label={item.image.alt}
          >
            <img
              src={item.image.src}
              alt={item.image.alt}
              className="block w-40 lg:w-60 h-auto bg-white"
              loading="lazy"
            />
          </Link>
        ))}
      </div>

      {listForMobile.length > 0 && (
        <div className="md:hidden fixed bottom-3 right-3 z-50 flex flex-col gap-2">
          {listForMobile.map((it, i) => {
            const effectiveHref =
              isMobile && it.mobileHref ? it.mobileHref : it.href;
            const isTel =
              typeof effectiveHref === "string" &&
              effectiveHref.startsWith("tel:");
            return (
              <Link
                key={i}
                href={effectiveHref}
                // Do not open tel links in a new tab to ensure proper behavior on mobile
                target={isTel ? undefined : "_blank"}
                rel={isTel ? undefined : "noopener noreferrer"}
                className="block shadow-lg transition-all duration-200 hover:shadow-xl"
                aria-label={it.image.alt}
              >
                <img
                  src={it.image.src}
                  alt={it.image.alt}
                  className="block w-12 h-12 bg-white rounded-lg object-cover"
                  loading="lazy"
                />
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
