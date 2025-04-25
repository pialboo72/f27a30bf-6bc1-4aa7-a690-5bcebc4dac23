
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { List } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface PredefinedValuesProps {
  tagName: string;
  values: string[];
  onSelect: (value: string) => void;
}

const PredefinedValues: React.FC<PredefinedValuesProps> = ({
  tagName,
  values = [],
  onSelect,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button 
        variant="ghost" 
        size="sm" 
        className="h-8 px-2" 
        onClick={() => setOpen(true)}
      >
        <List className="h-4 w-4" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{tagName} - 預設值</DialogTitle>
          </DialogHeader>
          <div className="grid gap-2">
            {values.map((value, index) => (
              <Button
                key={index}
                variant="outline"
                className="justify-start"
                onClick={() => {
                  onSelect(value);
                  setOpen(false);
                }}
              >
                {value}
              </Button>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              關閉
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PredefinedValues;
