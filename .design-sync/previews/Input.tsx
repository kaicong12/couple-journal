import * as React from "react";
import { Input, Label } from "couple-journal";

export const Basic = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6, maxWidth: 320 }}>
    <Label className="text-[11px] uppercase tracking-wider text-muted-text font-medium">
      Merchant / Description
    </Label>
    <Input placeholder="e.g. Atlas Coffeehouse" className="h-11" />
  </div>
);

export const WithValue = () => (
  <div style={{ maxWidth: 320 }}>
    <Input defaultValue="FairPrice Finest" className="h-11" />
  </div>
);

export const SearchField = () => (
  <div style={{ maxWidth: 320 }}>
    <Input placeholder="Search merchant, category..." className="h-9" />
  </div>
);

export const Disabled = () => (
  <div style={{ maxWidth: 320 }}>
    <Input placeholder="Unavailable" disabled />
  </div>
);
