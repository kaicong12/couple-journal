import * as React from "react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectLabel, SelectItem } from "couple-journal";

const categories = ["Eating out", "Groceries", "Transport", "Date night", "Travel", "Gifts", "Home"];

export const CategorySelect = () => (
  <Select defaultValue="Groceries" items={categories.map((c) => ({ value: c, label: c }))}>
    <SelectTrigger className="w-56">
      <SelectValue />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectLabel>Categories</SelectLabel>
        {categories.map((c) => (
          <SelectItem key={c} value={c}>
            {c}
          </SelectItem>
        ))}
      </SelectGroup>
    </SelectContent>
  </Select>
);

export const Placeholder = () => (
  <Select items={categories.map((c) => ({ value: c, label: c }))}>
    <SelectTrigger className="w-56">
      <SelectValue placeholder="Pick a category…" />
    </SelectTrigger>
    <SelectContent>
      {categories.map((c) => (
        <SelectItem key={c} value={c}>
          {c}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);
