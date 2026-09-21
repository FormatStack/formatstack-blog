import Image from "next/image";
import Link from "next/link";

export function BrandMark() {
  return (
    <Link href="/" className="brand-mark" aria-label="FormatStack Journal home">
      <Image src="/formatstack-logo.svg" alt="FormatStack" width={640} height={160} priority />
    </Link>
  );
}

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <div className="site-header__leading">
          <a className="brand-mark" href="https://formatstack.com/" aria-label="FormatStack home">
            <Image src="/formatstack-logo.svg" alt="FormatStack" width={640} height={160} priority />
          </a>
          <nav className="site-nav" aria-label="Primary navigation">
            <a href="https://formatstack.com/how-it-works">How it works</a>
            <a href="https://formatstack.com/how-a-job-runs">Case study</a>
            <a href="https://formatstack.com/pricing">Pricing</a>
            <a href="https://formatstack.com/faq">FAQ</a>
            <a href="https://app.formatstack.com">Sign in</a>
          </nav>
        </div>
        <div className="header-actions">
          <a className="header-cta" href="https://formatstack.com/demo">Request demo</a>
          <a className="header-email" href="mailto:sales@formatstack.com">sales@formatstack.com</a>
          <details className="mobile-menu">
            <summary aria-label="Toggle navigation menu">
              <span aria-hidden="true" />
              <span aria-hidden="true" />
              <span aria-hidden="true" />
            </summary>
            <nav aria-label="Mobile navigation">
              <a href="https://formatstack.com/how-it-works">How it works</a>
              <a href="https://formatstack.com/how-a-job-runs">Case study</a>
              <a href="https://formatstack.com/pricing">Pricing</a>
              <a href="https://formatstack.com/faq">FAQ</a>
              <a href="https://app.formatstack.com">Sign in</a>
              <a className="mobile-menu__cta" href="https://formatstack.com/demo">Request demo</a>
              <a className="mobile-menu__email" href="mailto:sales@formatstack.com">sales@formatstack.com</a>
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <a className="site-footer__brand" href="https://formatstack.com/" aria-label="FormatStack home">
          <Image src="/formatstack-logo.svg" alt="FormatStack" width={640} height={160} />
        </a>
        <nav className="site-footer__links" aria-label="Footer navigation">
          <a href="https://formatstack.com/how-it-works">How it works</a>
          <a href="https://formatstack.com/how-a-job-runs">Case study</a>
          <a href="https://formatstack.com/pricing">Pricing</a>
          <a href="https://formatstack.com/faq">FAQ</a>
          <a href="https://formatstack.com/demo">Request demo</a>
          <a href="https://app.formatstack.com">Sign in</a>
        </nav>
        <div className="site-footer__contact">
          FormatStack · <a href="mailto:sales@formatstack.com">sales@formatstack.com</a>
        </div>
      </div>
    </footer>
  );
}
