import { convertFbTimestampToDate } from '../../../utils'
import { MapPin } from 'lucide-react';

export const EventCard = ({ event, onOpen }) => {
    const dateStr = convertFbTimestampToDate(event.date);

    return (
        <article
            onClick={onOpen}
            className="bg-surface rounded-sm shadow-[0_10px_40px_-10px_rgba(42,37,33,0.08)] hover:shadow-[0_15px_50px_-10px_rgba(42,37,33,0.12)] transition-all duration-300 ease-in-out group cursor-pointer overflow-hidden flex flex-col"
        >
            {/* Image — fixed height, cover to fill without stretching */}
            <div className="w-full h-[280px] overflow-hidden">
                <img
                    src={event.thumbnail || 'https://via.placeholder.com/600x400'}
                    alt={`Thumbnail for ${event.title}`}
                    className="w-full !h-full object-cover transform group-hover:scale-[1.02] transition-transform duration-500 ease-out"
                />
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
