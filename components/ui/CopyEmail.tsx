"use client";

import { useState } from "react";

// A mailto link opens nothing for a visitor with no mail app set up — common
// on a desktop where mail lives in a browser tab. So every address also gets
// a copy button. The address stays visible as text either way, so a failed
// copy (clipboard blocked) still leaves something to select by hand.
export default function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    let ok = false;
    try {
      await navigator.clipboard.writeText(email);
      ok = true;
    } catch {
      // The async clipboard can refuse (no focus, older browser, embedded
      // view); the old selection-based copy still works in most of those.
      const t = document.createElement("textarea");
      t.value = email;
      t.setAttribute("readonly", "");
      t.style.position = "fixed";
      t.style.opacity = "0";
      document.body.appendChild(t);
      t.select();
      try {
        ok = document.execCommand("copy");
      } catch {
        ok = false;
      }
      t.remove();
    }
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  return (
    <button
      type="button"
      className="copyEmail"
      onClick={copy}
      aria-label={copied ? `${email} copied` : `Copy ${email}`}
    >
      <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
    </button>
  );
}
