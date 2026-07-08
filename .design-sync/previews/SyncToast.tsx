import * as React from "react";
import { SyncToast } from "couple-journal";

// Dark ink notification card listing what a Gmail sync imported.
// The component renders fixed to the viewport corner.
export const SyncResults = () => (
  <div style={{ minHeight: 300 }}>
    <SyncToast show onDismiss={() => {}} onFilterGmail={() => {}} />
  </div>
);
