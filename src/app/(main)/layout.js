import { Header } from "@/components/layout/header/header";
import { Footer } from "@/components/layout/footer/footer";

export default function MainLayout({ children }) {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        {children}
      </main>
      <Footer />
    </>
  );
}