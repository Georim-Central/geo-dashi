import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { SidebarNavButton } from '@/components/sidebar/SidebarNavButton';
import {
  SidebarNavAction,
  SidebarNavItem,
  createOrganizationSidebarGroups,
} from '@/components/sidebar/sidebar-config';
import { AppView, SettingsSection, SubscriptionTier } from '@/types/navigation';

interface SidebarProps {
  activeTier: SubscriptionTier;
  currentView: AppView;
  isShellScrolled: boolean;
  onViewChange: (view: AppView) => void;
  onPinnedLogoClick: () => void;
  activeSettingsSection: SettingsSection;
  onSettingsSectionSelect: (section: SettingsSection) => void;
}

const PRIMARY_WIDTH_COLLAPSED = 5;

export function Sidebar({
  activeTier,
  currentView,
  isShellScrolled,
  onViewChange,
  onPinnedLogoClick,
  activeSettingsSection,
  onSettingsSectionSelect,
}: SidebarProps) {
  const layoutRef = useRef<HTMLDivElement | null>(null);
  const [hoveredItem, setHoveredItem] = useState<{ label: string; top: number } | null>(null);

  const navGroups = useMemo(
    () => createOrganizationSidebarGroups({ activeTier }),
    [activeTier]
  );

  const matchesAction = useCallback((action: SidebarNavAction) => {
    if (action.kind === 'view') {
      if (action.view === 'events') {
        return currentView === 'events' || currentView === 'create-event' || currentView === 'event-management';
      }

      return action.view === currentView;
    }

    if (action.kind === 'settings-section') {
      return currentView === 'settings' && activeSettingsSection === action.section;
    }

    return false;
  }, [activeSettingsSection, currentView]);
  const isCollapsed = true;
  const primaryWidth = PRIMARY_WIDTH_COLLAPSED;
  const totalSidebarWidth = primaryWidth;

  useEffect(() => {
    document.documentElement.style.setProperty('--sidebar-width', `${totalSidebarWidth}rem`);
  }, [totalSidebarWidth]);

  const executeAction = (action: SidebarNavAction) => {
    if (action.kind === 'view') {
      onViewChange(action.view);
      return;
    }

    if (action.kind === 'settings-section') {
      onSettingsSectionSelect(action.section);
      onViewChange('settings');
      return;
    }

    if (action.kind === 'callback') {
      action.onSelect();
    }

  };

  const handlePrimaryItemClick = (item: SidebarNavItem) => {
    executeAction(item.action);
  };

  const isItemActive = (item: SidebarNavItem) => matchesAction(item.action);
  const showNavTooltip = useCallback((label: string, element: HTMLButtonElement) => {
    const layoutBounds = layoutRef.current?.getBoundingClientRect();
    const buttonBounds = element.getBoundingClientRect();

    if (!layoutBounds) {
      return;
    }

    setHoveredItem({
      label,
      top: buttonBounds.top - layoutBounds.top + (buttonBounds.height / 2),
    });
  }, []);

  const hideNavTooltip = useCallback(() => {
    setHoveredItem(null);
  }, []);

  return (
    <div ref={layoutRef} className="georim-sidebar-layout" style={{ width: `${totalSidebarWidth}rem` }}>
      {isShellScrolled ? (
        <button
          type="button"
          className="georim-sidebar-brand-cap"
          onClick={onPinnedLogoClick}
          aria-label="Go to home"
          title="Go to home"
        >
          <img
            src="/images/collasible%20logo.svg"
            alt="Georim compact logo"
            className="georim-sidebar-brand-cap__logo"
          />
        </button>
      ) : null}
      <aside
        className={`georim-sidebar-primary ${isCollapsed ? 'is-collapsed' : ''}`}
        style={{ width: `${primaryWidth}rem` }}
      >
        <nav className="georim-sidebar-primary__nav" aria-label="Primary" onScroll={hideNavTooltip}>
          {navGroups.map((group) => (
            <div key={group.id} className="georim-sidebar-group">
              {!isCollapsed && group.label && <div className="georim-sidebar-group__label">{group.label}</div>}
              <div className="georim-sidebar-group__items">
                {group.items.map((item) => (
                  <SidebarNavButton
                    key={item.id}
                    item={item}
                    isActive={isItemActive(item)}
                    isCollapsed={isCollapsed}
                    onClick={() => handlePrimaryItemClick(item)}
                    onHoverStart={showNavTooltip}
                    onHoverEnd={hideNavTooltip}
                  />
                ))}
              </div>
            </div>
          ))}
        </nav>

      </aside>
      {hoveredItem ? (
        <div
          className="georim-sidebar-hover-label"
          style={{ top: `${hoveredItem.top}px` }}
          aria-hidden="true"
        >
          {hoveredItem.label}
        </div>
      ) : null}
    </div>
  );
}
