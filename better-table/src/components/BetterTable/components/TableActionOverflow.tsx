import React, { useState, useCallback, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { TableData, RowAction } from '../types';
import { useTableContext } from '../context';
import clsx from 'clsx';

/** Default icon for actions that don't define one */
const DEFAULT_ACTION_ICON = '📦';

interface MenuPosition {
  top: number;
  left: number;
  openUp: boolean;
}

interface TableActionOverflowProps<T extends TableData> {
  /** Actions to show in the dropdown */
  actions: RowAction<T>[];
  /** Row data */
  row: T;
  /** Row index */
  rowIndex: number;
  /** Handler for action clicks */
  onActionClick: (action: RowAction<T>) => void;
  /** Direction the menu opens */
  direction?: 'up' | 'down';
}

function TableActionOverflowInner<T extends TableData>({
  actions,
  row,
  rowIndex,
  onActionClick,
  direction = 'down',
}: TableActionOverflowProps<T>) {
  const { locale } = useTableContext<T>();
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<MenuPosition>({ top: 0, left: 0, openUp: false });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggle = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen((prev) => {
      if (!prev && triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        const shouldOpenUp = direction === 'up' || spaceBelow < 200;

        setPosition({
          top: shouldOpenUp ? rect.top : rect.bottom,
          left: rect.right,
          openUp: shouldOpenUp,
        });
      }
      return !prev;
    });
  }, [direction]);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        triggerRef.current && !triggerRef.current.contains(target) &&
        menuRef.current && !menuRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Close on scroll (parent containers may move)
  useEffect(() => {
    if (!isOpen) return;

    const handleScroll = () => setIsOpen(false);
    window.addEventListener('scroll', handleScroll, true);
    return () => window.removeEventListener('scroll', handleScroll, true);
  }, [isOpen]);

  // Separate danger actions to place them at the end with a separator
  const normalActions = actions.filter((a) => a.variant !== 'danger');
  const dangerActions = actions.filter((a) => a.variant === 'danger');
  const sortedActions = [...normalActions, ...dangerActions];
  const hasDangerSeparator = normalActions.length > 0 && dangerActions.length > 0;
  const dangerStartIndex = normalActions.length;

  const menuStyle: React.CSSProperties = position.openUp
    ? { position: 'fixed', bottom: window.innerHeight - position.top, right: window.innerWidth - position.left }
    : { position: 'fixed', top: position.top, right: window.innerWidth - position.left };

  return (
    <div className="bt-overflow-container">
      <button
        ref={triggerRef}
        className="bt-action-btn bt-overflow-trigger"
        onClick={toggle}
        aria-label={locale.moreActions}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        title={locale.moreActions}
        type="button"
      >
        <span className="bt-overflow-icon">⋯</span>
      </button>

      {isOpen && createPortal(
        <div
          ref={menuRef}
          className={clsx(
            'bt-overflow-menu',
            position.openUp && 'bt-overflow-menu-up'
          )}
          style={menuStyle}
          role="menu"
        >
          {sortedActions.map((action, index) => {
            if (action.visible && !action.visible(row)) {
              return null;
            }

            const isDisabled = action.disabled ? action.disabled(row) : false;
            const icon = action.icon ?? DEFAULT_ACTION_ICON;
            const showSeparator = hasDangerSeparator && index === dangerStartIndex;

            return (
              <React.Fragment key={action.id}>
                {showSeparator && <div className="bt-overflow-separator" role="separator" />}
                {action.mode === 'link' && action.href ? (
                  <a
                    href={
                      typeof action.href === 'function'
                        ? action.href(row)
                        : action.href
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className={clsx(
                      'bt-overflow-item',
                      action.variant === 'danger' && 'bt-overflow-item-danger'
                    )}
                    role="menuitem"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsOpen(false);
                    }}
                  >
                    <span className="bt-overflow-item-icon">{icon}</span>
                    <span className="bt-overflow-item-label">{action.label}</span>
                  </a>
                ) : (
                  <button
                    className={clsx(
                      'bt-overflow-item',
                      action.variant === 'danger' && 'bt-overflow-item-danger'
                    )}
                    role="menuitem"
                    disabled={isDisabled}
                    onClick={(e) => {
                      e.stopPropagation();
                      onActionClick(action);
                      setIsOpen(false);
                    }}
                    type="button"
                  >
                    <span className="bt-overflow-item-icon">{icon}</span>
                    <span className="bt-overflow-item-label">{action.label}</span>
                  </button>
                )}
              </React.Fragment>
            );
          })}
        </div>,
        document.body
      )}
    </div>
  );
}

export const TableActionOverflow = React.memo(
  TableActionOverflowInner
) as typeof TableActionOverflowInner;
