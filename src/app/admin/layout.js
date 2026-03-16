import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";

export default function AdminLayout({ children }) {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex flex-col flex-1">
        <Topbar />

        <main className="p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
