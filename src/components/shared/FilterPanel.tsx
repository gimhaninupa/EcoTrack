import React from 'react';
import { Filter } from 'lucide-react';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
export function FilterPanel() {
  return <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" className="h-10">
        <Filter className="mr-2 h-4 w-4" />
        Filter
      </Button>
      <Select options={[{
      value: 'all',
      label: 'All Status'
    }, {
      value: 'active',
      label: 'Active'
    }, {
      value: 'pending',
      label: 'Pending'
    }]} className="w-[150px]" />
    </div>;
}