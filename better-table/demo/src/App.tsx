import "./App.css";
import { BetterTable } from "better-table";
import type { Column, RowAction, GlobalAction } from "better-table";
import "better-table/styles.css";

interface User {
	[key: string]: unknown;
	id: number;
	name: string;
	age?: number;
	isActive?: boolean;
	image?: string;
	attributes?: {
		personal?: {
			rol?: string;
		};
	};
}

function App() {
	const columns: Column<User>[] = [
		{
			id: "name",
			accessor: "name",
			header: "Nombre",
			sortable: true,
			filterable: true,
		},
		{
			id: "age",
			accessor: "age",
			header: "Edad",
			type: "number",
			sortable: true,
			filterable: true,
		},
		{
			id: "rol",
			accessor: "attributes.personal.rol",
			header: "Rol",
			sortable: true,
			filterable: true,
		},
		{
			id: "isActive",
			accessor: "isActive",
			header: "Activo",
			type: "boolean",
			filterable: true,
		},
		{
			id: "image",
			accessor: "image",
			header: "Image",
			type: "custom",
			cell: (value: unknown) => <b>{String(value)}</b>,
			sortable: false,
			filterable: false,
		},
	];

	const data: User[] = [
		{
			id: 1,
			name: "Juan",
			age: 28,
			isActive: true,
			image: "a",
			attributes: { personal: { rol: "admin" } },
		},
		{ id: 2, name: "Juan B", age: 35, isActive: false, image: "a" },
		{ id: 3, name: "Juan C", age: 34, image: "a" },
		{ id: 4, name: "Juan D", isActive: false },
		{ id: 5, name: "Juan E", age: 28, isActive: true, image: "a" },
		{ id: 6, name: "Juan F", age: 35, isActive: false, image: "a" },
		{ id: 7, name: "Juan G", age: 34, isActive: false, image: "a" },
		{ id: 8, name: "Juan H", age: 33, isActive: false, image: "a" },
		{ id: 9, name: "Juan I", age: 28, isActive: true, image: "a" },
		{
			id: 10,
			name: "Juan J",
			age: 35,
			isActive: false,
			image: "a",
			attributes: { personal: { rol: "dev" } },
		},
		{ id: 11, name: "Juan K", age: 34, isActive: false, image: "a" },
		{ id: 12, name: "Juan L", age: 33, isActive: false, image: "a" },
	];

	const rowActions: RowAction<User>[] = [
		{
			id: "add",
			label: "Agregar",
			icon: "+",
			mode: "modal",
			modalContent: ({ data }: { data: User }) => (
				<div>
					<h3>Hola {data.name}</h3>
					<p>Esta es una vista modal del usuario.</p>
				</div>
			),
		},
		{
			id: "view",
			label: "Ver",
			icon: "👁",
			mode: "modal",
			modalContent: ({ data }: { data: User }) => (
				<div>
					<p>
						<strong>Nombre:</strong> {data.name}
					</p>
					<p>
						<strong>Edad:</strong> {data.age ?? "N/A"}
					</p>
					<p>
						<strong>Rol:</strong> {data.attributes?.personal?.rol ?? "N/A"}
					</p>
					<p>
						<strong>Activo:</strong> {data.isActive ? "Sí" : "No"}
					</p>
				</div>
			),
		},
		{
			id: "delete",
			label: "Eliminar",
			icon: "🗑️",
			mode: "callback",
			variant: "danger",
			onClick: (user: User) => {
				console.log("Eliminar usuario:", user.name);
				alert(`Eliminar: ${user.name}`);
			},
		},
	];

	const globalActions: GlobalAction<User>[] = [
		{
			id: "export",
			label: "Exportar",
			icon: "📥",
			onClick: (_: User[], allData: User[]) => {
				console.log("Exportar datos:", allData);
				alert(`Exportar ${allData.length} registros`);
			},
		},
		{
			id: "deleteSelected",
			label: "Eliminar seleccionados",
			icon: "🗑️",
			variant: "danger",
			requiresSelection: true,
			onClick: (selected: User[]) => {
				console.log("Eliminar seleccionados:", selected);
				alert(`Eliminar ${selected.length} registros seleccionados`);
			},
		},
	];

	return (
		<div className="App">
			<h1>BetterTable v2 Demo</h1>
			<BetterTable<User>
				data={data}
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
				searchColumns={["name", "rol"]}
				selectionMode="multiple"
				onSelectionChange={(selected) => console.log("Selected:", selected)}
				striped
				hoverable
				bordered
				size="medium"
				onRowClick={(user) => console.log("Clicked:", user.name)}
				ariaLabel="Tabla de usuarios"
			/>
		</div>
	);
}

export default App;
