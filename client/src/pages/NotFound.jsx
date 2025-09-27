export default function NotFound() {
  return (
    <div className="min-h-dvh grid place-items-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-red-500">404</h1>
        <p className="opacity-70 mb-4">Page not found</p>
        <a
          href="/"
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Quay về trang chủ
        </a>
      </div>
    </div>
  );
}
