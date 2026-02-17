export default function LoginForm() {
  return (
    <form className="flex flex-col gap-3">
      <input placeholder="Email" className="border p-2" />
      <input placeholder="Password" type="password" className="border p-2" />
      <button className="bg-blue-600 text-white p-2">
        Login
      </button>
    </form>
  );
}