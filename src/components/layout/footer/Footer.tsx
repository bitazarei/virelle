import Link from "next/link";

export const Footer = () => {
  const linkStyles = "text-sm transition duration-150 ease hover:text-white";
  const liStyles = "text-color-secondary my-1.5";

  return (
    <footer className="px-6 py-24 border-t border-solid pointer-events-auto bg-background-secondary border-[#242424]">
      <nav className="flex flex-wrap justify-around gap-5 mx-auto max-w-screen-2xl">
        <div className="w-full max-w-xs">
          <h2 className="my-3 text-sm font-medium">Products</h2>
          <ul className="grid grid-cols-2">
            <li className={liStyles}>
              <Link href="/dresses" className={linkStyles}>
                Dresses
              </Link>
            </li>
            <li className={liStyles}>
              <Link href="/tops" className={linkStyles}>
                Tops
              </Link>
            </li>
            <li className={liStyles}>
              <Link href="/bags" className={linkStyles}>
                Bags
              </Link>
            </li>
            <li className={liStyles}>
              <Link href="/shoes" className={linkStyles}>
                Shoes
              </Link>
            </li>
            <li className={liStyles}>
              <Link href="/skirts" className={linkStyles}>
                Skirts
              </Link>
            </li>
          </ul>
        </div>
        <div className="w-full max-w-xs">
          <h2 className="my-3 text-sm font-medium">Assistance</h2>
          <ul className="grid grid-cols-2">
            <li className={liStyles}>
              <Link href="#" className={linkStyles}>
                Size guide
              </Link>
            </li>
            <li className={liStyles}>
              <Link href="#" className={linkStyles}>
                Delivery
              </Link>
            </li>
            <li className={liStyles}>
              <Link href="#" className={linkStyles}>
                Returns and refunds
              </Link>
            </li>
          </ul>
        </div>
        <div className="w-full max-w-xs">
          <h2 className="my-3 text-sm font-medium">About Bita</h2>
          <ul className="grid grid-cols-2">
            <li className={liStyles}>
              <Link
                href="https://www.linkedin.com/in/bita-zarei-676168249"
                target="_blank"
                className={linkStyles}
              >
                LinkedIn
              </Link>
            </li>
            <li className={liStyles}>
              <Link
                href="https://github.com/bitazarei"
                target="_blank"
                className={linkStyles}
              >
                GitHub
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </footer>
  );
};
