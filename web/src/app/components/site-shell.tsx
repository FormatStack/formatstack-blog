import Image from "next/image";
import Link from "next/link";

const headerLinkColor =
  "transition-colors duration-200 ease-[ease] hover:text-[hsl(240_8%_13%)]";
const mobileLink =
  "flex min-h-12 items-center border-b border-[hsl(220_13%_91%)] text-[.95rem] font-semibold text-[hsl(215_16%_37%)] hover:text-[hsl(240_8%_13%)]";

export function BrandMark() {
  return (
    <Link
      href="/"
      className="inline-flex shrink-0 items-center"
      aria-label="FormatStack Blog home"
    >
      <Image
        src="/formatstack-logo.svg"
        alt="FormatStack"
        width={640}
        height={160}
        priority
      />
    </Link>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-[hsl(220_13%_91%)] bg-[hsl(240_12%_98%/.8)] backdrop-blur-sm">
      <div className="mx-auto flex h-16 w-full max-w-300 items-center justify-between px-6">
        <div className="flex min-w-0 items-center gap-8">
          <a
            className="inline-flex shrink-0 items-center"
            href="https://formatstack.com/"
            aria-label="FormatStack home"
          >
            <Image
              src="/formatstack-logo.svg"
              alt="FormatStack"
              width={640}
              height={160}
              priority
              className="h-12 w-auto"
            />
          </a>
          <nav
            className="flex items-center gap-6 text-[.875rem] font-normal text-[hsl(215_16%_47%)] max-md:hidden *:transition-colors *:duration-200 *:ease-[ease] *:hover:text-[hsl(240_8%_13%)]"
            aria-label="Primary navigation"
          >
            <a href="https://formatstack.com/how-it-works">How it works</a>
            <a href="https://formatstack.com/how-a-job-runs">Case study</a>
            <a href="https://formatstack.com/pricing">Pricing</a>
            <a href="https://formatstack.com/faq">FAQ</a>
            <a href="https://app.formatstack.com">Sign in</a>
          </nav>
        </div>
        <div className="flex shrink-0 items-center gap-4">
          <a
            className="inline-flex h-9 items-center justify-center rounded-md bg-[hsl(244_76%_59%)] px-4 text-[.875rem] font-semibold text-white transition-colors duration-200 ease-[ease] hover:bg-[hsl(244_76%_54%)] max-md:hidden"
            href="https://formatstack.com/demo"
          >
            Request demo
          </a>
          <a
            className={`font-plex text-[.875rem] text-[hsl(215_16%_47%)] max-lg:hidden ${headerLinkColor}`}
            href="mailto:sales@formatstack.com"
          >
            sales@formatstack.com
          </a>
          <details className="group hidden max-md:block">
            <summary
              className="size-11 cursor-pointer list-none px-2.5 py-3 [&::-webkit-details-marker]:hidden"
              aria-label="Toggle navigation menu"
            >
              <span
                aria-hidden="true"
                className="my-1 block h-0.5 w-6 rounded-full bg-ink transition-[translate,rotate,opacity] duration-200 ease-[ease] group-open:translate-y-1.5 group-open:rotate-45"
              />
              <span
                aria-hidden="true"
                className="my-1 block h-0.5 w-6 rounded-full bg-ink transition-[translate,rotate,opacity] duration-200 ease-[ease] group-open:opacity-0"
              />
              <span
                aria-hidden="true"
                className="my-1 block h-0.5 w-6 rounded-full bg-ink transition-[translate,rotate,opacity] duration-200 ease-[ease] group-open:-translate-y-1.5 group-open:-rotate-45"
              />
            </summary>
            <nav
              className="absolute inset-x-0 top-16 flex flex-col border-b border-[hsl(220_13%_91%)] bg-[hsl(240_12%_98%/.98)] px-6 pt-4 pb-6 shadow-[0_18px_36px_rgb(30_30_36/.1)]"
              aria-label="Mobile navigation"
            >
              <a
                className={mobileLink}
                href="https://formatstack.com/how-it-works"
              >
                How it works
              </a>
              <a
                className={mobileLink}
                href="https://formatstack.com/how-a-job-runs"
              >
                Case study
              </a>
              <a className={mobileLink} href="https://formatstack.com/pricing">
                Pricing
              </a>
              <a className={mobileLink} href="https://formatstack.com/faq">
                FAQ
              </a>
              <a className={mobileLink} href="https://app.formatstack.com">
                Sign in
              </a>
              <a
                className="mt-4 flex min-h-12 items-center justify-center rounded-md bg-[hsl(244_76%_59%)] text-[.95rem] font-semibold text-white hover:text-[hsl(240_8%_13%)]"
                href="https://formatstack.com/demo"
              >
                Request demo
              </a>
              <a
                className="flex min-h-12 items-center justify-center font-plex text-[.78rem] font-normal text-[hsl(215_16%_37%)] hover:text-[hsl(240_8%_13%)]"
                href="mailto:sales@formatstack.com"
              >
                sales@formatstack.com
              </a>
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-[hsl(244_35%_24%)] text-[hsl(240_12%_98%)]">
      <div className="mx-auto flex min-h-29 w-full max-w-300 items-center justify-between gap-6 px-6 py-10 max-md:flex-col max-md:items-start">
        <a
          className="flex shrink-0 items-center"
          href="https://formatstack.com/"
          aria-label="FormatStack home"
        >
          <Image
            src="/formatstack-logo.svg"
            alt="FormatStack"
            width={640}
            height={160}
            className="h-9 w-auto brightness-0 invert"
          />
        </a>
        <nav
          className="flex flex-wrap items-center gap-6 text-[.875rem] text-[hsl(240_12%_98%/.8)] max-md:gap-x-6 max-md:gap-y-4 *:transition-colors *:duration-200 *:ease-[ease] *:hover:text-[hsl(240_12%_98%)]"
          aria-label="Footer navigation"
        >
          <a href="https://formatstack.com/how-it-works">How it works</a>
          <a href="https://formatstack.com/how-a-job-runs">Case study</a>
          <a href="https://formatstack.com/pricing">Pricing</a>
          <a href="https://formatstack.com/faq">FAQ</a>
          <a href="https://formatstack.com/demo">Request demo</a>
          <a href="https://app.formatstack.com">Sign in</a>
        </nav>
        <div className="shrink-0 font-plex text-[.75rem] text-[hsl(240_12%_98%/.6)]">
          FormatStack ·{" "}
          <a
            className="transition-colors duration-200 ease-[ease] hover:text-[hsl(240_12%_98%)]"
            href="mailto:sales@formatstack.com"
          >
            sales@formatstack.com
          </a>
        </div>
      </div>
    </footer>
  );
}
