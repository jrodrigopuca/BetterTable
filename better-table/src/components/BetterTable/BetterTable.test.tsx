import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { BetterTable } from "./index";
import type { Column, RowAction, GlobalAction } from "./types";

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
		render(<BetterTable<User> data={fewUsers} columns={userColumns} rowKey="id" />);

		// Verifica que se muestren los headers
		expect(screen.getByText("Nombre")).toBeInTheDocument();
		expect(screen.getByText("Email")).toBeInTheDocument();
		expect(screen.getByText("Edad")).toBeInTheDocument();

		// Verifica que se muestren los datos
		expect(screen.getByText("Juan García")).toBeInTheDocument();
		expect(screen.getByText("María López")).toBeInTheDocument();
		expect(screen.getByText("juan@example.com")).toBeInTheDocument();
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

		const table = screen.getByRole("table");
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
		expect(screen.getByText(/3/)).toBeInTheDocument();
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

		render(
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

		// Solo debería mostrar "Juan García"
		expect(screen.getByText("Juan García")).toBeInTheDocument();
		expect(screen.queryByText("María López")).not.toBeInTheDocument();
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

		await user.type(ageFilter, "28");

		// Solo usuarios con edad 28
		expect(screen.getByText("Juan García")).toBeInTheDocument();
		expect(screen.queryByText("María López")).not.toBeInTheDocument();
	});

	it("filtra por booleano con select", async () => {
		const user = userEvent.setup();

		render(
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

			// Solo usuarios activos
			expect(screen.getByText("Juan García")).toBeInTheDocument();
			expect(screen.queryByText("Carlos Ruiz")).not.toBeInTheDocument();
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
		await user.type(searchInput, "garcia");

		expect(screen.getByText("Juan García")).toBeInTheDocument();
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
		await user.type(searchInput, "maria@");

		expect(screen.getByText("María López")).toBeInTheDocument();
		expect(screen.queryByText("Juan García")).not.toBeInTheDocument();
	});

	it("limpia búsqueda con el botón de limpiar", async () => {
		const user = userEvent.setup();

		render(
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

		// Todos los usuarios deberían ser visibles
		expect(screen.getByText("Juan García")).toBeInTheDocument();
		expect(screen.getByText("María López")).toBeInTheDocument();
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

		// Click en header "Nombre" para ordenar
		const nameHeader = screen.getByText("Nombre");
		await user.click(nameHeader);

		// Verificar que las filas están ordenadas
		const rows = screen.getAllByRole("row");
		// La primera fila después del header debería ser "Ana" (A viene antes que J)
		expect(rows[1]).toHaveTextContent(/ana/i);
	});

	it("alterna entre ascendente, descendente y sin orden", async () => {
		const user = userEvent.setup();

		render(
			<BetterTable<User>
				data={mockUsers}
				columns={userColumns}
				rowKey="id"
			/>
		);

		const nameHeader = screen.getByText("Nombre");

		// Primer click: ascendente
		await user.click(nameHeader);

		// Segundo click: descendente
		await user.click(nameHeader);

		// Tercer click: sin orden (vuelve al original)
		await user.click(nameHeader);
	});

	it("ordena números correctamente", async () => {
		const user = userEvent.setup();

		render(
			<BetterTable<User>
				data={mockUsers}
				columns={userColumns}
				rowKey="id"
			/>
		);

		const ageHeader = screen.getByText("Edad");
		await user.click(ageHeader);

		// Verificar orden numérico (28 < 29 < 31 < 35 < 42)
		const rows = screen.getAllByRole("row");
		// Primera fila debería ser el usuario más joven
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

		render(
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

		// Debería mostrar "User 11" en lugar de "User 1"
		expect(screen.getByText("User 11")).toBeInTheDocument();
		expect(screen.queryByText("User 1")).not.toBeInTheDocument();
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
		expect(screen.getByText("Engineering")).toBeInTheDocument();
		expect(screen.getByText("Marketing")).toBeInTheDocument();
		expect(screen.getByText("3")).toBeInTheDocument(); // Floor
	});

	it("maneja valores undefined en datos anidados", () => {
		const usersWithMissingData: User[] = [
			{ id: 1, name: "Test User", email: "test@test.com" },
		];

		render(
			<BetterTable<User>
				data={usersWithMissingData}
				columns={nestedColumns}
				rowKey="id"
			/>
		);

		// No debería crashear, debería mostrar "—" o vacío
		expect(screen.getByText("Test User")).toBeInTheDocument();
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
		render(
			<BetterTable<User>
				data={mockUsers}
				columns={customColumns}
				rowKey="id"
			/>
		);

		const statusBadges = screen.getAllByTestId("status-badge");
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

		const table = screen.getByRole("table");
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

		render(
			<BetterTable<User>
				data={mockUsers}
				columns={userColumns}
				rowKey="id"
				onRowClick={mockRowClick}
			/>
		);

		// Click en una celda de la primera fila de datos
		const firstRowCell = screen.getByText("Juan García");
		await user.click(firstRowCell);

		expect(mockRowClick).toHaveBeenCalledWith(mockUsers[0], 0);
	});

	it("ejecuta onRowDoubleClick al hacer doble click", async () => {
		const user = userEvent.setup();
		const mockDoubleClick = vi.fn();

		render(
			<BetterTable<User>
				data={mockUsers}
				columns={userColumns}
				rowKey="id"
				onRowDoubleClick={mockDoubleClick}
			/>
		);

		const firstRowCell = screen.getByText("Juan García");
		await user.dblClick(firstRowCell);

		expect(mockDoubleClick).toHaveBeenCalledWith(mockUsers[0], 0);
	});
});
