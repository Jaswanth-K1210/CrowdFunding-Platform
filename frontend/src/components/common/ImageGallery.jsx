import { useMemo, useState } from "react";

export default function ImageGallery({ images = [], title = "" }) {
  const urls = useMemo(() => (Array.isArray(images) ? images.filter(Boolean) : []), [images]);
  const [activeIdx, setActiveIdx] = useState(0);

  if (!urls.length) return null;

  const activeUrl = urls[activeIdx] || urls[0];

  return (
    <div className="space-y-3">
      <div className="aspect-[16/9] sm:aspect-[21/9] bg-gray-100 rounded-3xl overflow-hidden shadow-inner">
        <img
          src={activeUrl}
          alt={title}
          className="h-full w-full object-contain bg-gray-100"
        />
      </div>

      {urls.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {urls.map((url, i) => (
            <button
              key={url + i}
              type="button"
              onClick={() => setActiveIdx(i)}
              className={
                "relative shrink-0 rounded-xl overflow-hidden border-2 transition-all " +
                (i === activeIdx
                  ? "border-emerald-400"
                  : "border-transparent hover:border-emerald-200")
              }
              aria-label={`View image ${i + 1}`}
            >
              <img src={url} alt="" className="w-16 h-16 object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

