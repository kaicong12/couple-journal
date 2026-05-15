import { useState } from 'react'
import { convertFbTimestampToDate } from '../../../utils'
import { MapPin, ChevronLeft, ChevronRight } from 'lucide-react';

export const EventCard = ({ event, onOpen }) => {
    const dateStr = convertFbTimestampToDate(event.date);
    const photos = event.photos?.length ? event.photos : (event.thumbnail ? [event.thumbnail] : []);
    const [currentIndex, setCurrentIndex] = useState(0);

    const handlePrev = (e) => {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
    };

    const handleNext = (e) => {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev + 1) % photos.length);
    };

    return (
        <article
            onClick={onOpen}
            className="bg-surface rounded-sm shadow-[0_10px_40px_-10px_rgba(42,37,33,0.08)] hover:shadow-[0_15px_50px_-10px_rgba(42,37,33,0.12)] transition-all duration-300 ease-in-out group cursor-pointer overflow-hidden flex flex-col"
        >
            {/* Image carousel */}
            <div className="relative w-full h-[280px] overflow-hidden">
                {photos.length > 0 ? (
                    <img
                        src={photos[currentIndex]}
                        alt={`Photo ${currentIndex + 1} for ${event.title}`}
                        className="w-full !h-full object-cover transform group-hover:scale-[1.02] transition-transform duration-500 ease-out"
                    />
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
                            onClick={handlePrev}
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <button
                            onClick={handleNext}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
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
                {event.category && (
                    <div className="flex gap-2">
                        <span className="px-3 py-1 bg-parchment text-muted-text text-xs rounded-sm">
                            #{event.category}
                        </span>
                    </div>
                )}
            </div>
        </article>
    );
};
