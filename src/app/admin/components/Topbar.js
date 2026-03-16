export default function Topbar() {
  return (
    <div className="w-full h-16 bg-white border-b flex items-center justify-between px-6">
      <h1 className="text-lg font-semibold text-gray-800">Admin Dashboard</h1>

      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-500">Welcome Admin</span>

        <div className="w-9 h-9 rounded-full bg-brandColor text-white flex items-center justify-center">
          A
        </div>
      </div>
    </div>
  );
}
