import React, { useState, useMemo, ReactNode } from "react";
import Modal from "./Modal";

export interface Column {
  name: string;
  key: string;
  dataType: "string" | "number" | "boolean" | "Cell";
  cell?: (value: any) => ReactNode;
}

export interface Data {
  [key: string]: any;
}

export interface Action {
  title: string;
  icon: string;
  component: React.ComponentType<{ data: any }>;
}

export interface TableProps {
  data: Data[];
  columns: Column[];
  actions: Action[];
}

function getValueFromPath(obj: any, path: string): any {
  return path
    .split(".")
    .reduce((o, key) => (o && o[key] !== undefined ? o[key] : null), obj);
}

const BetterTable: React.FC<TableProps> = ({ data, columns, actions }) => {
  const [filteredData, setFilteredData] = useState<Data[]>(data);
  const [sortingKey, setSortingKey] = useState<string | null>(null);
  const [sortingOrder, setSortingOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<ReactNode | null>(null);

  const openModal = (action: Action, itemData: Data) => {
    setModalContent(<action.component data={itemData} />);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalContent(null);
  };
  const handleSorting = (key: string) => {
    setSortingOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
    setSortingKey(key);
  };
  const handleFiltering = (column: Column, filterValue: string) => {
    if (filterValue === "Sin especificar" || filterValue === "") {
      setFilteredData(data);
    } else {
      const updatedData = data.filter((item) => {
        const value = getValueFromPath(item, column.key);
        if (value === null || value === undefined) {
          return false;
        }

        if (column.dataType === "boolean") {
          return (filterValue === "Verdadero") === value;
        } else if (column.dataType === "number") {
          return value.toString() === filterValue;
        } else {
          return value
            .toString()
            .toLowerCase()
            .includes(filterValue.toLowerCase());
        }
      });
      setFilteredData(updatedData);
    }
    setCurrentPage(1);
  };

  const renderFilterInput = (column: Column) => {
    if (column.dataType === "boolean") {
      return (
        <select
          onChange={(e) => handleFiltering(column, e.target.value)}
          defaultValue="Sin especificar"
        >
          <option value="Sin especificar">Sin especificar</option>
          <option value="Verdadero">Verdadero</option>
          <option value="Falso">Falso</option>
        </select>
      );
    }

    return (
      <input
        type="text"
        onChange={(e) => handleFiltering(column, e.target.value)}
        placeholder={`Filter ${column.name}`}
      />
    );
  };

  const sortedData = useMemo(() => {
    if (!sortingKey) return filteredData;

    return [...filteredData].sort((a, b) => {
      if (a[sortingKey] < b[sortingKey]) return sortingOrder === "asc" ? -1 : 1;
      if (a[sortingKey] > b[sortingKey]) return sortingOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortingKey, sortingOrder]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedData, currentPage, itemsPerPage]);

  const renderCell = (item: Data, column: Column) => {
    const value = getValueFromPath(item, column.key);
    if (value === null || value === undefined) {
      return ""; // O cualquier otro marcador de valor no disponible, como 'N/A'
    }
    switch (column.dataType) {
      case "boolean":
        return value ? "v" : "x";
      case "Cell":
        return column.cell ? column.cell(value) : null;
      default:
        return value;
    }
  };

  return (
    <div>
      <table>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>
                {column.name}
                <button onClick={() => handleSorting(column.key)}>Sort</button>
                {renderFilterInput(column)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((row, index) => (
            <tr key={index}>
              {columns.map((column) => (
                <td key={`${index}-${column.key}`}>
                  {renderCell(row, column)}
                </td>
              ))}
              {actions.map((action, actionIndex) => (
                <td key={`action-${index}-${actionIndex}`}>
                  <button onClick={() => openModal(action, row)}>
                    {action.icon}
                  </button>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        {modalContent}
      </Modal>

      <div>
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Previous
        </button>
        <span>Page {currentPage}</span>
        <button
          disabled={currentPage * itemsPerPage >= filteredData.length}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default BetterTable;
