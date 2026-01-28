import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/Button';
// Simple calendar placeholder
export function Calendar() {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dates = Array.from({
    length: 35
  }, (_, i) => {
    const day = i - 2; // Start from previous month
    return {
      day: day > 0 && day <= 31 ? day : '',
      isToday: day === 15,
      hasEvent: [5, 12, 19, 26].includes(day)
    };
  });
  return <div className="w-full bg-white rounded-lg border border-neutral-200 p-4">
    <div className="flex items-center justify-between mb-4">
      <h3 className="font-semibold">October 2023</h3>
      <div className="flex gap-1">
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
    <div className="grid grid-cols-7 gap-1 text-center mb-2">
      {days.map(d => <div key={d} className="text-xs font-medium text-neutral-500 py-1">
        {d}
      </div>)}
    </div>
    <div className="grid grid-cols-7 gap-1">
      {dates.map((date, i) => <div key={i} className={`
              h-10 flex items-center justify-center text-sm rounded-md relative
              ${date.day ? 'hover:bg-neutral-50 cursor-pointer' : ''}
              ${date.isToday ? 'bg-forest-50 text-forest-600 font-bold' : ''}
            `}>
        {date.day}
        {date.hasEvent && <div className="absolute bottom-1.5 h-1 w-1 rounded-full bg-forest-500" />}
      </div>)}
    </div>
  </div>;
}