import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-site-blue items-center justify-center p-12">
        <div className="max-w-md bg-white p-15 rounded">
          <div className="mb-8">
            <Image
              src="/logo.webp"
              alt="Sharq Aljazeera Logo"
              width={220}
              height={220}
              className="rounded-md"
              priority // ensures logo loads instantly
            />
          </div>
          <h3 className="text-heading-3 font-heading-3 text-dark-900 mb-4">
            SHARQ ALJAZEERA TELECOM
          </h3>
          <p className="text-body text-dark-700">Cummunication & Internet</p>
        </div>
      </div>

      {/* Right Side - Auth Forms */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-light-100">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
