import { useFilters } from '@/contexts/FiltersContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, ChevronDownIcon, X } from 'lucide-react';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

const formatDate = (date: Date | undefined) => {
  if (!date) return '';
  return date.toISOString().split('T')[0];
};

function PopoverCalendar({
  date,
  onSelect,
  label,
}: {
  date: Date | undefined;
  onSelect: (date: Date | undefined) => void;
  label: string;
}) {
  return (
    <div className="flex flex-col ">
      <Popover>
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="dates"
            className="w-56 justify-between font-normal"
          >
            {formatDate(date) || `Select ${label}`}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            captionLayout="dropdown"
            onSelect={date => {
              onSelect(date);
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

export function FiltersPanel() {
  const { filters, setRegion, setConditionSearch, setDateRange, resetFilters } =
    useFilters();

  const handleFromDateChange = (value: Date | undefined) => {
    const fromDate = value ? new Date(value) : undefined;
    setDateRange({ from: fromDate, to: filters.dateRange.to });
  };

  const handleToDateChange = (value: Date | undefined) => {
    const toDate = value ? new Date(value) : undefined;
    setDateRange({ from: filters.dateRange.from, to: toDate });
  };

  const getRegionLabel = (region: string) => {
    switch (region) {
      case 'us':
        return 'US Only';
      case 'eu':
        return 'EU Only';
      default:
        return 'All Regions';
    }
  };

  const hasActiveFilters =
    filters.region !== 'all' ||
    filters.conditionSearch !== '' ||
    filters.dateRange.from ||
    filters.dateRange.to;

  return (
    <Card className="w-full mb-8">
      <CardContent className="pt-0">
        <div className="flex flex-1 gap-4">
          {/* Region Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Region</label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  {getRegionLabel(filters.region)}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full">
                <DropdownMenuRadioGroup
                  value={filters.region}
                  onValueChange={value =>
                    setRegion(value as 'all' | 'us' | 'eu')
                  }
                >
                  <DropdownMenuRadioItem value="all">
                    All Regions
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="us">
                    US Only
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="eu">
                    EU Only
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Condition Search */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Condition Search
            </label>
            <Input
              type="text"
              placeholder="Search conditions..."
              value={filters.conditionSearch}
              onChange={e => setConditionSearch(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Date Range */}
          <div className="space-y-2">
            <div className="flex gap-2">
              <PopoverCalendar
                onSelect={newDate => handleFromDateChange(newDate)}
                date={filters.dateRange.from}
                label="Start"
              />

              <PopoverCalendar
                onSelect={newDate => handleToDateChange(newDate)}
                date={filters.dateRange.to}
                label="End"
              />
            </div>
          </div>

          <div className="flex flex-col justify-end">
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={resetFilters}
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Clear filters
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
