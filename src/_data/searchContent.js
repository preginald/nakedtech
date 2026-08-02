const { services } = require('./serviceCatalogue.js')

const serviceSearchTerms = {
  wifi_dropouts: 'internet keeps dropping wifi disconnects unreliable internet NBN router weak signal dead spots',
  slow_computer: 'computer running slowly sluggish freezing takes forever Windows 10 fix upgrade replace new laptop',
  scam_security: 'hacked scammed suspicious popup remote access account compromised stolen password security concern',
  new_computer_setup: 'new laptop new PC Windows 11 setup transfer files move data old computer replacement',
  printer_help: 'printer will not connect printer offline will not print will not scan existing printer troubleshooting',
  email_help: 'email not working will not send receive or sync mail Outlook account troubleshooting',
  new_printer_setup: 'new printer install connect unbox wireless printer setup computer phone tablet',
  password_safety_control: 'forgotten passwords reused passwords written down password manager safer login recovery plan',
  'full-strip': 'mesh wifi whole home wireless coverage weak signal dead zones internet rooms network installation',
  'power-pose': 'home office setup monitor mounting cables dock webcam camera lighting video calls workspace',
  quickie: 'everyday technology help device app setup troubleshooting something else home tech support',
}

const generalEntries = [
  {
    path: '/',
    title: 'Home Technology Help Ivanhoe & Eaglemont',
    description: 'Straightforward in-home help with Wi-Fi, computers, printers, email, scams and everyday technology.',
    kind: 'Overview',
    searchTerms: 'home technology support Ivanhoe Eaglemont service area hours contact Peter Reginald',
  },
  {
    path: '/services/',
    title: 'Services & Pricing Ivanhoe & Eaglemont',
    description: 'Compare fixed-price home technology assessments, setup visits and larger projects.',
    kind: 'Overview',
    searchTerms: 'services pricing cost fees fixed price hardware at cost call-out booking',
  },
  {
    path: '/contact/',
    title: 'Contact Naked Tech',
    description: 'Call or send an enquiry about in-home technology help in Ivanhoe and Eaglemont.',
    kind: 'Contact',
    searchTerms: 'phone number email enquiry book visit service area Ivanhoe Eaglemont opening hours',
  },
  {
    path: '/toolkit/',
    title: 'Technology Toolkit & Selection Guide',
    description: 'How Naked Tech selects supported home Wi-Fi, password, computer, printer and privacy tools.',
    kind: 'Guide',
    searchTerms: 'recommended equipment supported hardware software selection privacy tools buying advice',
  },
  {
    path: '/legal/',
    title: 'House Rules',
    description: 'Practical safety, respect, access and data-handling rules for in-home visits.',
    kind: 'Service information',
    searchTerms: 'home visit safety access pets children respectful behaviour credentials data handling',
  },
  {
    path: '/service-terms/',
    title: 'Customer Service Terms',
    description: 'Service scope, pricing, cancellations, customer responsibilities and consumer guarantees.',
    kind: 'Legal',
    searchTerms: 'appointment cancellation payment quote scope warranty consumer guarantee responsibility',
  },
  {
    path: '/terms/',
    title: 'Website Terms of Use',
    description: 'Terms governing access to and use of the Naked Tech website.',
    kind: 'Legal',
    searchTerms: 'website terms links availability copyright Australian consumer law',
  },
  {
    path: '/privacy/',
    title: 'Privacy Policy',
    description: 'How Naked Tech collects, uses, stores and discloses personal information.',
    kind: 'Legal',
    searchTerms: 'privacy personal information contact form analytics advertising cookies data access correction complaint',
  },
]

const serviceEntries = services.map((service) => ({
  path: service.path,
  title: service.name,
  description: service.description,
  kind: 'Service',
  price: service.pricing.displayText,
  serviceName: service.name,
  searchTerms: [
    service.serviceType,
    service.presentation.navTitle,
    service.presentation.navDescription,
    serviceSearchTerms[service.serviceKey],
  ].filter(Boolean).join(' '),
}))

const entries = [...serviceEntries, ...generalEntries]

module.exports = {
  entries,
  byPath: Object.fromEntries(entries.map((entry) => [entry.path, entry])),
}
