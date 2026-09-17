import { motion, useReducedMotion } from 'framer-motion'

/**
 * Scroll-triggered reveal. Deliberately restrained — a short rise and fade,
 * matching the calm motion on the client's reference sites.
 *
 * Honours prefers-reduced-motion: when set, content renders at its resting
 * state immediately rather than animating. Content is never left invisible
 * waiting on an observer.
 */
export default function Reveal({ children, delay = 0, y = 18, as = 'div', className, ...rest }) {
  const reduce = useReducedMotion()
  const Tag = motion[as] ?? motion.div

  if (reduce) {
    const Plain = as
    return <Plain className={className} {...rest}>{children}</Plain>
  }

  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      {...rest}
    >
      {children}
    </Tag>
  )
}
