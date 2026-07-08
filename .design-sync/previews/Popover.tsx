import * as React from "react";
import { Popover, PopoverTrigger, PopoverContent, PopoverHeader, PopoverTitle, PopoverDescription, Button } from "couple-journal";

// Open popover as used for the date picker and inline pickers.
export const OpenPopover = () => (
  <div style={{ minHeight: 260, paddingTop: 12 }}>
    <Popover open>
      <PopoverTrigger
        render={<Button variant="outline" className="rounded-sm text-[11px] font-bold uppercase tracking-[0.13em] bg-paper" />}
      >
        Change category
      </PopoverTrigger>
      <PopoverContent>
        <PopoverHeader>
          <PopoverTitle>Move to another category</PopoverTitle>
          <PopoverDescription>
            The expense keeps its amount and date — only the category chip changes.
          </PopoverDescription>
        </PopoverHeader>
      </PopoverContent>
    </Popover>
  </div>
);
