"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export function UserMenu({ name, email }: { name: string; email: string }) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="dash-user">
      <div className="dash-avatar" aria-hidden="true">
        {initials}
      </div>
      <div className="dash-user-meta">
        <strong>{name}</strong>
        <span>{email}</span>
      </div>
      <button
        type="button"
        className="icon-btn"
        style={{ width: 34, height: 34, marginLeft: 6 }}
        onClick={() => signOut({ redirectTo: "/" })}
        aria-label="Sign out of Solomon Stays"
      >
        <LogOut size={15} aria-hidden="true" />
      </button>
    </div>
  );
}
