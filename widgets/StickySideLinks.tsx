import Link from "next/link";

type StickyItem = {
  href: string;
  image: { src: string; alt: string };
};

export default function StickySideLinks({
  items,
  mobileItem,
}: {
  items: StickyItem[];
  mobileItem?: StickyItem;
}) {
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

      {mobileItem && (
        <div className="md:hidden fixed bottom-3 right-3 z-50">
          <Link
            href={mobileItem.href}
            target="_blank"
            rel="noopener noreferrer"
            className="block shadow-lg transition-all duration-200 hover:shadow-xl"
            aria-label={mobileItem.image.alt}
          >
            <img
              src={mobileItem.image.src}
              alt={mobileItem.image.alt}
              className="block w-12 h-auto bg-white"
              loading="lazy"
            />
          </Link>
        </div>
      )}
    </>
  );
}
