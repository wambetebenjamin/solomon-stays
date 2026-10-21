"use client";

import { useState } from "react";

export function PropertySelector({ properties }: { properties: string[] }) {
  const [selected, setSelected] = useState(properties[0] ?? "Demo Hotel, Nairobi");

  return (
    <div className="dash-select-wrap">
      <label htmlFor="property-select">Property</label>
      <select
        id="property-select"
        className="ss-select"
        value={selected}
        onChange={(event) => setSelected(event.target.value)}
      >
        {properties.map((property) => (
          <option key={property} value={property}>
            {property}
          </option>
        ))}
      </select>
    </div>
  );
}
