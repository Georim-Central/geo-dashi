import { useCallback, useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Download } from 'lucide-react';

import { SidebarNavButton } from '@/components/sidebar/SidebarNavButton';
import {
  SidebarNavAction,
  SidebarNavGroup,
  SidebarNavItem,
  SidebarNavParentItem,
  createEventSidebarGroups,
  createOrganizationSidebarGroups,
  isSidebarParentItem,
} from '@/components/sidebar/sidebar-config';
import { AppView, EventManagementTab, SettingsSection } from '@/types/navigation';

interface SidebarProps {
  currentView: AppView;
  onViewChange: (view: AppView) => void;
  contextMode: 'organization' | 'event';
  onBackToOrganization: () => void;
  selectedEventName?: string | null;
  activeEventTab: EventManagementTab;
  onEventTabSelect: (tab: EventManagementTab) => void;
  activeSettingsSection: SettingsSection;
  onSettingsSectionSelect: (section: SettingsSection) => void;
}

const PRIMARY_WIDTH_EXPANDED = 16;
const PRIMARY_WIDTH_COLLAPSED = 5;
const SECONDARY_WIDTH = 17;

function flattenItems(groups: SidebarNavGroup[]) {
  return groups.flatMap((group) => group.items);
}

function collectParentItems(groups: SidebarNavGroup[]) {
  return flattenItems(groups).filter(isSidebarParentItem);
}

export function Sidebar({
  currentView,
  onViewChange,
  contextMode,
  onBackToOrganization,
  selectedEventName,
  activeEventTab,
  onEventTabSelect,
  activeSettingsSection,
  onSettingsSectionSelect,
}: SidebarProps) {
  const [isManuallyCollapsed, setIsManuallyCollapsed] = useState(false);

  const handleDownloadAppClick = () => undefined;

  const navGroups = useMemo(
    () =>
      contextMode === 'organization'
        ? createOrganizationSidebarGroups({
            onViewChange,
            onBackToOrganization,
            onSettingsSectionSelect,
          })
        : createEventSidebarGroups({
            onViewChange,
            onBackToOrganization,
            selectedEventName,
          }),
    [contextMode, onBackToOrganization, onSettingsSectionSelect, onViewChange, selectedEventName]
  );

  const primaryItems = useMemo(() => collectParentItems(navGroups), [navGroups]);

  const matchesAction = useCallback((action: SidebarNavAction) => {
    if (action.kind === 'view') {
      return action.view === currentView;
    }

    if (action.kind === 'settings-section') {
      return currentView === 'settings' && activeSettingsSection === action.section;
    }

    if (action.kind === 'event-tab') {
      return currentView === 'event-management' && activeEventTab === action.tab;
    }

    return false;
  }, [activeEventTab, activeSettingsSection, currentView]);

  const hasActiveChild = useCallback(function checkActiveChild(item: SidebarNavParentItem): boolean {
    return item.children.some((group) =>
      group.items.some((childItem) =>
        isSidebarParentItem(childItem) ? checkActiveChild(childItem) : matchesAction(childItem.action)
      )
    );
  }, [matchesAction]);

  const routeDrivenParentId = useMemo(() => {
    const matchedParent = primaryItems.find((item) => hasActiveChild(item));
    return matchedParent?.id ?? null;
  }, [hasActiveChild, primaryItems]);

  const [openParentId, setOpenParentId] = useState<string | null>(routeDrivenParentId);

  useEffect(() => {
    setOpenParentId((currentParentId) => {
      if (routeDrivenParentId) return routeDrivenParentId;
      if (!currentParentId) return null;
      return primaryItems.some((item) => item.id === currentParentId) ? currentParentId : null;
    });
  }, [primaryItems, routeDrivenParentId]);

  const openParent = primaryItems.find((item) => item.id === openParentId) ?? null;
  const isSecondaryOpen = Boolean(openParent);
  const isCollapsed = isManuallyCollapsed || isSecondaryOpen;

  const primaryWidth = isCollapsed ? PRIMARY_WIDTH_COLLAPSED : PRIMARY_WIDTH_EXPANDED;
  const totalSidebarWidth = primaryWidth + (isSecondaryOpen ? SECONDARY_WIDTH : 0);

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

    if (action.kind === 'event-tab') {
      onEventTabSelect(action.tab);
      return;
    }

    action.onSelect();
  };

  const handlePrimaryItemClick = (item: SidebarNavItem) => {
    if (isSidebarParentItem(item)) {
      setOpenParentId((currentParentId) => (currentParentId === item.id ? null : item.id));
      return;
    }

    executeAction(item.action);
    setOpenParentId(null);
  };

  const handleSecondaryItemClick = (item: SidebarNavItem, parentId: string) => {
    if (isSidebarParentItem(item)) {
      setOpenParentId((currentParentId) => (currentParentId === item.id ? parentId : item.id));
      return;
    }

    executeAction(item.action);
    setOpenParentId(parentId);
  };

  const isItemActive = (item: SidebarNavItem) =>
    isSidebarParentItem(item) ? hasActiveChild(item) || openParentId === item.id : matchesAction(item.action);

  const handleLogoClick = () => {
    if (contextMode === 'event') {
      onBackToOrganization();
      setOpenParentId(null);
      return;
    }

    onViewChange('dashboard');
    setOpenParentId(null);
  };

  const handleToggleClick = () => {
    if (isSecondaryOpen) {
      setOpenParentId(null);
      return;
    }

    setIsManuallyCollapsed((currentState) => !currentState);
  };

  return (
    <div className="georim-sidebar-layout" style={{ width: `${totalSidebarWidth}rem` }}>
      <aside
        className={`georim-sidebar-primary ${isCollapsed ? 'is-collapsed' : ''}`}
        style={{ width: `${primaryWidth}rem` }}
      >
        <button
          type="button"
          onClick={handleLogoClick}
          className="georim-sidebar-primary__brand"
          title="Go to dashboard"
        >
          <img
            src={isCollapsed ? '/images/collasible logo.svg' : '/images/logo.svg'}
            alt="Georim logo"
            className={isCollapsed ? 'h-11 w-11 object-contain' : 'h-10 w-full max-w-[172px] object-contain'}
          />
        </button>

        <button
          type="button"
          onClick={handleToggleClick}
          className="georim-sidebar-primary__toggle"
          aria-label={isSecondaryOpen ? 'Close secondary sidebar' : isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight className="georim-sidebar-primary__toggle-arrow is-collapsed" aria-hidden="true" />
          ) : (
            <ChevronLeft className="georim-sidebar-primary__toggle-arrow" aria-hidden="true" />
          )}
        </button>

        <nav className="georim-sidebar-primary__nav" aria-label="Primary">
          {navGroups.map((group) => (
            <div key={group.id} className="georim-sidebar-group">
              {!isCollapsed && group.label && <div className="georim-sidebar-group__label">{group.label}</div>}
              <div className="georim-sidebar-group__items">
                {group.items.map((item) => (
                  <SidebarNavButton
                    key={item.id}
                    item={item}
                    isActive={isItemActive(item)}
                    isOpen={openParentId === item.id}
                    isCollapsed={isCollapsed}
                    onClick={() => handlePrimaryItemClick(item)}
                    title={isCollapsed ? item.label : undefined}
                  />
                ))}
              </div>
            </div>
          ))}
        </nav>

        {!isCollapsed ? (
          <div className="georim-sidebar-primary__footer">
            <div className="georim-sidebar-download">
              <div className="georim-sidebar-download__title">Download our Mobile App</div>
              <p className="georim-sidebar-download__copy">Take event operations on the go.</p>
              <button
                type="button"
                onClick={handleDownloadAppClick}
                className="georim-sidebar-download__button"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
            </div>
            <div className="georim-sidebar-primary__copyright">© 2026 Georim</div>
          </div>
        ) : (
          <div className="georim-sidebar-primary__footer is-collapsed">
            <button
              type="button"
              onClick={handleDownloadAppClick}
              className="georim-sidebar-download__compact-button"
              title="Download Mobile App"
            >
              <Download className="w-5 h-5" />
            </button>
          </div>
        )}
      </aside>

      <aside
        className={`georim-sidebar-secondary ${isSecondaryOpen ? 'is-open' : ''}`}
        style={{ left: `${primaryWidth}rem`, width: `${SECONDARY_WIDTH}rem` }}
      >
        {openParent && (
          <>
            <div className="georim-sidebar-secondary__header">
              {openParent.id === 'settings' && openParent.description && (
                <div className="georim-sidebar-secondary__eyebrow">{openParent.description}</div>
              )}
              <h2 className="georim-sidebar-secondary__title">{openParent.label}</h2>
              {openParent.description && openParent.id !== 'settings' && (
                <p className="georim-sidebar-secondary__description">{openParent.description}</p>
              )}
            </div>

            <div className="georim-sidebar-secondary__content">
              {openParent.children.map((group) => (
                <div key={group.id} className="georim-sidebar-group">
                  {group.label && <div className="georim-sidebar-group__label is-secondary">{group.label}</div>}
                  <div className="georim-sidebar-group__items">
                    {group.items.map((item) => (
                      <SidebarNavButton
                        key={item.id}
                        item={item}
                        isActive={isItemActive(item)}
                        onClick={() => handleSecondaryItemClick(item, openParent.id)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
