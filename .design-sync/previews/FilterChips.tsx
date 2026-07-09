import * as React from "react";
import { FilterChips } from "couple-journal";

// Mutually-exclusive filter chips — selected chip fills with ink.
export const AllSelected = () => <FilterChips filter="all" onFilterChange={() => {}} />;

export const GmailSelected = () => <FilterChips filter="gmail" onFilterChange={() => {}} />;
