export default function ContactForm() {
  return (
    <form className="flex flex-col gap-3 max-w-md">
      <input placeholder="Name" className="border p-2" />
      <input placeholder="Email" className="border p-2" />
      <input placeholder="Phone" className="border p-2" />
      <textarea placeholder="Message" className="border p-2" />
      <button className="bg-blue-600 text-white p-2">
        Submit
      </button>
    </form>
  );
}