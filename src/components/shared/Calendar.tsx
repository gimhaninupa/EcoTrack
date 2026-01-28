import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/Button';
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday
} from 'date-fns';

interface CalendarProps {
  events?: Date[];
  onDateSelect?: (date: Date) => void;
}

export function Calendar({ events = [], onDateSelect }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dates = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  return (
    <div className="w-full bg-white rounded-lg border border-neutral-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">{format(currentMonth, 'MMMM yyyy')}</h3>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={prevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {days.map((d) => (
          <div key={d} className="text-xs font-medium text-neutral-500 py-1">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {dates.map((date, i) => {
          const isCurrentMonth = isSameMonth(date, monthStart);
          const hasEvent = events.some(eventDate => isSameDay(eventDate, date));

          return (
            <div
              key={i}
              onClick={() => onDateSelect && onDateSelect(date)}
              className={`
                h-10 flex items-center justify-center text-sm rounded-md relative
                ${isCurrentMonth ? 'hover:bg-neutral-50 cursor-pointer text-neutral-900' : 'text-neutral-300'}
                ${isToday(date) ? 'bg-forest-50 text-forest-600 font-bold' : ''}
              `}
            >
              {format(date, 'd')}
              {hasEvent && isCurrentMonth && (
                <div className="absolute bottom-1.5 h-1 w-1 rounded-full bg-forest-500" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}