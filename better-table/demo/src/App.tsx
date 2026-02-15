import { useState } from "react";
import "./App.css";
import { BetterTable } from "better-table";
import type { Column, RowAction, GlobalAction } from "better-table";
import "better-table/styles.css";

interface Product {
	[key: string]: unknown;
	id: number;
	name: string;
	price: number;
	stock: number;
	category: string;
	isAvailable: boolean;
	details?: {
		brand?: string;
		sku?: string;
	};
}

const initialProducts: Product[] = [
	{ id: 1, name: "MacBook Pro 14\"", price: 1999, stock: 15, category: "Laptops", isAvailable: true, details: { brand: "Apple", sku: "MBP14-2024" } },
	{ id: 2, name: "iPhone 15 Pro", price: 1199, stock: 42, category: "Phones", isAvailable: true, details: { brand: "Apple", sku: "IP15P-256" } },
	{ id: 3, name: "Galaxy S24 Ultra", price: 1299, stock: 28, category: "Phones", isAvailable: true, details: { brand: "Samsung", sku: "GS24U-512" } },
	{ id: 4, name: "Dell XPS 15", price: 1599, stock: 8, category: "Laptops", isAvailable: true, details: { brand: "Dell", sku: "XPS15-2024" } },
	{ id: 5, name: "AirPods Pro 2", price: 249, stock: 120, category: "Audio", isAvailable: true, details: { brand: "Apple", sku: "APP2-USB" } },
	{ id: 6, name: "Sony WH-1000XM5", price: 349, stock: 35, category: "Audio", isAvailable: true, details: { brand: "Sony", sku: "WH1000XM5" } },
	{ id: 7, name: "iPad Pro 12.9\"", price: 1099, stock: 0, category: "Tablets", isAvailable: false, details: { brand: "Apple", sku: "IPADP129" } },
	{ id: 8, name: "Galaxy Tab S9", price: 849, stock: 22, category: "Tablets", isAvailable: true, details: { brand: "Samsung", sku: "GTS9-256" } },
	{ id: 9, name: "Surface Pro 9", price: 1299, stock: 5, category: "Tablets", isAvailable: true, details: { brand: "Microsoft", sku: "SP9-256" } },
	{ id: 10, name: "Pixel 8 Pro", price: 999, stock: 18, category: "Phones", isAvailable: true, details: { brand: "Google", sku: "PX8P-256" } },
	{ id: 11, name: "ThinkPad X1 Carbon", price: 1849, stock: 12, category: "Laptops", isAvailable: true, details: { brand: "Lenovo", sku: "X1C-G11" } },
	{ id: 12, name: "Magic Keyboard", price: 299, stock: 0, category: "Accessories", isAvailable: false, details: { brand: "Apple", sku: "MK-TOUCH" } },
];

function App() {
	const [products, setProducts] = useState<Product[]>(initialProducts);

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
		<div className="App">
			<h1>📦 Inventario de Productos</h1>
			<p style={{ color: "#666", marginBottom: 24 }}>
				{products.length} productos • {products.filter(p => p.isAvailable).length} disponibles
			</p>
			<BetterTable<Product>
				data={products}
				columns={columns}
				rowKey="id"
				rowActions={rowActions}
				globalActions={globalActions}
				pagination={{
					pageSize: 5,
					showSizeChanger: true,
					pageSizeOptions: [5, 10, 20],
				}}
				searchable
				searchColumns={["name", "details.brand", "category"]}
				selectionMode="multiple"
				striped
				hoverable
				bordered
				size="medium"
				ariaLabel="Tabla de inventario de productos"
			/>
		</div>
	);
}

export default App;
