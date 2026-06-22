export default function StatusIndicator() {
  return (
    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-signal-ghost">
      <span
        className="w-2 h-2 rounded-full bg-signal animate-pulse-dot"
        aria-hidden="true"
      />
      <span className="text-xs tracking-[0.25em] uppercase font-mono text-signal-dim font-medium">
        Preparation Phase
      </span>
    </div>
  );
}
