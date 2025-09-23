import { Logotype } from "@/components/global/brand/logo";

const { default: Navigation } = require("./components/navigation");

export function Header() {
    return (
        <header>
            <div className="max-w-[1280px] mx-auto flex justify-between items-center">
                <section className="flex gap-16 items-center">
                    <Logotype />
                    <Navigation />
                </section>

                <section className="flex items-center gap-8">
                    <a>Log in</a>
                    <a className="px-4 py-2 bg-amethyst-500 text-white rounded-lg">Sign up</a>
                </section>

            </div>
        </header>
    );
}
