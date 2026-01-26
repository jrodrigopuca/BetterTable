import { useTableContext } from '../context';

export function TableLoading() {
  const { locale, loadingComponent } = useTableContext();

  if (loadingComponent) {
    return <>{loadingComponent}</>;
  }

  return (
    <div className="bt-loading">
      <div className="bt-loading-spinner" aria-hidden="true" />
      <span className="bt-loading-text">{locale.loading}</span>
    </div>
  );
}

interface TableLoadingOverlayProps {
  show: boolean;
}

export function TableLoadingOverlay({ show }: TableLoadingOverlayProps) {
  const { loadingComponent, locale } = useTableContext();

  if (!show) return null;

  return (
    <div className="bt-loading-overlay" role="status" aria-live="polite">
      {loadingComponent || (
        <>
          <div className="bt-loading-spinner" aria-hidden="true" />
          <span className="bt-loading-text">{locale.loading}</span>
        </>
      )}
    </div>
  );
}
