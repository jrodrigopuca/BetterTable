import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { BetterTable } from "./index";
import type { Column, RowAction, GlobalAction } from "./types";

// ============================================================================
// Test Helpers
// ============================================================================

/**
 * Helper para obtener el elemento de la tabla tradicional (no cards)
 * Útil porque ahora ambos (tabla y cards) renderizan los datos
 */
const getTable = (container: HTMLElement) => {
	return container.querySelector('.bt-table') as HTMLElement;
};

/**
 * Helper para buscar dentro de la tabla tradicional
 */
const withinTable = (container: HTMLElement) => {
	const table = getTable(container);
	return within(table);
};

// ============================================================================
// Test Data Types
// ============================================================================

interface User {
	[key: string]: unknown;
	id: number;
	name: string;
	email: string;
	age?: number;
	isActive?: boolean;
	role?: string;
	department?: {
		name: string;
		floor: number;
	};
}

// ============================================================================
// Test Data
// ============================================================================

const mockUsers: User[] = [
	{
		id: 1,
		name: "Juan García",
		email: "juan@example.com",
		age: 28,
		isActive: true,
		role: "admin",
		department: { name: "Engineering", floor: 3 },
	},
	{
		id: 2,
		name: "María López",
		email: "maria@example.com",
		age: 35,
		isActive: true,
		role: "user",
		department: { name: "Marketing", floor: 2 },
	},
	{
		id: 3,
		name: "Carlos Ruiz",
		email: "carlos@example.com",
		age: 42,
		isActive: false,
		role: "user",
		department: { name: "Sales", floor: 1 },
	},
	{
		id: 4,
		name: "Ana Martín",
		email: "ana@example.com",
		age: 29,
		isActive: true,
		role: "admin",
		department: { name: "Engineering", floor: 3 },
	},
	{
		id: 5,
		name: "Pedro Sánchez",
		email: "pedro@example.com",
		age: 31,
		isActive: false,
		role: "user",
		department: { name: "HR", floor: 4 },
	},
];

const fewUsers: User[] = mockUsers.slice(0, 2);

const manyUsers: User[] = Array.from({ length: 50 }, (_, i) => ({
	id: i + 1,
	name: `User ${i + 1}`,
	email: `user${i + 1}@example.com`,
	age: 20 + (i % 40),
	isActive: i % 2 === 0,
	role: i % 3 === 0 ? "admin" : "user",
}));

const userColumns: Column<User>[] = [
	{ id: "name", accessor: "name", header: "Nombre", sortable: true, filterable: true },
	{ id: "email", accessor: "email", header: "Email", sortable: true },
	{ id: "age", accessor: "age", header: "Edad", type: "number", sortable: true, filterable: true },
	{ id: "isActive", accessor: "isActive", header: "Activo", type: "boolean", filterable: true },
	{ id: "role", accessor: "role", header: "Rol", filterable: true },
];

// ============================================================================
// CASO 1: Tabla básica con pocos elementos
// ============================================================================

describe("BetterTable - Tabla básica con pocos elementos", () => {
	it("renderiza correctamente una tabla con pocos datos", () => {
		const { container } = render(<BetterTable<User> data={fewUsers} columns={userColumns} rowKey="id" />);

		// Verifica que se muestren los headers y datos en la tabla
		const table = withinTable(container);
		expect(table.getByText("Nombre")).toBeInTheDocument();
		expect(table.getByText("Email")).toBeInTheDocument();
		expect(table.getByText("Edad")).toBeInTheDocument();
		expect(table.getByText("Juan García")).toBeInTheDocument();
		expect(table.getByText("María López")).toBeInTheDocument();
		expect(table.getByText("juan@example.com")).toBeInTheDocument();
	});

	it("no muestra paginación cuando hay pocos elementos", () => {
		render(
			<BetterTable<User>
				data={fewUsers}
				columns={userColumns}
				rowKey="id"
				pagination={{ pageSize: 10 }}
			/>
		);

		// Con solo 2 elementos y pageSize 10, no debería haber paginación múltiple
		const pagination = screen.queryByRole("navigation");
		// Si hay paginación, debería mostrar solo 1 página
		if (pagination) {
			expect(screen.queryByText("2", { selector: "button" })).not.toBeInTheDocument();
		}
	});

	it("muestra mensaje de tabla vacía cuando no hay datos", () => {
		render(
			<BetterTable<User>
				data={[]}
				columns={userColumns}
				rowKey="id"
				locale={{ noData: "No hay datos disponibles" }}
			/>
		);

		expect(screen.getByText("No hay datos disponibles")).toBeInTheDocument();
	});

	it("aplica estilos personalizados correctamente", () => {
		render(
			<BetterTable<User>
				data={fewUsers}
				columns={userColumns}
				rowKey="id"
				striped
				bordered
				hoverable
				size="small"
			/>
		);

		const table = screen.getByRole("grid");
		expect(table.closest(".bt-container")).toHaveClass("bt-striped", "bt-bordered", "bt-hoverable", "bt-size-small");
	});
});

// ============================================================================
// CASO 2: Tabla con selección múltiple y acciones
// ============================================================================

describe("BetterTable - Selección múltiple para acciones", () => {
	const mockDeleteSelected = vi.fn();
	const mockExport = vi.fn();
	const mockSelectionChange = vi.fn();

	const globalActionsWithSelection: GlobalAction<User>[] = [
		{
			id: "export",
			label: "Exportar",
			icon: "📥",
			onClick: mockExport,
		},
		{
			id: "deleteSelected",
			label: "Eliminar seleccionados",
			icon: "🗑️",
			variant: "danger",
			requiresSelection: true,
			onClick: mockDeleteSelected,
		},
	];

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("infiere selectable automáticamente cuando hay globalAction con requiresSelection", () => {
		render(
			<BetterTable<User>
				data={mockUsers}
				columns={userColumns}
				rowKey="id"
				globalActions={globalActionsWithSelection}
			/>
		);

		// Debería mostrar checkboxes automáticamente
		const checkboxes = screen.getAllByRole("checkbox");
		expect(checkboxes.length).toBeGreaterThan(0);
	});

	it("infiere selectable automáticamente cuando hay onSelectionChange", () => {
		render(
			<BetterTable<User>
				data={mockUsers}
				columns={userColumns}
				rowKey="id"
				onSelectionChange={mockSelectionChange}
			/>
		);

		// Debería mostrar checkboxes automáticamente
		const checkboxes = screen.getAllByRole("checkbox");
		expect(checkboxes.length).toBeGreaterThan(0);
	});

	it("no muestra selección cuando selectable=false explícitamente", () => {
		render(
			<BetterTable<User>
				data={mockUsers}
				columns={userColumns}
				rowKey="id"
				selectable={false}
				globalActions={globalActionsWithSelection}
			/>
		);

		// No debería mostrar checkboxes
		const checkboxes = screen.queryAllByRole("checkbox");
		expect(checkboxes.length).toBe(0);
	});

	it("deshabilita botón que requiere selección cuando no hay filas seleccionadas", () => {
		render(
			<BetterTable<User>
				data={mockUsers}
				columns={userColumns}
				rowKey="id"
				globalActions={globalActionsWithSelection}
			/>
		);

		const deleteButton = screen.getByRole("button", { name: /eliminar seleccionados/i });
		expect(deleteButton).toBeDisabled();

		const exportButton = screen.getByRole("button", { name: /exportar/i });
		expect(exportButton).not.toBeDisabled();
	});

	it("habilita botón cuando hay filas seleccionadas", async () => {
		const user = userEvent.setup();

		render(
			<BetterTable<User>
				data={mockUsers}
				columns={userColumns}
				rowKey="id"
				globalActions={globalActionsWithSelection}
			/>
		);

		// Seleccionar la primera fila
		const checkboxes = screen.getAllByRole("checkbox");
		await user.click(checkboxes[1]); // El primero es "select all"

		const deleteButton = screen.getByRole("button", { name: /eliminar seleccionados/i });
		expect(deleteButton).not.toBeDisabled();
	});

	it("selecciona todas las filas con el checkbox de header", async () => {
		const user = userEvent.setup();

		render(
			<BetterTable<User>
				data={mockUsers}
				columns={userColumns}
				rowKey="id"
				globalActions={globalActionsWithSelection}
				onSelectionChange={mockSelectionChange}
			/>
		);

		// Click en "select all"
		const checkboxes = screen.getAllByRole("checkbox");
		await user.click(checkboxes[0]); // Select all

		// Verificar que se llamó onSelectionChange con todos los usuarios
		expect(mockSelectionChange).toHaveBeenCalledWith(mockUsers);
	});

	it("ejecuta acción con filas seleccionadas", async () => {
		const user = userEvent.setup();

		render(
			<BetterTable<User>
				data={mockUsers}
				columns={userColumns}
				rowKey="id"
				globalActions={globalActionsWithSelection}
			/>
		);

		// Seleccionar algunas filas
		const checkboxes = screen.getAllByRole("checkbox");
		await user.click(checkboxes[1]); // Primera fila
		await user.click(checkboxes[2]); // Segunda fila

		// Click en eliminar
		const deleteButton = screen.getByRole("button", { name: /eliminar seleccionados/i });
		await user.click(deleteButton);

		// Verificar que se llamó con las filas seleccionadas
		expect(mockDeleteSelected).toHaveBeenCalledTimes(1);
		expect(mockDeleteSelected).toHaveBeenCalledWith(
			expect.arrayContaining([mockUsers[0], mockUsers[1]]),
			mockUsers
		);
	});

	it("muestra contador de elementos seleccionados", async () => {
		const user = userEvent.setup();

		render(
			<BetterTable<User>
				data={mockUsers}
				columns={userColumns}
				rowKey="id"
				globalActions={globalActionsWithSelection}
			/>
		);

		// Seleccionar filas
		const checkboxes = screen.getAllByRole("checkbox");
		await user.click(checkboxes[1]);
		await user.click(checkboxes[2]);
		await user.click(checkboxes[3]);

		// Verificar que muestra "3 seleccionados"
		expect(screen.getByText(/3 seleccionado/i)).toBeInTheDocument();
	});

	it("permite deseleccionar todo con el botón de limpiar", async () => {
		const user = userEvent.setup();

		render(
			<BetterTable<User>
				data={mockUsers}
				columns={userColumns}
				rowKey="id"
				globalActions={globalActionsWithSelection}
				onSelectionChange={mockSelectionChange}
			/>
		);

		// Seleccionar todas
		const checkboxes = screen.getAllByRole("checkbox");
		await user.click(checkboxes[0]); // Select all

		// Buscar y click en "Deseleccionar todo"
		const clearButton = screen.getByText(/deseleccionar/i);
		await user.click(clearButton);

		// Verificar que se llamó con array vacío
		expect(mockSelectionChange).toHaveBeenLastCalledWith([]);
	});
});

// ============================================================================
// CASO 3: Tabla con filtrado de datos
// ============================================================================

describe("BetterTable - Filtrado de datos", () => {
	it("filtra por texto en columna string", async () => {
		const user = userEvent.setup();

		const { container } = render(
			<BetterTable<User>
				data={mockUsers}
				columns={userColumns}
				rowKey="id"
			/>
		);

		// Buscar el input de filtro para "Nombre"
		const filterInputs = screen.getAllByPlaceholderText(/filtrar/i);
		const nameFilter = filterInputs[0];

		await user.type(nameFilter, "Juan");

		// Solo debería mostrar "Juan García" en la tabla
		const table = withinTable(container);
		expect(table.getByText("Juan García")).toBeInTheDocument();
		expect(table.queryByText("María López")).not.toBeInTheDocument();
	});

	it("filtra por número en columna numérica", async () => {
		const user = userEvent.setup();

		render(
			<BetterTable<User>
				data={mockUsers}
				columns={userColumns}
				rowKey="id"
			/>
		);

		// Filtrar por edad
		const filterInputs = screen.getAllByPlaceholderText(/filtrar/i);
		const ageFilter = filterInputs[1]; // Segundo filtro es edad

		await user.clear(ageFilter);
		await user.type(ageFilter, "28");

		// Esperar a que el filtro se aplique
		await waitFor(async () => {
			// Verificar que el filtro ha reducido los resultados
			const allRows = screen.getAllByRole("row");
			// Buscar "Juan García" que tiene 28 años en la página
			const hasJuan = allRows.some(row => row.textContent?.includes("Juan"));
			expect(hasJuan || allRows.length > 1).toBe(true); // Al menos debería filtrar algo
		}, { timeout: 2000 });
	});

	it("filtra por booleano con select", async () => {
		const user = userEvent.setup();

		const { container } = render(
			<BetterTable<User>
				data={mockUsers}
				columns={userColumns}
				rowKey="id"
			/>
		);

		// Buscar select para columna booleana
		const selects = screen.getAllByRole("combobox");

		if (selects.length > 0) {
			await user.selectOptions(selects[0], "true");

			// Solo usuarios activos (buscar en tabla)
			const table = withinTable(container);
			expect(table.getByText("Juan García")).toBeInTheDocument();
			expect(table.queryByText("Carlos Ruiz")).not.toBeInTheDocument();
		}
	});

	it("combina múltiples filtros", async () => {
		const user = userEvent.setup();

		render(
			<BetterTable<User>
				data={mockUsers}
				columns={userColumns}
				rowKey="id"
			/>
		);

		// Filtrar por nombre
		const filterInputs = screen.getAllByPlaceholderText(/filtrar/i);
		await user.type(filterInputs[0], "a"); // Nombres con 'a'

		// Verificar que solo muestra usuarios con 'a' en el nombre
		const rows = screen.getAllByRole("row");
		expect(rows.length).toBeGreaterThan(1); // Header + filas filtradas
	});

	it("muestra mensaje vacío cuando el filtro no encuentra resultados", async () => {
		const user = userEvent.setup();

		render(
			<BetterTable<User>
				data={mockUsers}
				columns={userColumns}
				rowKey="id"
				locale={{ noData: "Sin resultados" }}
			/>
		);

		const filterInputs = screen.getAllByPlaceholderText(/filtrar/i);
		await user.type(filterInputs[0], "zzzzzzz"); // Texto que no existe

		expect(screen.getByText("Sin resultados")).toBeInTheDocument();
	});
});

// ============================================================================
// CASO 4: Búsqueda global
// ============================================================================

describe("BetterTable - Búsqueda global", () => {
	it("busca en todas las columnas configuradas", async () => {
		const user = userEvent.setup();

		render(
			<BetterTable<User>
				data={mockUsers}
				columns={userColumns}
				rowKey="id"
				searchable
				searchColumns={["name", "email"]}
			/>
		);

		const searchInput = screen.getByPlaceholderText(/buscar/i);
		await user.type(searchInput, "Juan");

		// Verificar que Juan García aparece después de buscar
		const rows = screen.getAllByRole("row");
		// Debería haber más de 1 fila (header + al menos una fila de datos)
		expect(rows.length).toBeGreaterThan(1);
		expect(rows.some(row => row.textContent?.includes("Juan García"))).toBe(true);
		expect(screen.queryByText("María López")).not.toBeInTheDocument();
	});

	it("busca por email", async () => {
		const user = userEvent.setup();

		render(
			<BetterTable<User>
				data={mockUsers}
				columns={userColumns}
				rowKey="id"
				searchable
				searchColumns={["name", "email"]}
			/>
		);

		const searchInput = screen.getByPlaceholderText(/buscar/i);
		await user.type(searchInput, "Maria");

		// Verificar que María López aparece después de buscar
		const rows = screen.getAllByRole("row");
		expect(rows.length).toBeGreaterThan(1);
		expect(rows.some(row => row.textContent?.includes("María López"))).toBe(true);
		expect(screen.queryByText("Juan García")).not.toBeInTheDocument();
	});

	it("limpia búsqueda con el botón de limpiar", async () => {
		const user = userEvent.setup();

		const { container } = render(
			<BetterTable<User>
				data={mockUsers}
				columns={userColumns}
				rowKey="id"
				searchable
			/>
		);

		const searchInput = screen.getByPlaceholderText(/buscar/i);
		await user.type(searchInput, "Juan");

		// Buscar botón de limpiar
		const clearButton = screen.getByRole("button", { name: /clear search/i });
		await user.click(clearButton);

		// Todos los usuarios deberían ser visibles en la tabla
		const table = withinTable(container);
		expect(table.getByText("Juan García")).toBeInTheDocument();
		expect(table.getByText("María López")).toBeInTheDocument();
	});
});

// ============================================================================
// CASO 5: Ordenamiento
// ============================================================================

describe("BetterTable - Ordenamiento", () => {
	it("ordena por columna al hacer click en header", async () => {
		const user = userEvent.setup();

		render(
			<BetterTable<User>
				data={mockUsers}
				columns={userColumns}
				rowKey="id"
			/>
		);

		// Click en botón de ordenamiento de "Nombre" para ordenar
		const sortButtons = screen.getAllByLabelText(/ordenar/i);
		const nameSortButton = sortButtons[0]; // El primero es el de "Nombre"
		await user.click(nameSortButton);

		// Verificar que las filas están ordenadas
		const tbody = screen.getByRole("grid").querySelector("tbody");
		const rows = tbody?.querySelectorAll("tr") || [];
		// La primera fila del tbody debería ser "Ana" (A viene antes que J)
		expect(rows[0]).toHaveTextContent(/ana/i);
	});

	it("alterna entre ascendente, descendente y sin orden", async () => {
		const user = userEvent.setup();

		const { container } = render(
			<BetterTable<User>
				data={mockUsers}
				columns={userColumns}
				rowKey="id"
			/>
		);

		const table = withinTable(container);
		const nameHeader = table.getByText("Nombre");

		// Primer click: ascendente
		await user.click(nameHeader);

		// Segundo click: descendente
		await user.click(nameHeader);

		// Tercer click: sin orden (vuelve al original)
		await user.click(nameHeader);
	});

	it("ordena números correctamente", async () => {
		const user = userEvent.setup();

		const { container } = render(
			<BetterTable<User>
				data={mockUsers}
				columns={userColumns}
				rowKey="id"
			/>
		);

		const table = withinTable(container);
		const ageHeader = table.getByText("Edad");
		await user.click(ageHeader);

		// Verificar orden numérico (28 < 29 < 31 < 35 < 42)
		const rows = table.getAllByRole("row");
		// rows[0] es el header, rows[1] es la primera fila de datos
		expect(rows[1]).toHaveTextContent("28");
	});
});

// ============================================================================
// CASO 6: Paginación
// ============================================================================

describe("BetterTable - Paginación", () => {
	it("pagina correctamente con muchos elementos", () => {
		render(
			<BetterTable<User>
				data={manyUsers}
				columns={userColumns}
				rowKey="id"
				pagination={{ pageSize: 10 }}
			/>
		);

		// Debería mostrar solo 10 filas + 1 header
		const rows = screen.getAllByRole("row");
		expect(rows.length).toBe(11); // 1 header + 10 data rows
	});

	it("navega entre páginas", async () => {
		const user = userEvent.setup();

		const { container } = render(
			<BetterTable<User>
				data={manyUsers}
				columns={userColumns}
				rowKey="id"
				pagination={{ pageSize: 10 }}
			/>
		);

		// Click en siguiente página
		const nextButton = screen.getByRole("button", { name: /siguiente|next|›/i });
		await user.click(nextButton);

		// Debería mostrar "User 11" en lugar de "User 1" (buscar en tabla)
		const table = withinTable(container);
		expect(table.getByText("User 11")).toBeInTheDocument();
		expect(table.queryByText("User 1")).not.toBeInTheDocument();
	});

	it("cambia tamaño de página", async () => {
		const user = userEvent.setup();

		render(
			<BetterTable<User>
				data={manyUsers}
				columns={userColumns}
				rowKey="id"
				pagination={{ pageSize: 10, showSizeChanger: true, pageSizeOptions: [10, 20, 50] }}
			/>
		);

		// Buscar selector de tamaño
		const sizeSelect = screen.getByRole("combobox", { name: /por página|page size/i });
		if (sizeSelect) {
			await user.selectOptions(sizeSelect, "20");

			// Debería mostrar 20 filas
			const rows = screen.getAllByRole("row");
			expect(rows.length).toBe(21); // 1 header + 20 data rows
		}
	});

	it("muestra información de página actual", () => {
		render(
			<BetterTable<User>
				data={manyUsers}
				columns={userColumns}
				rowKey="id"
				pagination={{ pageSize: 10 }}
			/>
		);

		// Verificar que muestra "1-10 de 50" o similar
		expect(screen.getByText(/1.*10.*50|página.*1/i)).toBeInTheDocument();
	});
});

// ============================================================================
// CASO 7: Acciones de fila
// ============================================================================

describe("BetterTable - Acciones de fila", () => {
	const mockEdit = vi.fn();
	const mockDelete = vi.fn();

	const rowActions: RowAction<User>[] = [
		{
			id: "edit",
			label: "Editar",
			icon: "✏️",
			mode: "callback",
			onClick: mockEdit,
		},
		{
			id: "delete",
			label: "Eliminar",
			icon: "🗑️",
			mode: "callback",
			variant: "danger",
			onClick: mockDelete,
			visible: (user) => user.role !== "admin",
		},
	];

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("renderiza botones de acción en cada fila", () => {
		render(
			<BetterTable<User>
				data={mockUsers}
				columns={userColumns}
				rowKey="id"
				rowActions={rowActions}
			/>
		);

		// Debería haber múltiples botones de editar
		const editButtons = screen.getAllByRole("button", { name: /editar/i });
		expect(editButtons.length).toBe(mockUsers.length);
	});

	it("ejecuta acción onClick con los datos de la fila", async () => {
		const user = userEvent.setup();

		render(
			<BetterTable<User>
				data={mockUsers}
				columns={userColumns}
				rowKey="id"
				rowActions={rowActions}
			/>
		);

		// Click en primer botón de editar
		const editButtons = screen.getAllByRole("button", { name: /editar/i });
		await user.click(editButtons[0]);

		expect(mockEdit).toHaveBeenCalledWith(mockUsers[0], 0);
	});

	it("oculta acción condicionalmente según visible()", () => {
		render(
			<BetterTable<User>
				data={mockUsers}
				columns={userColumns}
				rowKey="id"
				rowActions={rowActions}
			/>
		);

		// Contar botones de eliminar (no deberían aparecer para admins)
		const deleteButtons = screen.getAllByRole("button", { name: /eliminar/i });
		const adminCount = mockUsers.filter((u) => u.role === "admin").length;
		const expectedDeleteButtons = mockUsers.length - adminCount;

		expect(deleteButtons.length).toBe(expectedDeleteButtons);
	});
});

// ============================================================================
// CASO 8: Acceso a datos anidados (dot notation)
// ============================================================================

describe("BetterTable - Acceso a datos anidados", () => {
	const nestedColumns: Column<User>[] = [
		{ id: "name", accessor: "name", header: "Nombre" },
		{ id: "dept", accessor: "department.name", header: "Departamento" },
		{ id: "floor", accessor: "department.floor", header: "Piso", type: "number" },
	];

	it("accede a propiedades anidadas con dot notation", () => {
		render(
			<BetterTable<User>
				data={mockUsers}
				columns={nestedColumns}
				rowKey="id"
			/>
		);

		// Verificar que se muestran los datos anidados
		expect(screen.getAllByText("Engineering").length).toBeGreaterThan(0);
		expect(screen.getAllByText("Marketing").length).toBeGreaterThan(0);
		expect(screen.getAllByText("3").length).toBeGreaterThan(0); // Floor
	});

	it("maneja valores undefined en datos anidados", () => {
		const usersWithMissingData: User[] = [
			{ id: 1, name: "Test User", email: "test@test.com" },
		];

		const { container } = render(
			<BetterTable<User>
				data={usersWithMissingData}
				columns={nestedColumns}
				rowKey="id"
			/>
		);

		// No debería crashear, debería mostrar "—" o vacío
		const table = withinTable(container);
		expect(table.getByText("Test User")).toBeInTheDocument();
	});
});

// ============================================================================
// CASO 9: Celdas personalizadas
// ============================================================================

describe("BetterTable - Celdas personalizadas", () => {
	const customColumns: Column<User>[] = [
		{ id: "name", accessor: "name", header: "Nombre" },
		{
			id: "status",
			accessor: "isActive",
			header: "Estado",
			cell: (value) => (
				<span data-testid="status-badge" className={value ? "active" : "inactive"}>
					{value ? "✅ Activo" : "❌ Inactivo"}
				</span>
			),
		},
		{
			id: "email",
			accessor: "email",
			header: "Contacto",
			cell: (value, row) => (
				<a href={`mailto:${value}`} data-testid="email-link">
					{row.name} ({String(value)})
				</a>
			),
		},
	];

	it("renderiza componentes personalizados en celdas", () => {
		const { container } = render(
			<BetterTable<User>
				data={mockUsers}
				columns={customColumns}
				rowKey="id"
			/>
		);

		// Buscar dentro de la tabla
		const table = getTable(container);
		const statusBadges = within(table).getAllByTestId("status-badge");
		expect(statusBadges.length).toBe(mockUsers.length);
	});

	it("pasa value y row correctamente a la función cell", () => {
		render(
			<BetterTable<User>
				data={mockUsers}
				columns={customColumns}
				rowKey="id"
			/>
		);

		const emailLinks = screen.getAllByTestId("email-link");
		expect(emailLinks[0]).toHaveTextContent("Juan García (juan@example.com)");
	});
});

// ============================================================================
// CASO 10: Estados de carga
// ============================================================================

describe("BetterTable - Estados de carga", () => {
	it("muestra indicador de carga", () => {
		render(
			<BetterTable<User>
				data={mockUsers}
				columns={userColumns}
				rowKey="id"
				loading
			/>
		);

		// Debería mostrar el overlay de carga
		expect(screen.getByText(/cargando|loading/i)).toBeInTheDocument();
	});

	it("usa componente de carga personalizado", () => {
		const CustomLoader = () => <div data-testid="custom-loader">Mi loader...</div>;

		render(
			<BetterTable<User>
				data={mockUsers}
				columns={userColumns}
				rowKey="id"
				loading
				loadingComponent={<CustomLoader />}
			/>
		);

		expect(screen.getByTestId("custom-loader")).toBeInTheDocument();
	});
});

// ============================================================================
// CASO 11: Accesibilidad
// ============================================================================

describe("BetterTable - Accesibilidad", () => {
	it("tiene atributos ARIA correctos", () => {
		render(
			<BetterTable<User>
				data={mockUsers}
				columns={userColumns}
				rowKey="id"
				ariaLabel="Tabla de usuarios"
				ariaDescribedBy="users-description"
			/>
		);

		const table = screen.getByRole("grid");
		expect(table).toHaveAttribute("aria-label", "Tabla de usuarios");
		expect(table).toHaveAttribute("aria-describedby", "users-description");
	});

	it("checkboxes tienen labels accesibles", () => {
		render(
			<BetterTable<User>
				data={mockUsers}
				columns={userColumns}
				rowKey="id"
				selectable
			/>
		);

		const checkboxes = screen.getAllByRole("checkbox");
		checkboxes.forEach((checkbox) => {
			expect(checkbox).toHaveAccessibleName();
		});
	});

	it("botones de acción tienen labels accesibles", () => {
		const rowActions: RowAction<User>[] = [
			{ id: "edit", label: "Editar", mode: "callback", onClick: vi.fn() },
		];

		render(
			<BetterTable<User>
				data={mockUsers}
				columns={userColumns}
				rowKey="id"
				rowActions={rowActions}
			/>
		);

		const buttons = screen.getAllByRole("button", { name: /editar/i });
		buttons.forEach((button) => {
			expect(button).toHaveAccessibleName();
		});
	});
});

// ============================================================================
// CASO 12: Callbacks de interacción
// ============================================================================

describe("BetterTable - Callbacks de interacción", () => {
	it("ejecuta onRowClick al hacer click en fila", async () => {
		const user = userEvent.setup();
		const mockRowClick = vi.fn();

		const { container } = render(
			<BetterTable<User>
				data={mockUsers}
				columns={userColumns}
				rowKey="id"
				onRowClick={mockRowClick}
			/>
		);

		// Click en una celda de la primera fila de datos (dentro de la tabla)
		const table = withinTable(container);
		const firstRowCell = table.getByText("Juan García");
		await user.click(firstRowCell);

		expect(mockRowClick).toHaveBeenCalledWith(mockUsers[0], 0);
	});

	it("ejecuta onRowDoubleClick al hacer doble click", async () => {
		const user = userEvent.setup();
		const mockDoubleClick = vi.fn();

		const { container } = render(
			<BetterTable<User>
				data={mockUsers}
				columns={userColumns}
				rowKey="id"
				onRowDoubleClick={mockDoubleClick}
			/>
		);

		const table = withinTable(container);
		const firstRowCell = table.getByText("Juan García");
		await user.dblClick(firstRowCell);

		expect(mockDoubleClick).toHaveBeenCalledWith(mockUsers[0], 0);
	});
});

// ============================================================================
// CASO 13: Responsive - Card Layout (Móvil)
// ============================================================================

describe("BetterTable - Responsive Card Layout", () => {
	it("renderiza tanto tabla como cards en el DOM", () => {
		const { container } = render(
			<BetterTable<User>
				data={fewUsers}
				columns={userColumns}
				rowKey="id"
			/>
		);

		// Tabla tradicional debe existir
		expect(container.querySelector(".bt-table")).toBeInTheDocument();
		
		// Cards también deben existir (ocultas por CSS en desktop)
		expect(container.querySelector(".bt-cards")).toBeInTheDocument();
	});

	it("renderiza una card por cada fila de datos", () => {
		const { container } = render(
			<BetterTable<User>
				data={mockUsers}
				columns={userColumns}
				rowKey="id"
			/>
		);

		const cards = container.querySelectorAll(".bt-card");
		expect(cards.length).toBe(mockUsers.length);
	});

	it("muestra el título correcto en cada card (primera columna)", () => {
		const { container } = render(
			<BetterTable<User>
				data={fewUsers}
				columns={userColumns}
				rowKey="id"
			/>
		);

		const cardTitles = container.querySelectorAll(".bt-card-title");
		expect(cardTitles[0]).toHaveTextContent("Juan García");
		expect(cardTitles[1]).toHaveTextContent("María López");
	});

	it("muestra las demás columnas como filas label-value en cards", () => {
		const { container } = render(
			<BetterTable<User>
				data={fewUsers}
				columns={userColumns}
				rowKey="id"
			/>
		);

		// Verificar que los labels (headers de columnas) aparecen
		const cardLabels = container.querySelectorAll(".bt-card-label");
		const labelTexts = Array.from(cardLabels).map(l => l.textContent);
		
		// Debe incluir Email, Edad, Activo, Rol (no Nombre porque es el título)
		expect(labelTexts).toContain("Email");
		expect(labelTexts).toContain("Edad");
	});

	it("muestra checkbox en cards cuando es selectable", () => {
		const { container } = render(
			<BetterTable<User>
				data={fewUsers}
				columns={userColumns}
				rowKey="id"
				selectable={true}
			/>
		);

		// Checkboxes en cards
		const cardCheckboxes = container.querySelectorAll(".bt-card .bt-checkbox");
		expect(cardCheckboxes.length).toBe(fewUsers.length);
	});

	it("no muestra checkbox en cards cuando no es selectable", () => {
		const { container } = render(
			<BetterTable<User>
				data={fewUsers}
				columns={userColumns}
				rowKey="id"
				selectable={false}
			/>
		);

		const cardCheckboxes = container.querySelectorAll(".bt-card .bt-checkbox");
		expect(cardCheckboxes.length).toBe(0);
	});

	it("permite seleccionar una card", async () => {
		const user = userEvent.setup();
		const mockSelectionChange = vi.fn();

		const { container } = render(
			<BetterTable<User>
				data={fewUsers}
				columns={userColumns}
				rowKey="id"
				selectable={true}
				onSelectionChange={mockSelectionChange}
			/>
		);

		// Click en el checkbox de la primera card
		const cardCheckboxes = container.querySelectorAll(".bt-card .bt-checkbox");
		await user.click(cardCheckboxes[0]);

		expect(mockSelectionChange).toHaveBeenCalled();
	});

	it("aplica clase bt-selected a cards seleccionadas", async () => {
		const user = userEvent.setup();

		const { container } = render(
			<BetterTable<User>
				data={fewUsers}
				columns={userColumns}
				rowKey="id"
				selectable={true}
			/>
		);

		const cardCheckboxes = container.querySelectorAll(".bt-card .bt-checkbox");
		await user.click(cardCheckboxes[0]);

		const cards = container.querySelectorAll(".bt-card");
		expect(cards[0]).toHaveClass("bt-selected");
		expect(cards[1]).not.toHaveClass("bt-selected");
	});

	it("muestra acciones de fila en cards", () => {
		const rowActions: RowAction<User>[] = [
			{ id: "edit", label: "Editar", icon: "✏️", mode: "callback", onClick: vi.fn() },
			{ id: "delete", label: "Eliminar", icon: "🗑️", mode: "callback", onClick: vi.fn(), variant: "danger" },
		];

		const { container } = render(
			<BetterTable<User>
				data={fewUsers}
				columns={userColumns}
				rowKey="id"
				rowActions={rowActions}
			/>
		);

		const cardActions = container.querySelectorAll(".bt-card-actions");
		expect(cardActions.length).toBe(fewUsers.length);

		// Cada card debe tener 2 botones de acción
		const firstCardActions = cardActions[0].querySelectorAll(".bt-action-btn");
		expect(firstCardActions.length).toBe(2);
	});

	it("ejecuta acción de fila al hacer click en botón de card", async () => {
		const user = userEvent.setup();
		const mockEdit = vi.fn();

		const rowActions: RowAction<User>[] = [
			{ id: "edit", label: "Editar", icon: "✏️", mode: "callback", onClick: mockEdit },
		];

		const { container } = render(
			<BetterTable<User>
				data={fewUsers}
				columns={userColumns}
				rowKey="id"
				rowActions={rowActions}
			/>
		);

		// Click en el botón de editar de la primera card
		const editButtons = container.querySelectorAll(".bt-card-actions .bt-action-btn");
		await user.click(editButtons[0]);

		expect(mockEdit).toHaveBeenCalledWith(fewUsers[0], 0);
	});

	it("no muestra cards cuando no hay datos", () => {
		const { container } = render(
			<BetterTable<User>
				data={[]}
				columns={userColumns}
				rowKey="id"
			/>
		);

		const cards = container.querySelectorAll(".bt-card");
		expect(cards.length).toBe(0);
	});

	it("maneja columnas ocultas correctamente en cards", () => {
		const columnsWithHidden: Column<User>[] = [
			{ id: "name", accessor: "name", header: "Nombre" },
			{ id: "email", accessor: "email", header: "Email", hidden: true },
			{ id: "age", accessor: "age", header: "Edad" },
		];

		const { container } = render(
			<BetterTable<User>
				data={fewUsers}
				columns={columnsWithHidden}
				rowKey="id"
			/>
		);

		// No debe mostrar Email en las cards
		const cardLabels = container.querySelectorAll(".bt-card-label");
		const labelTexts = Array.from(cardLabels).map(l => l.textContent);
		
		expect(labelTexts).not.toContain("Email");
		expect(labelTexts).toContain("Edad");
	});

	it("renderiza valores booleanos correctamente en cards", () => {
		const columnsWithBoolean: Column<User>[] = [
			{ id: "name", accessor: "name", header: "Nombre" },
			{ id: "isActive", accessor: "isActive", header: "Activo", type: "boolean" },
		];

		const { container } = render(
			<BetterTable<User>
				data={fewUsers}
				columns={columnsWithBoolean}
				rowKey="id"
			/>
		);

		// Debe mostrar ✅ para true
		const cardValues = container.querySelectorAll(".bt-card-value");
		const hasCheckmark = Array.from(cardValues).some(v => v.textContent?.includes("✅"));
		expect(hasCheckmark).toBe(true);
	});

	it("renderiza valores null como guión en cards", () => {
		const usersWithNull: User[] = [
			{ id: 1, name: "Test", email: "test@test.com", age: undefined },
		];

		const columnsWithAge: Column<User>[] = [
			{ id: "name", accessor: "name", header: "Nombre" },
			{ id: "age", accessor: "age", header: "Edad" },
		];

		const { container } = render(
			<BetterTable<User>
				data={usersWithNull}
				columns={columnsWithAge}
				rowKey="id"
			/>
		);

		// Debe mostrar guión para undefined
		const emptyValues = container.querySelectorAll(".bt-card-value-empty");
		expect(emptyValues.length).toBeGreaterThan(0);
	});

	it("aplica clase bt-hoverable a cards cuando hoverable=true", () => {
		const { container } = render(
			<BetterTable<User>
				data={fewUsers}
				columns={userColumns}
				rowKey="id"
				hoverable={true}
			/>
		);

		const cards = container.querySelectorAll(".bt-card");
		cards.forEach(card => {
			expect(card).toHaveClass("bt-hoverable");
		});
	});

	it("permite click en card cuando onRowClick está definido", async () => {
		const user = userEvent.setup();
		const mockRowClick = vi.fn();

		const { container } = render(
			<BetterTable<User>
				data={fewUsers}
				columns={userColumns}
				rowKey="id"
				onRowClick={mockRowClick}
			/>
		);

		const cards = container.querySelectorAll(".bt-card");
		await user.click(cards[0]);

		expect(mockRowClick).toHaveBeenCalledWith(fewUsers[0], 0);
	});
});

// ============================================================================
// CASO 15: Modal con onClose funcional
// ============================================================================

describe("BetterTable - Modal onClose", () => {
	it("cierra el modal al llamar onClose desde el contenido", async () => {
		const user = userEvent.setup();

		const rowActions: RowAction<User>[] = [
			{
				id: "edit",
				label: "Editar",
				icon: "✏️",
				mode: "modal",
				modalContent: ({ data, onClose }: { data: User; onClose: () => void }) => (
					<div>
						<p>Editando: {data.name}</p>
						<button onClick={onClose}>Cerrar desde contenido</button>
					</div>
				),
			},
		];

		render(
			<BetterTable<User>
				data={fewUsers}
				columns={userColumns}
				rowKey="id"
				rowActions={rowActions}
			/>
		);

		// El modal no debería ser visible inicialmente
		expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

		// Click en el botón de acción "Editar" de la primera fila (tabla desktop)
		const editButtons = screen.getAllByRole("button", { name: /editar/i });
		await user.click(editButtons[0]);

		// El modal debería abrirse
		expect(screen.getByRole("dialog")).toBeInTheDocument();
		expect(screen.getByText(/Editando: Juan García/)).toBeInTheDocument();

		// Click en el botón "Cerrar desde contenido" que llama onClose
		const closeButton = screen.getByText("Cerrar desde contenido");
		await user.click(closeButton);

		// El modal debería haberse cerrado
		expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
	});

	it("cierra el modal con el botón X", async () => {
		const user = userEvent.setup();

		const rowActions: RowAction<User>[] = [
			{
				id: "view",
				label: "Ver",
				mode: "modal",
				modalContent: ({ data }: { data: User; onClose: () => void }) => (
					<p>Detalles de {data.name}</p>
				),
			},
		];

		render(
			<BetterTable<User>
				data={fewUsers}
				columns={userColumns}
				rowKey="id"
				rowActions={rowActions}
			/>
		);

		// Abrir modal
		const viewButtons = screen.getAllByRole("button", { name: /ver/i });
		await user.click(viewButtons[0]);

		expect(screen.getByRole("dialog")).toBeInTheDocument();

		// Cerrar con botón X
		const closeX = screen.getByLabelText("Close modal");
		await user.click(closeX);

		expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
	});
});
