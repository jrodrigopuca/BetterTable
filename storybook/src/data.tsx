import type { Column, RowAction, GlobalAction } from "better-table";

// ============================================================================
// Shared types
// ============================================================================

export interface Product {
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

export interface Employee {
  [key: string]: unknown;
  id: number;
  name: string;
  email: string;
  department: string;
  salary: number;
  isActive: boolean;
  hireDate: string;
}

// ============================================================================
// Product data
// ============================================================================

export const products: Product[] = [
  { id: 1, name: 'MacBook Pro 14"', price: 1999, stock: 15, category: "Laptops", isAvailable: true, addedDate: "2025-01-15", details: { brand: "Apple", sku: "MBP14-2024" } },
  { id: 2, name: "iPhone 15 Pro", price: 1199, stock: 42, category: "Phones", isAvailable: true, addedDate: "2025-03-22", details: { brand: "Apple", sku: "IP15P-256" } },
  { id: 3, name: "Galaxy S24 Ultra", price: 1299, stock: 28, category: "Phones", isAvailable: true, addedDate: "2025-02-10", details: { brand: "Samsung", sku: "GS24U-512" } },
  { id: 4, name: "Dell XPS 15", price: 1599, stock: 8, category: "Laptops", isAvailable: true, addedDate: "2025-06-01", details: { brand: "Dell", sku: "XPS15-2024" } },
  { id: 5, name: "AirPods Pro 2", price: 249, stock: 120, category: "Audio", isAvailable: true, addedDate: "2024-11-05", details: { brand: "Apple", sku: "APP2-USB" } },
  { id: 6, name: "Sony WH-1000XM5", price: 349, stock: 35, category: "Audio", isAvailable: true, addedDate: "2024-09-18", details: { brand: "Sony", sku: "WH1000XM5" } },
  { id: 7, name: 'iPad Pro 12.9"', price: 1099, stock: 0, category: "Tablets", isAvailable: false, addedDate: "2025-04-30", details: { brand: "Apple", sku: "IPADP129" } },
  { id: 8, name: "Galaxy Tab S9", price: 849, stock: 22, category: "Tablets", isAvailable: true, addedDate: "2025-05-14", details: { brand: "Samsung", sku: "GTS9-256" } },
  { id: 9, name: "Surface Pro 9", price: 1299, stock: 5, category: "Tablets", isAvailable: true, addedDate: "2025-07-20", details: { brand: "Microsoft", sku: "SP9-256" } },
  { id: 10, name: "Pixel 8 Pro", price: 999, stock: 18, category: "Phones", isAvailable: true, addedDate: "2025-08-03", details: { brand: "Google", sku: "PX8P-256" } },
  { id: 11, name: "ThinkPad X1 Carbon", price: 1849, stock: 12, category: "Laptops", isAvailable: true, addedDate: "2025-10-12", details: { brand: "Lenovo", sku: "X1C-G11" } },
  { id: 12, name: "Magic Keyboard", price: 299, stock: 0, category: "Accessories", isAvailable: false, addedDate: "2026-01-08", details: { brand: "Apple", sku: "MK-TOUCH" } },
];

export const productColumns: Column<Product>[] = [
  { id: "name", accessor: "name", header: "Product", sortable: true, filterable: true },
  { id: "brand", accessor: "details.brand", header: "Brand", sortable: true, filterable: true },
  { id: "category", accessor: "category", header: "Category", sortable: true, filterable: true },
  {
    id: "price", accessor: "price", header: "Price", type: "number", sortable: true, filterable: true,
    cell: (value: unknown) => <span style={{ fontWeight: 600 }}>${(value as number).toLocaleString()}</span>,
  },
  {
    id: "stock", accessor: "stock", header: "Stock", type: "number", sortable: true, filterable: true,
    cell: (value: unknown) => {
      const stock = value as number;
      const color = stock === 0 ? "#dc2626" : stock < 10 ? "#f59e0b" : "#16a34a";
      return <span style={{ color, fontWeight: 500 }}>{stock}</span>;
    },
  },
  { id: "isAvailable", accessor: "isAvailable", header: "Available", type: "boolean", filterable: true },
  { id: "addedDate", accessor: "addedDate", header: "Date Added", type: "date", sortable: true, filterable: true },
];

export const productRowActions: RowAction<Product>[] = [
  {
    id: "view", label: "View details", icon: "👁", mode: "modal",
    modalContent: ({ data }: { data: Product }) => (
      <div style={{ lineHeight: 1.8 }}>
        <h3 style={{ marginTop: 0 }}>{data.name}</h3>
        <p><strong>Brand:</strong> {data.details?.brand ?? "N/A"}</p>
        <p><strong>SKU:</strong> {data.details?.sku ?? "N/A"}</p>
        <p><strong>Category:</strong> {data.category}</p>
        <p><strong>Price:</strong> ${data.price.toLocaleString()}</p>
        <p><strong>Stock:</strong> {data.stock} units</p>
      </div>
    ),
  },
  { id: "toggle", label: "Toggle availability", icon: "🔄", mode: "callback", onClick: () => alert("Toggled!") },
  { id: "delete", label: "Delete", icon: "🗑️", mode: "callback", variant: "danger", onClick: () => alert("Deleted!") },
];

export const productGlobalActions: GlobalAction<Product>[] = [
  { id: "add", label: "Add product", icon: "➕", onClick: () => alert("Add clicked") },
  { id: "deleteSelected", label: "Delete selected", icon: "🗑️", variant: "danger", requiresSelection: true, onClick: (rows) => alert(`Delete ${rows.length} items`) },
];

// ============================================================================
// Employee data (for virtualization)
// ============================================================================

const departments = ["Engineering", "Marketing", "Sales", "HR", "Finance", "Operations", "Design", "Support"];
const firstNames = ["Alice", "Bob", "Carlos", "Diana", "Elena", "Frank", "Grace", "Hugo", "Iris", "Jack"];
const lastNames = ["Smith", "García", "Johnson", "López", "Williams", "Chen", "Brown", "Kim", "Jones", "Davis"];

export function generateEmployees(count: number): Employee[] {
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

export const employeeColumns: Column<Employee>[] = [
  { id: "id", accessor: "id", header: "ID", type: "number", sortable: true },
  { id: "name", accessor: "name", header: "Name", sortable: true, filterable: true },
  { id: "email", accessor: "email", header: "Email", sortable: true, filterable: true },
  { id: "department", accessor: "department", header: "Department", sortable: true, filterable: true },
  {
    id: "salary", accessor: "salary", header: "Salary", type: "number", sortable: true, filterable: true,
    cell: (value: unknown) => <span style={{ fontWeight: 600 }}>${(value as number).toLocaleString()}</span>,
  },
  { id: "isActive", accessor: "isActive", header: "Active", type: "boolean", filterable: true },
  { id: "hireDate", accessor: "hireDate", header: "Hire Date", type: "date", sortable: true, filterable: true },
];
