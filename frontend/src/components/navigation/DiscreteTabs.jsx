import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { cn } from '@/lib/utils';

/**
 * DiscreteTabs - High-polish Apple-inspired spring-motion discrete tab bar.
 * Expands active tab smoothly from icon to full label with subtle shine effect.
 * Strictly formatted for EduTrack content (no random or duplicate tabs).
 */
export default function DiscreteTabs({
  tabs = [],
  activeTab,
  onTabChange,
  onChange,
  defaultTab,
  className = '',
  size = 'md' // 'sm' | 'md' | 'lg'
}) {
  const currentTab = activeTab !== undefined ? activeTab : defaultTab || tabs[0]?.id;
  const [shine, setShine] = useState(false);

  const handleTabClick = (tabId) => {
    if (onTabChange) onTabChange(tabId);
    if (onChange) onChange(tabId);
  };

  useEffect(() => {
    const timer = setTimeout(() => setShine(true), 400);
    return () => {
      clearTimeout(timer);
      setShine(false);
    };
  }, [currentTab]);

  if (!tabs || tabs.length === 0) return null;

  return (
    <motion.div
      layout
      className={cn('discrete-tabs-container', `size-${size}`, className)}
      role="tablist"
      aria-label="Content navigation tabs"
    >
      {tabs.map((tab) => {
        const id = typeof tab === 'string' ? tab : tab.id;
        const label = typeof tab === 'string' ? tab : tab.label;
        const icon = typeof tab === 'object' ? tab.icon : null;
        const count = typeof tab === 'object' ? tab.count : null;
        const activeColor = typeof tab === 'object' ? tab.activeColor : null;
        const isActive = id === currentTab;

        return (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => handleTabClick(id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleTabClick(id);
              }
            }}
            className="discrete-tab-btn"
          >
            <motion.div
              layout="position"
              transition={{
                type: 'spring',
                stiffness: 240,
                damping: 22,
                mass: 0.9,
              }}
              className="discrete-tab-motion-wrapper"
            >
              <div
                className={cn('discrete-tab-pill', isActive && 'active')}
                style={isActive && activeColor ? { color: activeColor } : {}}
              >
                {icon && (
                  <motion.div
                    className="discrete-tab-icon"
                    style={isActive && activeColor ? { color: activeColor } : {}}
                  >
                    {icon}
                  </motion.div>
                )}

                <motion.span
                  animate={{
                    width: isActive || !icon ? 'auto' : 0,
                    opacity: isActive || !icon ? 1 : 0,
                    marginLeft: (isActive || !icon) && icon ? 7 : 0,
                  }}
                  transition={{
                    duration: 0.25,
                    ease: [0.16, 1, 0.3, 1]
                  }}
                  className="discrete-tab-label"
                  style={isActive && activeColor ? { color: activeColor } : {}}
                >
                  {label}

                  <AnimatePresence>
                    {isActive && shine && (
                      <motion.span
                        initial={{ left: '-120%' }}
                        animate={{ left: '140%' }}
                        exit={{ opacity: 0 }}
                        transition={{
                          duration: 0.55,
                          ease: 'easeInOut',
                        }}
                        className="discrete-tab-shine"
                      />
                    )}
                  </AnimatePresence>
                </motion.span>

                {count !== null && count !== undefined && (
                  <span className={cn('discrete-tab-count', isActive && 'count-active')}>
                    {count}
                  </span>
                )}
              </div>
            </motion.div>
          </button>
        );
      })}
    </motion.div>
  );
}
