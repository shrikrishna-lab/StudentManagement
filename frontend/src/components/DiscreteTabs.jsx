import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { cn } from '../lib/utils';

/**
 * DiscreteTabs
 * 
 * High-precision, morphing pill tab navigation with spring physics and shine beam animation.
 * Tailored specifically to EduTrack Student Management features & content.
 */
export default function DiscreteTabs({
  tabs = [],
  activeTab: controlledActiveTab,
  onTabChange,
  defaultTab,
  className = ''
}) {
  const [internalActiveTab, setInternalActiveTab] = useState(
    defaultTab || tabs[0]?.id
  );
  const [shine, setShine] = useState(false);

  const currentActive =
    controlledActiveTab !== undefined ? controlledActiveTab : internalActiveTab;

  const handleTabClick = (tabId) => {
    setInternalActiveTab(tabId);
    if (onTabChange) onTabChange(tabId);
  };

  useEffect(() => {
    setShine(false);
    const timer = setTimeout(() => setShine(true), 350);
    return () => {
      clearTimeout(timer);
      setShine(false);
    };
  }, [currentActive]);

  if (!tabs || tabs.length === 0) return null;

  return (
    <motion.nav
      layout
      className={cn('discrete-tabs-container', className)}
      role="tablist"
      aria-label="Section navigation"
    >
      {tabs.map((tab) => {
        const isActive = tab.id === currentActive;

        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            tabIndex={0}
            onClick={() => handleTabClick(tab.id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleTabClick(tab.id);
              }
            }}
            className="discrete-tab-btn"
            title={tab.description || tab.label}
          >
            <motion.div
              layout="position"
              transition={{
                type: 'spring',
                stiffness: 240,
                damping: 22,
                mass: 0.8
              }}
              className={cn(
                'discrete-tab-pill',
                isActive ? 'active' : 'inactive'
              )}
              style={
                isActive
                  ? {
                      backgroundColor: tab.activeBg || '#ffffff',
                      borderColor: tab.activeBorder || 'rgba(226, 232, 240, 0.9)',
                      color: tab.activeColor || '#2563eb'
                    }
                  : {}
              }
            >
              {/* Tab Icon */}
              <motion.div
                className="discrete-tab-icon"
                style={{
                  color: isActive ? tab.activeColor || '#2563eb' : 'currentColor'
                }}
              >
                {tab.icon}
              </motion.div>

              {/* Animated Morphing Label */}
              <motion.span
                animate={{
                  width: isActive ? 'auto' : 0,
                  opacity: isActive ? 1 : 0,
                  marginLeft: isActive ? 7 : 0
                }}
                transition={{
                  type: 'spring',
                  stiffness: 240,
                  damping: 22,
                  mass: 0.8
                }}
                className="discrete-tab-label"
                style={{
                  color: isActive ? tab.activeColor || '#2563eb' : 'inherit'
                }}
              >
                {tab.label}

                {/* Shimmer / Shine Beam on Active Transition */}
                <AnimatePresence>
                  {isActive && shine && (
                    <motion.span
                      initial={{ left: '-120%' }}
                      animate={{ left: '140%' }}
                      exit={{ opacity: 0 }}
                      transition={{
                        duration: 0.55,
                        ease: 'easeInOut'
                      }}
                      className="discrete-shine-beam"
                    />
                  )}
                </AnimatePresence>
              </motion.span>
            </motion.div>
          </button>
        );
      })}
    </motion.nav>
  );
}
