import React from "react";
import { Link } from "react-router-dom";
import logotritech from "../assets/logotritech.jpg";


function Footer() {
  return (
    <footer class="  dark:bg-[#33005A] ">
        <div class="  w-full max-w-screen-xl mx-auto p-4 md:py-8">
            <div class=" sm:flex sm:items-center sm:justify-between">
                <a href="#" class="flex  no-underline items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse">
                    <img src="/Logo.png" class="h-7" alt="logo tritech" />
                    <span class="text-neutral-950 dark:text-neutral-50 text-heading  font-semibold self-center text-2xl whitespace-nowrap">Tritech</span>
                </a>
                <ul class="flex flex-wrap items-center mb-6 text-sm font-medium    sm:mb-0">
                    <li>
                        <a href="#" class="text-neutral-950 dark:text-neutral-50 hover:underline no-underline font-semibold me-4 md:me-6">À propos</a>
                    </li>
                    <li>
                        <a href="#" class=" text-neutral-950 dark:text-neutral-50 hover:underline no-underline font-semibold me-4 md:me-6">Mention légale</a>
                    </li>
                    <li>
                        <a href="#" class=" text-neutral-950 dark:text-neutral-50 hover:underline no-underline font-semibold">Contact</a>
                    </li>
                </ul>
            </div>
            <hr class="my-6 border-default dark:border-neutral-50 sm:mx-auto lg:my-8" />
            <span class=" block text-sm  dark:text-white sm:text-center">© 2025 <a href="#/" class="text-[#9F00D7] no-underline hover:underline">Tritech</a> Tout droit reservé</span>
        </div>
    </footer>
  );
}

export default Footer;