import { useEffect } from 'react';

interface UseKeyboardShortcutsProps {
  onSelectAll?: () => void;
  onClearSelection?: () => void;
  onBulkDelete?: () => void;
  disabled?: boolean;
}

export const useKeyboardShortcuts = ({
  onSelectAll,
  onClearSelection,
  onBulkDelete,
  disabled = false
}: UseKeyboardShortcutsProps) => {
  useEffect(() => {
    if (disabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignore if user is typing in an input field
      const target = event.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.contentEditable === 'true') {
        return;
      }

      // Ctrl/Cmd + A to select all
      if ((event.ctrlKey || event.metaKey) && event.key === 'a') {
        event.preventDefault();
        onSelectAll?.();
      }

      // Escape to clear selection
      if (event.key === 'Escape') {
        onClearSelection?.();
      }

      // Delete key for bulk delete (with confirmation handled by the component)
      if (event.key === 'Delete' && !event.ctrlKey && !event.metaKey) {
        onBulkDelete?.();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onSelectAll, onClearSelection, onBulkDelete, disabled]);
};