import { Star } from "lucide-react";

export default function BeachHeader({ club }) {
  return (
    <div className="space-y-4">
      <div className="relative h-40 w-full overflow-hidden rounded-2xl">
        <img
          src={club?.hero_image || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1600&auto=format&fit=crop"}
          alt={club?.name}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          <div>
            <h1 className="text-white text-xl font-semibold">{club?.name || "Beach Club"}</h1>
            <div className="flex items-center gap-1 text-white/90 text-sm">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span>{club?.rating?.toFixed(1) || "4.7"}</span>
              <span className="text-white/70">({club?.total_reviews || 0})</span>
            </div>
          </div>
          <div className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-sm font-medium">
            Book now
          </div>
        </div>
      </div>
    </div>
  );
}
