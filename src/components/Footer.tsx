export default function Footer() {
  const footerLinks = {
    contact: {
      title: "Contact",
      links: [
        { label: "+964 771 414 1212", href: "tel:+9647714141212" },
        { label: "+964 780 804 9999", href: "tel:+6947808049999" },
        {
          label: "info@sharqaljazeera.com",
          href: "mailto:info@sharqaljazeera.com",
        },
      ],
    },
    explore: {
      title: "Explore",
      links: [
        { label: "Home", href: "#" },
        { label: "News", href: "#" },
        { label: "Products", href: "#" },
        { label: "Offers", href: "#" },
        { label: "Shop", href: "#" },
      ],
    },
    company: {
      title: "Company",
      links: [
        { label: "About", href: "#" },
        { label: "Contact", href: "#" },
        { label: "FAQ", href: "#" },
      ],
    },
  };

  const socialLinks = [
    {
      name: "Instagram",
      href: "#",
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path
            d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"
            fill="none"
            stroke="#333"
            strokeWidth="1.5"
          />
          <circle cx="17.5" cy="6.5" r="1" fill="#333" />
        </svg>
      ),
    },
    {
      name: "Facebook",
      href: "#",
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
      ),
    },
    {
      name: "Twitter",
      href: "#",
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
        </svg>
      ),
    },
  ];

  return (
    <footer className="bg-site-blue text-light-100">
      {/* Links section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {/* Contact */}
          <div>
            <h3 className="text-light-100 font-medium text-[16px] uppercase tracking-wide mb-4">
              {footerLinks.contact.title}
            </h3>
            <ul className="space-y-2">
              {footerLinks.contact.links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-white text-[14px] hover:text-light-100 transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Explore */}
          <div>
            <h3 className="text-light-100 font-medium text-[16px] uppercase tracking-wide mb-4">
              {footerLinks.explore.title}
            </h3>
            <ul className="space-y-2">
              {footerLinks.explore.links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-white text-[14px] hover:text-light-100 transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-light-100 font-medium text-[16px] uppercase tracking-wide mb-4">
              {footerLinks.company.title}
            </h3>
            <ul className="space-y-2">
              {footerLinks.company.links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-white text-[14px] hover:text-light-100 transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-light-100 font-medium text-[16px] uppercase tracking-wide mb-4">
              Newsletter
            </h3>
            <p className="text-white text-[14px] mb-4">
              Get the latest news and tips in your inbox
            </p>
            <form className="flex flex-col gap-2">
              <input
                type="email"
                placeholder="Your email address"
                className="bg-dark-700 border border-dark-500 text-light-100 px-4 py-2 rounded text-[14px] placeholder:text-dark-500 focus:outline-none focus:border-light-100"
              />
              <button
                type="submit"
                className="bg-light-100 text-dark-blue px-4 py-2 rounded hover:bg-light-200 transition-colors text-[14px] font-medium"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom section */}
      <div className="border-t border-dark-700">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white text-[13px]">
              © {new Date().getFullYear()} Sharq Aljazeera. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="text-light-100 hover:text-light-300 transition-colors"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
