export default function AnimatedLine() {
  return (
    <div className="relative w-full max-w-2xl mx-auto h-px overflow-hidden my-12 opacity-30">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-signal to-transparent" />
      <div
        className="absolute inset-0 h-full w-full animate-sweep"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(127, 219, 202, 0.6), transparent)',
          width: '40%',
        }}
      />
    </div>
  );
}
