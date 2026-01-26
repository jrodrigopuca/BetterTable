import { ReactNode, CSSProperties } from 'react';

/**
 * Tipo base para los datos de la tabla
 * Permite extensión con tipos específicos del usuario
 */
export type TableData = Record<string, unknown>;

/**
 * Configuración de columna con tipado genérico
 */
export interface Column<T extends TableData = TableData> {
  /** Identificador único de la columna */
  id: string;
  /** Key para acceder al dato (soporta dot notation: 'user.profile.name') */
  accessor: keyof T | string;
  /** Texto visible en el header */
  header: string;
  /** Tipo de dato para filtrado y renderizado */
  type?: 'string' | 'number' | 'boolean' | 'date' | 'custom';
  /** Render personalizado de celda */
  cell?: (value: unknown, row: T, rowIndex: number) => ReactNode;
  /** Render personalizado de header */
  headerCell?: (column: Column<T>) => ReactNode;
  /** ¿Columna ordenable? */
  sortable?: boolean;
  /** ¿Columna filtrable? */
  filterable?: boolean;
  /** Ancho de columna */
  width?: string | number;
  /** Alineación del contenido */
  align?: 'left' | 'center' | 'right';
  /** Columna oculta */
  hidden?: boolean;
}

/**
 * Acción de fila individual
 */
export interface RowAction<T extends TableData = TableData> {
  /** Identificador único */
  id: string;
  /** Etiqueta de la acción */
  label: string;
  /** Icono (string, emoji, o componente) */
  icon?: ReactNode;
  /** Modo de ejecución */
  mode: 'callback' | 'modal' | 'link';
  /** Callback cuando mode='callback' */
  onClick?: (row: T, rowIndex: number) => void;
  /** Componente para modal cuando mode='modal' */
  modalContent?: React.ComponentType<{ data: T; onClose: () => void }>;
  /** URL cuando mode='link' */
  href?: string | ((row: T) => string);
  /** ¿Mostrar acción condicionalmente? */
  visible?: (row: T) => boolean;
  /** ¿Deshabilitar acción condicionalmente? */
  disabled?: (row: T) => boolean;
  /** Variante visual */
  variant?: 'default' | 'primary' | 'danger' | 'ghost';
}

/**
 * Acción global (toolbar)
 */
export interface GlobalAction<T extends TableData = TableData> {
  /** Identificador único */
  id: string;
  /** Etiqueta del botón */
  label: string;
  /** Icono */
  icon?: ReactNode;
  /** Callback de ejecución */
  onClick: (selectedRows: T[], allData: T[]) => void;
  /** ¿Requiere selección de filas? */
  requiresSelection?: boolean;
  /** Variante visual */
  variant?: 'default' | 'primary' | 'danger';
}

/**
 * Configuración de paginación
 */
export interface PaginationConfig {
  /** Página actual (controlado) */
  page?: number;
  /** Items por página */
  pageSize?: number;
  /** Opciones de tamaño de página */
  pageSizeOptions?: number[];
  /** Total de items (para paginación del servidor) */
  totalItems?: number;
  /** Mostrar selector de tamaño de página */
  showSizeChanger?: boolean;
  /** Mostrar salto a página */
  showQuickJumper?: boolean;
}

/**
 * Estado de ordenamiento
 */
export interface SortState {
  columnId: string | null;
  direction: 'asc' | 'desc';
}

/**
 * Estado de filtros
 */
export interface FilterState {
  [columnId: string]: string | number | boolean | null;
}

/**
 * Personalización de estilos
 */
export interface TableClassNames {
  /** Clase CSS del contenedor */
  container?: string;
  /** Clase CSS de la tabla */
  table?: string;
  /** Clase CSS del header */
  header?: string;
  /** Clase CSS del body */
  body?: string;
  /** Clase CSS de filas */
  row?: string;
  /** Clase CSS de celdas */
  cell?: string;
  /** Clase CSS de la paginación */
  pagination?: string;
  /** Clase CSS del toolbar */
  toolbar?: string;
}

/**
 * Textos personalizables (i18n)
 */
export interface TableLocale {
  search?: string;
  searchPlaceholder?: string;
  noData?: string;
  loading?: string;
  page?: string;
  of?: string;
  items?: string;
  selected?: string;
  rowsPerPage?: string;
  actions?: string;
  sortAsc?: string;
  sortDesc?: string;
  filterBy?: string;
  clearFilters?: string;
  selectAll?: string;
  deselectAll?: string;
}

/**
 * Locale por defecto
 */
export const defaultLocale: TableLocale = {
  search: 'Buscar',
  searchPlaceholder: 'Buscar...',
  noData: 'No hay datos',
  loading: 'Cargando...',
  page: 'Página',
  of: 'de',
  items: 'elementos',
  selected: 'seleccionados',
  rowsPerPage: 'Filas por página',
  actions: 'Acciones',
  sortAsc: 'Ordenar ascendente',
  sortDesc: 'Ordenar descendente',
  filterBy: 'Filtrar por',
  clearFilters: 'Limpiar filtros',
  selectAll: 'Seleccionar todo',
  deselectAll: 'Deseleccionar todo',
};

/**
 * Props principales del componente BetterTable
 */
export interface BetterTableProps<T extends TableData = TableData> {
  // === Datos ===
  /** Array de datos a mostrar */
  data: T[];
  /** Configuración de columnas */
  columns: Column<T>[];
  /** Key único para identificar filas (default: 'id') */
  rowKey?: keyof T | ((row: T, index: number) => string);

  // === Acciones ===
  /** Acciones por fila */
  rowActions?: RowAction<T>[];
  /** Acciones globales (toolbar) */
  globalActions?: GlobalAction<T>[];

  // === Paginación ===
  /** Configuración de paginación (false para desactivar) */
  pagination?: PaginationConfig | false;
  /** Callback de cambio de página */
  onPageChange?: (page: number, pageSize: number) => void;

  // === Ordenamiento ===
  /** Estado de ordenamiento (controlado) */
  sort?: SortState;
  /** Callback de cambio de ordenamiento */
  onSortChange?: (sort: SortState) => void;

  // === Filtrado ===
  /** Estado de filtros (controlado) */
  filters?: FilterState;
  /** Callback de cambio de filtros */
  onFilterChange?: (filters: FilterState) => void;

  // === Búsqueda Global ===
  /** Mostrar barra de búsqueda */
  searchable?: boolean;
  /** Valor de búsqueda (controlado) */
  searchValue?: string;
  /** Callback de cambio de búsqueda */
  onSearchChange?: (value: string) => void;
  /** Columnas en las que buscar (default: todas) */
  searchColumns?: string[];

  // === Selección ===
  /** Habilitar selección de filas */
  selectable?: boolean;
  /** Filas seleccionadas (controlado) */
  selectedRows?: T[];
  /** Callback de cambio de selección */
  onSelectionChange?: (selectedRows: T[]) => void;
  /** Modo de selección */
  selectionMode?: 'single' | 'multiple';

  // === Estados ===
  /** Estado de carga */
  loading?: boolean;
  /** Componente de loading personalizado */
  loadingComponent?: ReactNode;
  /** Componente de estado vacío personalizado */
  emptyComponent?: ReactNode;

  // === Personalización ===
  /** Clases CSS personalizadas */
  classNames?: TableClassNames;
  /** Estilos inline personalizados */
  styles?: {
    container?: CSSProperties;
    table?: CSSProperties;
    header?: CSSProperties;
    body?: CSSProperties;
    row?: CSSProperties;
    cell?: CSSProperties;
  };
  /** Textos personalizados */
  locale?: TableLocale;

  // === Características ===
  /** Header fijo al hacer scroll */
  stickyHeader?: boolean;
  /** Altura máxima (activa scroll interno) */
  maxHeight?: string | number;
  /** Mostrar bordes */
  bordered?: boolean;
  /** Filas con rayas alternas */
  striped?: boolean;
  /** Hover en filas */
  hoverable?: boolean;
  /** Tamaño de la tabla */
  size?: 'small' | 'medium' | 'large';

  // === Callbacks ===
  /** Callback al hacer click en una fila */
  onRowClick?: (row: T, rowIndex: number) => void;
  /** Callback al hacer doble click en una fila */
  onRowDoubleClick?: (row: T, rowIndex: number) => void;

  // === Accesibilidad ===
  /** Descripción de la tabla para screen readers */
  ariaLabel?: string;
  /** ID del elemento que describe la tabla */
  ariaDescribedBy?: string;
}
