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
  return <header className="site-header"><div className="site-header__inner"><BrandMark /><nav className="site-nav" aria-label="Primary navigation"><a href="https://formatstack.com/how-it-works">How it works</a><a href="https://formatstack.com/how-a-job-runs">Case study</a><a href="https://formatstack.com/pricing">Pricing</a><Link className="is-current" href="/">Journal</Link></nav><div className="header-actions"><a className="header-signin" href="https://app.formatstack.com">Sign in</a><a className="header-cta" href="https://formatstack.com/demo">Request demo</a></div></div></header>;
}

export function SiteFooter() {
  return <footer className="site-footer"><div className="site-footer__inner"><div><BrandMark /><p>Practical ideas for documents that work better.</p></div><div className="site-footer__links"><Link href="/#stories">Stories</Link><a href="https://formatstack.com/how-it-works">How it works</a><a href="https://formatstack.com/demo">Request demo</a><span>© {new Date().getFullYear()} FormatStack</span></div></div></footer>;
}
