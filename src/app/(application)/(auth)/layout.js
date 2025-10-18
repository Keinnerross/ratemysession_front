import Link from "next/link";

export default function AuthLayout({ children }) {
  return (
    <>
      {/* Minimal header for auth pages */}
      <header className=" bg-transparentborder-b bg-amethyst-50 py-4">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex -center ">
            <Link href="/" className="flex items-center">
              <img 
                src="/assets/brand/logo.png" 
                alt="Rate My Session" 
                className="h-10 w-auto"
              />
            </Link>
          </div>
        </div>
      </header>
      
      {/* Main content with padding for fixed header */}
      <main className="bg-amethyst-50 ">
        {children}
      </main>
    </>
  );
}