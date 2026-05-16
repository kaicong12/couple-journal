import { useState, useRef } from 'react'
import { convertFbTimestampToDate } from '../../../utils'
import { MapPin, ChevronLeft, ChevronRight } from 'lucide-react';

export const EventCard = ({ event, onOpen }) => {
    const dateStr = convertFbTimestampToDate(event.date);
    const photos = event.photos?.length ? event.photos : (event.thumbnail ? [event.thumbnail] : []);
    const categories = event.categories?.length ? event.categories : (event.category ? [event.category] : []);
    const trackRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    const scrollToIndex = (idx) => {
        const track = trackRef.current;
        if (!track) return;
        track.scrollTo({ left: idx * track.clientWidth, behavior: 'smooth' });
    };

    const handlePrev = (e) => {
        e.stopPropagation();
        e.preventDefault();
        scrollToIndex((currentIndex - 1 + photos.length) % photos.length);
    };

    const handleNext = (e) => {
        e.stopPropagation();
        e.preventDefault();
        scrollToIndex((currentIndex + 1) % photos.length);
    };

    const handleScroll = () => {
        const track = trackRef.current;
        if (!track) return;
        const idx = Math.round(track.scrollLeft / track.clientWidth);
        if (idx !== currentIndex) setCurrentIndex(idx);
    };

    return (
        <article
            onClick={onOpen}
            className="bg-surface rounded-sm shadow-[0_10px_40px_-10px_rgba(42,37,33,0.08)] hover:shadow-[0_15px_50px_-10px_rgba(42,37,33,0.12)] transition-all duration-300 ease-in-out group cursor-pointer overflow-hidden flex flex-col"
        >
            {/* Image carousel */}
            <div className="relative w-full h-[280px] overflow-hidden">
                {photos.length > 0 ? (
                    <div
                        ref={trackRef}
                        onScroll={handleScroll}
                        className="flex w-full h-full overflow-x-auto snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                    >
                        {photos.map((src, idx) => (
                            <img
                                key={idx}
                                src={src}
                                alt={`Photo ${idx + 1} for ${event.title}`}
                                draggable={false}
                                className="w-full h-full flex-shrink-0 snap-center object-cover transform group-hover:scale-[1.02] transition-transform duration-500 ease-out"
                            />
                        ))}
                    </div>
                ) : (
                    <img
                        src="https://via.placeholder.com/600x400"
                        alt={`Placeholder for ${event.title}`}
                        className="w-full !h-full object-cover"
                    />
                )}
                {photos.length > 1 && (
                    <>
                        <button
                            type="button"
                            aria-label="Previous photo"
                            onClick={handlePrev}
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 transition-colors z-10"
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <button
                            type="button"
                            aria-label="Next photo"
                            onClick={handleNext}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 transition-colors z-10"
                        >
                            <ChevronRight size={18} />
                        </button>
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                            {photos.map((_, idx) => (
                                <span
                                    key={idx}
                                    className={`w-1.5 h-1.5 rounded-full transition-colors ${
                                        idx === currentIndex ? 'bg-white' : 'bg-white/50'
                                    }`}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Content */}
            <div className="p-8 flex flex-col flex-1 text-left">
                {/* Metadata: date + location */}
                <div className="flex items-center gap-3 mb-3">
                    <span className="text-[12px] font-medium tracking-wider text-muted-text uppercase">
                        {dateStr}
                    </span>
                    {event.location && (
                        <>
                            <span className="w-1 h-1 rounded-full bg-accent-warm shrink-0" />
                            <span className="text-[12px] font-medium tracking-wider text-muted-text uppercase flex items-center gap-1 min-w-0">
                                <MapPin className="size-3 shrink-0" />
                                <span className="truncate">{event.location}</span>
                            </span>
                        </>
                    )}
                </div>

                {/* Title */}
                <h2 className="!text-[28px] font-display font-medium text-text leading-tight group-hover:text-sienna transition-colors">
                    {event.title}
                </h2>

                {/* Description — clamp to 4 lines, centered vertically in remaining space */}
                <div className="flex-1 flex items-center py-4">
                    <p className="text-text/80 text-[16px] leading-relaxed line-clamp-4 w-full">
                        {event.description || '\u00A0'}
                    </p>
                </div>

                {/* Category tag */}
                {categories.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {categories.map((cat) => (
                            <span key={cat} className="px-3 py-1 bg-parchment text-muted-text text-xs rounded-sm">
                                #{cat}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </article>
    );
};
