
import React, { useState } from "react";
import { format } from "date-fns";
import { zhTW } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DateRangeSelectorProps {
  onDateChange: (dates: Date[] | { start: Date; end: Date } | null) => void;
  className?: string;
}

export const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({
  onDateChange,
  className,
}) => {
  const [selectionType, setSelectionType] = useState<"single" | "multiple" | "range">("single");
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });
  const [timeSlots, setTimeSlots] = useState<{ start: string; end: string }>({
    start: "09:00",
    end: "17:00",
  });

  const handleSelectionTypeChange = (value: string) => {
    setSelectionType(value as "single" | "multiple" | "range");
    setSelectedDates([]);
    setDateRange({ from: undefined, to: undefined });
    onDateChange(null);
  };

  // Handle single date selection
  const handleSingleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    setSelectedDates([date]);
    onDateChange([date]);
  };

  // Handle multiple date selection
  const handleMultipleDateSelect = (dates: Date[] | undefined) => {
    if (!dates) return;
    setSelectedDates(dates);
    onDateChange(dates);
  };

  // Handle date range selection
  const handleRangeSelect = (range: { from: Date | undefined; to: Date | undefined }) => {
    setDateRange(range);
    if (range.from && range.to) {
      onDateChange({ start: range.from, end: range.to });
    }
  };

  const handleTimeChange = (type: "start" | "end", value: string) => {
    setTimeSlots(prev => ({
      ...prev,
      [type]: value
    }));
  };

  const formatDateDisplay = () => {
    if (selectionType === "single" && selectedDates.length === 1) {
      return `${format(selectedDates[0], "yyyy/MM/dd", { locale: zhTW })} ${timeSlots.start}-${timeSlots.end}`;
    } else if (selectionType === "multiple" && selectedDates.length > 0) {
      return `已選擇 ${selectedDates.length} 天 ${timeSlots.start}-${timeSlots.end}`;
    } else if (selectionType === "range" && dateRange.from && dateRange.to) {
      return `${format(dateRange.from, "yyyy/MM/dd")}-${format(dateRange.to, "yyyy/MM/dd")} ${timeSlots.start}-${timeSlots.end}`;
    }
    return "請選擇日期";
  };

  return (
    <div className={cn("space-y-4", className)}>
      <Select value={selectionType} onValueChange={handleSelectionTypeChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="選擇日期類型" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="single">單日</SelectItem>
          <SelectItem value="multiple">複選日期</SelectItem>
          <SelectItem value="range">連續日期</SelectItem>
        </SelectContent>
      </Select>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !selectedDates.length && !dateRange.from && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {formatDateDisplay()}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          {selectionType === "single" && (
            <Calendar
              mode="single"
              selected={selectedDates[0]}
              onSelect={handleSingleDateSelect}
              initialFocus
              className={cn("p-3 pointer-events-auto")}
            />
          )}
          
          {selectionType === "multiple" && (
            <Calendar
              mode="multiple"
              selected={selectedDates}
              onSelect={handleMultipleDateSelect}
              initialFocus
              className={cn("p-3 pointer-events-auto")}
            />
          )}
          
          {selectionType === "range" && (
            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={handleRangeSelect}
              initialFocus
              className={cn("p-3 pointer-events-auto")}
            />
          )}
          
          <div className="p-3 border-t">
            <div className="flex items-center gap-2">
              <Input
                type="time"
                value={timeSlots.start}
                onChange={(e) => handleTimeChange("start", e.target.value)}
                className="w-[120px]"
              />
              <span>至</span>
              <Input
                type="time"
                value={timeSlots.end}
                onChange={(e) => handleTimeChange("end", e.target.value)}
                className="w-[120px]"
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
