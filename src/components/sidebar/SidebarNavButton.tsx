import { SidebarNavItem } from '@/components/sidebar/sidebar-config';

interface SidebarNavButtonProps {
  item: SidebarNavItem;
  isActive: boolean;
  isCollapsed?: boolean;
  onClick: () => void;
  onHoverStart?: (label: string, element: HTMLButtonElement) => void;
  onHoverEnd?: () => void;
}

export function SidebarNavButton({
  item,
  isActive,
  isCollapsed = false,
  onClick,
  onHoverStart,
  onHoverEnd,
}: SidebarNavButtonProps) {
  const Icon = item.icon;

  return (
    <button
      type="button"
      onClick={onClick}
      onPointerEnter={(event) => {
        if (isCollapsed) {
          onHoverStart?.(item.label, event.currentTarget);
        }
      }}
      onPointerLeave={() => {
        if (isCollapsed) {
          onHoverEnd?.();
        }
      }}
      onFocus={(event) => {
        if (isCollapsed) {
          onHoverStart?.(item.label, event.currentTarget);
        }
      }}
      onBlur={() => {
        if (isCollapsed) {
          onHoverEnd?.();
        }
      }}
      className={`georim-sidebar-item ${isActive ? 'is-active' : ''} ${
        'accent' in item && item.accent === 'danger' ? 'is-danger' : ''
      } ${isCollapsed ? 'is-collapsed' : ''}`}
      aria-current={isActive ? 'page' : undefined}
      aria-label={item.label}
      title={isCollapsed ? item.label : undefined}
    >
      <span className="georim-sidebar-item__icon-shell">
        <Icon className="georim-sidebar-item__icon" />
      </span>
      {!isCollapsed ? <span className="georim-sidebar-item__label">{item.label}</span> : null}
    </button>
  );
}
