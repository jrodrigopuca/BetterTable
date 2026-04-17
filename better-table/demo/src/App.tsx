import { useState } from "react";
import "./App.css";
import { BetterTable } from "better-table";
import type { Column, RowAction, GlobalAction } from "better-table";
import "better-table/styles.css";

type FilterMode = "floating" | "panel" | "both";
type Theme = "light" | "dark";
type DemoMode = "products" | "virtualization";

interface Product {
	[key: string]: unknown;
	id: number;
	name: string;
	price: number;
	stock: number;
	category: string;
	isAvailable: boolean;
	addedDate: string;
	details?: {
		brand?: string;
		sku?: string;
	};
}

interface VirtualItem {
	[key: string]: unknown;
	id: number;
	name: string;
	email: string;
	department: string;
	salary: number;
	isActive: boolean;
	hireDate: string;
}

function generateLargeDataset(count: number): VirtualItem[] {
	const departments = ["Engineering", "Marketing", "Sales", "HR", "Finance", "Operations", "Design", "Support"];
	const firstNames = ["Alice", "Bob", "Carlos", "Diana", "Elena", "Frank", "Grace", "Hugo", "Iris", "Jack"];
	const lastNames = ["Smith", "García", "Johnson", "López", "Williams", "Chen", "Brown", "Kim", "Jones", "Davis"];

	return Array.from({ length: count }, (_, i) => {
		const first = firstNames[i % firstNames.length];
		const last = lastNames[Math.floor(i / firstNames.length) % lastNames.length];
		return {
			id: i + 1,
			name: `${first} ${last}`,
			email: `${first.toLowerCase()}.${last.toLowerCase()}${i}@example.com`,
			department: departments[i % departments.length],
			salary: 40000 + Math.floor(Math.random() * 80000),
			isActive: Math.random() > 0.15,
			hireDate: new Date(2020, Math.floor(Math.random() * 60), Math.floor(Math.random() * 28) + 1).toISOString().split("T")[0],
		};
	});
}

const largeDataset = generateLargeDataset(2000);

const virtualColumns: Column<VirtualItem>[] = [
	{ id: "id", accessor: "id", header: "ID", type: "number", sortable: true },
	{ id: "name", accessor: "name", header: "Name", sortable: true, filterable: true },
	{ id: "email", accessor: "email", header: "Email", sortable: true, filterable: true },
	{ id: "department", accessor: "department", header: "Department", sortable: true, filterable: true },
	{
		id: "salary",
		accessor: "salary",
		header: "Salary",
		type: "number",
		sortable: true,
		filterable: true,
		cell: (value: unknown) => <span style={{ fontWeight: 600 }}>${(value as number).toLocaleString()}</span>,
	},
	{ id: "isActive", accessor: "isActive", header: "Active", type: "boolean", filterable: true },
	{ id: "hireDate", accessor: "hireDate", header: "Hire Date", type: "date", sortable: true, filterable: true },
];

const initialProducts: Product[] = [
	{ id: 1, name: "MacBook Pro 14\"", price: 1999, stock: 15, category: "Laptops", isAvailable: true, addedDate: "2025-01-15", details: { brand: "Apple", sku: "MBP14-2024" } },
	{ id: 2, name: "iPhone 15 Pro", price: 1199, stock: 42, category: "Phones", isAvailable: true, addedDate: "2025-03-22", details: { brand: "Apple", sku: "IP15P-256" } },
	{ id: 3, name: "Galaxy S24 Ultra", price: 1299, stock: 28, category: "Phones", isAvailable: true, addedDate: "2025-02-10", details: { brand: "Samsung", sku: "GS24U-512" } },
	{ id: 4, name: "Dell XPS 15", price: 1599, stock: 8, category: "Laptops", isAvailable: true, addedDate: "2025-06-01", details: { brand: "Dell", sku: "XPS15-2024" } },
	{ id: 5, name: "AirPods Pro 2", price: 249, stock: 120, category: "Audio", isAvailable: true, addedDate: "2024-11-05", details: { brand: "Apple", sku: "APP2-USB" } },
	{ id: 6, name: "Sony WH-1000XM5", price: 349, stock: 35, category: "Audio", isAvailable: true, addedDate: "2024-09-18", details: { brand: "Sony", sku: "WH1000XM5" } },
	{ id: 7, name: "iPad Pro 12.9\"", price: 1099, stock: 0, category: "Tablets", isAvailable: false, addedDate: "2025-04-30", details: { brand: "Apple", sku: "IPADP129" } },
	{ id: 8, name: "Galaxy Tab S9", price: 849, stock: 22, category: "Tablets", isAvailable: true, addedDate: "2025-05-14", details: { brand: "Samsung", sku: "GTS9-256" } },
	{ id: 9, name: "Surface Pro 9", price: 1299, stock: 5, category: "Tablets", isAvailable: true, addedDate: "2025-07-20", details: { brand: "Microsoft", sku: "SP9-256" } },
	{ id: 10, name: "Pixel 8 Pro", price: 999, stock: 18, category: "Phones", isAvailable: true, addedDate: "2025-08-03", details: { brand: "Google", sku: "PX8P-256" } },
	{ id: 11, name: "ThinkPad X1 Carbon", price: 1849, stock: 12, category: "Laptops", isAvailable: true, addedDate: "2025-10-12", details: { brand: "Lenovo", sku: "X1C-G11" } },
	{ id: 12, name: "Magic Keyboard", price: 299, stock: 0, category: "Accessories", isAvailable: false, addedDate: "2026-01-08", details: { brand: "Apple", sku: "MK-TOUCH" } },
];

function App() {
	const [products, setProducts] = useState<Product[]>(initialProducts);
	const [filterMode, setFilterMode] = useState<FilterMode>("floating");
	const [theme, setTheme] = useState<Theme>("light");
	const [demoMode, setDemoMode] = useState<DemoMode>("products");

	const getNextId = () => Math.max(...products.map(p => p.id), 0) + 1;

	const handleDelete = (product: Product) => {
		if (confirm(`¿Eliminar "${product.name}"?`)) {
			setProducts(prev => prev.filter(p => p.id !== product.id));
		}
	};

	const handleDeleteSelected = (selected: Product[]) => {
		if (confirm(`¿Eliminar ${selected.length} productos seleccionados?`)) {
			const selectedIds = new Set(selected.map(p => p.id));
			setProducts(prev => prev.filter(p => !selectedIds.has(p.id)));
		}
	};

	const handleAdd = () => {
		const newProduct: Product = {
			id: getNextId(),
			name: `Nuevo Producto ${getNextId()}`,
			price: 0,
			stock: 0,
			category: "Sin categoría",
			isAvailable: true,
			addedDate: new Date().toISOString().split('T')[0],
			details: { brand: "", sku: "" }
		};
		setProducts(prev => [...prev, newProduct]);
	};

	const handleToggleAvailability = (product: Product) => {
		setProducts(prev => prev.map(p => 
			p.id === product.id ? { ...p, isAvailable: !p.isAvailable } : p
		));
	};

	const handleUpdateStock = (product: Product, newStock: number) => {
		setProducts(prev => prev.map(p => 
			p.id === product.id ? { ...p, stock: newStock, isAvailable: newStock > 0 } : p
		));
	};

	const columns: Column<Product>[] = [
		{
			id: "name",
			accessor: "name",
			header: "Producto",
			sortable: true,
			filterable: true,
		},
		{
			id: "brand",
			accessor: "details.brand",
			header: "Marca",
			sortable: true,
			filterable: true,
		},
		{
			id: "category",
			accessor: "category",
			header: "Categoría",
			sortable: true,
			filterable: true,
		},
		{
			id: "price",
			accessor: "price",
			header: "Precio",
			type: "number",
			sortable: true,
			filterable: true,
			cell: (value: unknown) => (
				<span style={{ fontWeight: 600 }}>
					${(value as number).toLocaleString()}
				</span>
			),
		},
		{
			id: "stock",
			accessor: "stock",
			header: "Stock",
			type: "number",
			sortable: true,
			filterable: true,
			cell: (value: unknown) => {
				const stock = value as number;
				const color = stock === 0 ? "#dc2626" : stock < 10 ? "#f59e0b" : "#16a34a";
				return <span style={{ color, fontWeight: 500 }}>{stock}</span>;
			},
		},
		{
			id: "isAvailable",
			accessor: "isAvailable",
			header: "Disponible",
			type: "boolean",
			filterable: true,
		},
		{
			id: "addedDate",
			accessor: "addedDate",
			header: "Fecha agregado",
			type: "date",
			sortable: true,
			filterable: true,
		},
	];

	const rowActions: RowAction<Product>[] = [
		{
			id: "view",
			label: "Ver detalles",
			icon: "👁",
			mode: "modal",
			modalContent: ({ data }: { data: Product }) => (
				<div style={{ lineHeight: 1.8 }}>
					<h3 style={{ marginTop: 0 }}>{data.name}</h3>
					<p><strong>Marca:</strong> {data.details?.brand ?? "N/A"}</p>
					<p><strong>SKU:</strong> {data.details?.sku ?? "N/A"}</p>
					<p><strong>Categoría:</strong> {data.category}</p>
					<p><strong>Precio:</strong> ${data.price.toLocaleString()}</p>
					<p><strong>Stock:</strong> {data.stock} unidades</p>
					<p><strong>Estado:</strong> {data.isAvailable ? "✅ Disponible" : "❌ No disponible"}</p>
				</div>
			),
		},
		{
			id: "editStock",
			label: "Editar stock",
			icon: "📦",
			mode: "modal",
			modalContent: ({ data, onClose }: { data: Product; onClose: () => void }) => {
				const [stock, setStock] = useState(data.stock);
				return (
					<div>
						<h3 style={{ marginTop: 0 }}>Editar Stock: {data.name}</h3>
						<div style={{ marginBottom: 16 }}>
							<label style={{ display: "block", marginBottom: 8 }}>
								Stock actual: <strong>{data.stock}</strong>
							</label>
							<input
								type="number"
								value={stock}
								onChange={(e) => setStock(Number(e.target.value))}
								min={0}
								style={{ 
									padding: "8px 12px", 
									fontSize: 16, 
									width: "100%",
									boxSizing: "border-box",
									border: "1px solid #ccc",
									borderRadius: 4
								}}
							/>
						</div>
						<div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
							<button 
								onClick={onClose}
								style={{ padding: "8px 16px", cursor: "pointer" }}
							>
								Cancelar
							</button>
							<button 
								onClick={() => {
									handleUpdateStock(data, stock);
									onClose();
								}}
								style={{ 
									padding: "8px 16px", 
									background: "#2563eb", 
									color: "white", 
									border: "none",
									borderRadius: 4,
									cursor: "pointer"
								}}
							>
								Guardar
							</button>
						</div>
					</div>
				);
			},
		},
		{
			id: "toggle",
			label: "Cambiar disponibilidad",
			icon: "🔄",
			mode: "callback",
			onClick: handleToggleAvailability,
		},
		{
			id: "delete",
			label: "Eliminar",
			icon: "🗑️",
			mode: "callback",
			variant: "danger",
			onClick: handleDelete,
		},
	];

	const globalActions: GlobalAction<Product>[] = [
		{
			id: "add",
			label: "Agregar producto",
			icon: "➕",
			onClick: handleAdd,
		},
		{
			id: "export",
			label: "Exportar CSV",
			icon: "📥",
			onClick: (_: Product[], allData: Product[]) => {
				const csv = [
					["ID", "Nombre", "Marca", "Categoría", "Precio", "Stock", "Disponible"].join(","),
					...allData.map(p => [
						p.id,
						`"${p.name}"`,
						p.details?.brand ?? "",
						p.category,
						p.price,
						p.stock,
						p.isAvailable
					].join(","))
				].join("\n");
				
				const blob = new Blob([csv], { type: "text/csv" });
				const url = URL.createObjectURL(blob);
				const a = document.createElement("a");
				a.href = url;
				a.download = "productos.csv";
				a.click();
				URL.revokeObjectURL(url);
			},
		},
		{
			id: "deleteSelected",
			label: "Eliminar seleccionados",
			icon: "🗑️",
			variant: "danger",
			requiresSelection: true,
			onClick: handleDeleteSelected,
		},
	];

	return (
		<div className={`App ${theme === "dark" ? "App-dark" : ""}`} data-theme={theme}>
			<div className="App-header">
				<h1>{demoMode === "products" ? "📦 Inventario de Productos" : "⚡ Virtualization Demo"}</h1>
				<button
					className="theme-toggle"
					onClick={() => setTheme(t => t === "light" ? "dark" : "light")}
					aria-label={`Cambiar a modo ${theme === "light" ? "oscuro" : "claro"}`}
					type="button"
				>
					{theme === "light" ? "🌙" : "☀️"}
				</button>
			</div>

			<div className="demo-controls">
				<label style={{ fontWeight: 500, fontSize: 14 }}>Demo:</label>
				<button
					onClick={() => setDemoMode("products")}
					className={`demo-control-btn ${demoMode === "products" ? "active" : ""}`}
				>
					Products (paginated)
				</button>
				<button
					onClick={() => setDemoMode("virtualization")}
					className={`demo-control-btn ${demoMode === "virtualization" ? "active" : ""}`}
				>
					Virtualization (2k rows)
				</button>
			</div>

			{demoMode === "products" ? (
				<>
					<p style={{ color: theme === "dark" ? "#9ca3af" : "#666", marginBottom: 12 }}>
						{products.length} productos • {products.filter(p => p.isAvailable).length} disponibles
					</p>
					<div className="demo-controls">
						<label style={{ fontWeight: 500, fontSize: 14 }}>Filter mode:</label>
						{(["floating", "panel", "both"] as FilterMode[]).map((mode) => (
							<button
								key={mode}
								onClick={() => setFilterMode(mode)}
								className={`demo-control-btn ${filterMode === mode ? "active" : ""}`}
							>
								{mode}
							</button>
						))}
					</div>
					<BetterTable<Product>
						data={products}
						columns={columns}
						rowKey="id"
						locale="es"
						filterMode={filterMode}
						rowActions={rowActions}
						globalActions={globalActions}
						pagination={{
							pageSize: 5,
							showSizeChanger: true,
							pageSizeOptions: [5, 10, 20],
						}}
						expandable={{
							render: (row) => (
								<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, padding: "8px 0" }}>
									<div><strong>SKU:</strong> {row.details?.sku ?? "N/A"}</div>
									<div><strong>Marca:</strong> {row.details?.brand ?? "N/A"}</div>
									<div><strong>Stock:</strong> {row.stock} unidades</div>
									<div><strong>Agregado:</strong> {row.addedDate}</div>
								</div>
							),
						}}
						searchable
						searchColumns={["name", "details.brand", "category"]}
						selectionMode="multiple"
						multiSort
						columnVisibility
						striped
						hoverable
						bordered
						resizable
						size="medium"
						ariaLabel="Tabla de inventario de productos"
					/>
				</>
			) : (
				<>
					<p style={{ color: theme === "dark" ? "#9ca3af" : "#666", marginBottom: 12 }}>
						{largeDataset.length.toLocaleString()} employees • No pagination — virtualized rendering
					</p>
					<BetterTable<VirtualItem>
						data={largeDataset}
						columns={virtualColumns}
						rowKey="id"
						locale="en"
						pagination={false}
						searchable
						searchColumns={["name", "email", "department"]}
						filterMode="floating"
						selectionMode="multiple"
						multiSort
						columnVisibility
						striped
						hoverable
						bordered
						resizable
						size="medium"
						ariaLabel="Virtualized employee table with 2000 rows"
					/>
				</>
			)}
		</div>
	);
}

export default App;
