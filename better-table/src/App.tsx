import "./App.css";
import { BetterTable } from "./components/BetterTable";
import { Column, Data, Action } from "./components/BetterTable/BetterTable";

function App() {
  const columns: Column[] = [
    { name: "Nombre", key: "name", dataType: "string" },
    { name: "Edad", key: "age", dataType: "number" },
    { name: "Rol", key: "attributes.personal.rol", dataType: "string" },
    { name: "Activo", key: "isActive", dataType: "boolean" },
    {
      name: "Image",
      key: "image",
      dataType: "Cell",
      cell: (value) => <b>{value}</b>,
    },
    // Añadir más configuraciones de columnas según sea necesario
  ];

  const data: Data[] = [
    {
      name: "Juan",
      age: 28,
      isActive: true,
      image: "a",
      attributes: { personal: { rol: "admin" } },
    },
    { name: "Juan B", age: 35, isActive: false, image: "a" },
    { name: "Juan C", age: 34, image: "a" },
    { name: "Juan D", isActive: false },
    { name: "Juan E", age: 28, isActive: true, image: "a" },
    { name: "Juan F", age: 35, isActive: false, image: "a" },
    { name: "Juan G", age: 34, isActive: false, image: "a" },
    { name: "Juan H", age: 33, isActive: false, image: "a" },
    { name: "Juan I", age: 28, isActive: true, image: "a" },
    {
      name: "Juan J",
      age: 35,
      isActive: false,
      image: "a",
      attributes: { personal: { rol: "dev" } },
    },
    { name: "Juan K", age: 34, isActive: false, image: "a" },
    { name: "Juan L", age: 33, isActive: false, image: "a" },
    // Añadir más datos según sea necesario
  ];

  // En tu componente principal o aplicación:

  const actions: Action[] = [
    {
      title: "Agregar",
      icon: "+",
      component: ({ data }) => <b>Hola {data.name}</b>,
    },
    {
      title: "Ver",
      icon: "o",
      component: ({ data }) => (
        <p>
          Nombre{data.name}, Edad: {data.age}
        </p>
      ),
    },
  ];

  return (
    <div className="App">
      <>Hola</>
      <BetterTable data={data} columns={columns} actions={actions} />
    </div>
  );
}

export default App;
