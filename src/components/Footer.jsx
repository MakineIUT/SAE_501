
function Footer() {
  return (
    <footer className=" dark:bg-[#33005A] ">
        <div className=" w-full max-w-screen-xl mx-auto p-4 md:py-8">
            <div className=" sm:flex sm:items-center sm:justify-between">
                <a href="#" className="flex  no-underline items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse">
                    <img src="/Logo.png" className="h-7" alt="logo tritech" />
                    <span className="text-neutral-950 dark:text-neutral-50 text-heading  font-semibold self-center text-2xl whitespace-nowrap">Tritech</span>
                </a>
                <ul className="flex flex-wrap items-center mb-6 text-sm font-medium    sm:mb-0">
                    <li>
                        <a href="#" className="text-neutral-950 dark:text-neutral-50 hover:underline no-underline font-semibold me-4 md:me-6">À propos</a>
                    </li>
                    <li>
                        <a href="#" className=" text-neutral-950 dark:text-neutral-50 hover:underline no-underline font-semibold me-4 md:me-6">Mention légale</a>
                    </li>
                    <li>
                        <a href="#" className=" text-neutral-950 dark:text-neutral-50 hover:underline no-underline font-semibold">Contact</a>
                    </li>
                </ul>
            </div>
            <hr className="my-6 border-default dark:border-neutral-50 sm:mx-auto lg:my-8" />
            <span className=" block text-sm  dark:text-white sm:text-center">© 2025 <a href="#/" className="text-[#9F00D7] no-underline hover:underline">Tritech</a> Tout droit reservé</span>
        </div>
    </footer>
  );
}

export default Footer;