import Link from "next/link";
import { Logotype } from "@/components/global/brand/logo";

export default function AuthLayout({ children }) {
  return (
    <>
      {/* Minimal header for auth pages */}
      <header className=" bg-transparentborder-b bg-white py-4">
        <div className="max-w-[1330px] mx-auto">
          <div className="flex -center ">
            <Link href="/" className="flex items-center">
              <Logotype />
            </Link>
          </div>
        </div>
      </header>
      
      {/* Main content with padding for fixed header */}
      <main className="bg-white ">
        {children}
      </main>
    </>
  );
}