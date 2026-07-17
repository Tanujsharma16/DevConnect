function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-600">
            DevConnect
          </h1>

          <h2 className="text-2xl font-semibold mt-6">
            {title}
          </h2>

          <p className="text-gray-500 mt-2">
            {subtitle}
          </p>
        </div>

        {children}
      </div>
    </div>
  );
}

export default AuthLayout;