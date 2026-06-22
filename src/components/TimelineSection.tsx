import { motion } from 'framer-motion';
import { revealVariants, staggerContainer, viewportConfig } from '../hooks/useScrollReveal';

interface TimelineItem {
  label: string;
  status: 'completed' | 'pending' | 'awaiting';
}

const timelineItems: TimelineItem[] = [
  { label: 'Registration', status: 'completed' },
  { label: 'Research', status: 'completed' },
  { label: 'Preparation', status: 'completed' },
  { label: 'Problem Statement', status: 'pending' },
  { label: 'Build Phase', status: 'awaiting' },
];

function getStatusDisplay(status: TimelineItem['status']) {
  switch (status) {
    case 'completed':
      return { text: '✓', className: 'text-signal' };
    case 'pending':
      return { text: 'Pending', className: 'text-signal animate-pulse-dot' };
    case 'awaiting':
      return { text: 'Awaiting', className: 'text-text-tertiary' };
  }
}

function getNodeStyle(status: TimelineItem['status']) {
  switch (status) {
    case 'completed':
      return 'bg-signal/20 border-signal shadow-[0_0_8px_rgba(127,219,202,0.2)]';
    case 'pending':
      return 'bg-signal/10 border-signal/50 animate-pulse-dot';
    case 'awaiting':
      return 'bg-void border-text-tertiary';
  }
}

export default function TimelineSection() {
  return (
    <section id="timeline" className="section-padding">
      <div className="max-w-3xl mx-auto">
        {/* Section Title */}
        <motion.h2
          className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-center mb-20 tracking-wide"
          variants={revealVariants}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
        >
          Progress
        </motion.h2>

        {/* Timeline */}
        <motion.div
          className="relative pl-8 md:pl-12"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
        >
          {/* Vertical Line */}
          <div className="absolute left-3 md:left-5 top-0 bottom-0 w-px bg-gradient-to-b from-signal/30 via-signal/10 to-transparent" />

          {timelineItems.map((item, index) => {
            const statusDisplay = getStatusDisplay(item.status);
            const nodeStyle = getNodeStyle(item.status);

            return (
              <motion.div
                key={item.label}
                variants={revealVariants}
                className="relative flex items-center gap-6 md:gap-8 mb-12 last:mb-0"
              >
                {/* Node */}
                <div
                  className={`absolute left-[-20px] md:left-[-12px] w-3 h-3 rounded-full border ${nodeStyle} z-10`}
                />

                {/* Content */}
                <div className="flex flex-col md:flex-row md:items-center md:gap-4 flex-1">
                  <span
                    className={`text-lg md:text-xl font-light tracking-wide ${
                      item.status === 'awaiting' ? 'text-text-tertiary' : 'text-text-primary'
                    }`}
                  >
                    {item.label}
                  </span>

                  {/* Status badge */}
                  <span className={`text-xs tracking-[0.2em] uppercase font-mono mt-1 md:mt-0 ${statusDisplay.className}`}>
                    {item.status === 'completed' ? (
                      <span className="inline-flex items-center gap-1.5">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-signal">
                          <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Complete
                      </span>
                    ) : (
                      <span className={item.status === 'pending' ? 'inline-flex items-center gap-1.5' : ''}>
                        {item.status === 'pending' && (
                          <span className="w-1.5 h-1.5 rounded-full bg-signal animate-pulse-dot inline-block" />
                        )}
                        {statusDisplay.text}
                      </span>
                    )}
                  </span>
                </div>

                {/* Connector dot for visual rhythm */}
                {index < timelineItems.length - 1 && (
                  <div className="absolute left-[-18px] md:left-[-10px] top-8 w-px h-8 bg-gradient-to-b from-signal/10 to-transparent" />
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
