import { Logotype } from "@/components/global/brand/logo";

export default function AuthLayout({ children }) {
  return (
    <>
      {/* Minimal header for auth pages */}
      <header className=" bg-transparentborder-b bg-white py-4 px-6 lg:px-0">
        <div className="max-w-[1330px] mx-auto">
          <div className="flex -center ">
            <div className="flex items-center">
              <Logotype />
            </div>
          </div>
        </div>
      </header>
      
      {/* Main content with padding for fixed header */}
      <main className="bg-white px-8 lg:px-0">
        {children}
      </main>
    </>
  );
}