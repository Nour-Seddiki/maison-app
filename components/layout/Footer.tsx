import Link from 'next/link'

const footerColumns = [
  {
    title: 'Portfolio',
    links: [
      { label: 'All Residences', href: '/portfolio' },
      { label: 'Private Sales', href: '/private-sales' },
      { label: 'New Developments', href: '/portfolio' },
      { label: 'Penthouses', href: '/portfolio' },
    ],
  },
  {
    title: 'Advisory',
    links: [
      { label: 'Investment Advisory', href: '/advisory' },
      { label: 'Market Insights', href: '/market-insights' },
      { label: 'Wealth Strategy', href: '/advisory' },
    ],
  },
  {
    title: 'Services',
    links: [
      { label: 'Estate Concierge', href: '/concierge' },
      { label: 'Valuation', href: '/advisory' },
      { label: 'Property Management', href: '/advisory' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Maison', href: '/' },
      { label: 'Careers', href: '/' },
      { label: 'Press', href: '/' },
      { label: 'Contact', href: '/' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="bg-charcoal border-t border-border">
      {/* Main Footer */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-16 md:py-24">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="block mb-6">
              <span className="font-heading text-xl text-gold italic">Maison & Co.</span>
            </Link>
            <p className="text-xs text-text-muted font-body leading-relaxed tracking-wider">
              Curating exceptional residences for the world&apos;s most discerning clientele since 1987.
            </p>
          </div>

          {/* Link Columns */}
          {footerColumns.map((column) => (
            <div key={column.title}>
              <h4 className="label-caps text-text-secondary mb-6">{column.title}</h4>
              <ul className="space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-xs text-text-muted hover:text-gold font-body tracking-wider transition-colors duration-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6 text-[0.65rem] font-body uppercase tracking-[0.15em] text-text-muted">
            <Link href="/" className="hover:text-gold transition-colors">Privacy Policy</Link>
            <Link href="/" className="hover:text-gold transition-colors">Terms of Service</Link>
            <Link href="/" className="hover:text-gold transition-colors">Cookie Policy</Link>
            <Link href="/" className="hover:text-gold transition-colors">Accessibility</Link>
          </div>
          <p className="text-[0.6rem] font-body uppercase tracking-[0.15em] text-text-muted">
            © 2024 Maison & Co. London. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
