const { readFileSync } = require('node:fs')
const { join } = require('node:path')
const matter = require('gray-matter')

const topics = [
  {
    id: 'slow-computer',
    title: 'Slow computers',
    description: 'Understand the slowdown before choosing a fix, upgrade or replacement.',
    slugs: [
      'slow-computer-fix-upgrade-replace',
      'computer-slow-startup',
      'slow-computer-or-internet',
      'windows-performance-observations',
      'slow-computer-assessment-notes',
    ]
  },
  {
    id: 'wifi',
    title: 'Wi-Fi and internet',
    description: 'Separate device, coverage and internet-service problems.',
    slugs: [
      'wifi-dropouts-diagnosis',
      'need-mesh-wifi-access-point-router-position',
      'mesh-wifi-placement-backhaul',
      'take-ownership-new-home-wifi',
      'wifi-one-device-or-all',
      'wifi-coverage-or-internet-service',
      'connection-test-results',
      'wifi-dropout-diary',
    ]
  },
  {
    id: 'computer-move',
    title: 'Moving to a new computer',
    description: 'Prepare, move and check the files and everyday tools that matter.',
    slugs: [
      'moving-to-a-new-windows-computer',
      'new-windows-computer-move-checklist',
      'new-computer-handover-checks',
    ]
  },
  {
    id: 'backup',
    title: 'Computer backups',
    description: 'Choose a backup approach and practise restoring a harmless file.',
    slugs: [
      'home-computer-backup',
      'one-onsite-two-offsite-backups',
      'external-drive-or-cloud-backup',
      'test-a-backup-file-restore',
    ]
  },
  {
    id: 'scams',
    title: 'Scams and account security',
    description: 'Find calm first steps, account checks and a useful incident record.',
    slugs: [
      'suspected-scam-first-steps',
      'check-account-access-after-a-scam',
      'record-a-suspected-scam',
    ]
  },
  {
    id: 'malware',
    title: 'Viruses and unwanted pop-ups',
    description: 'Separate browser warnings from device symptoms and understand scan results.',
    slugs: [
      'computer-virus-warning-first-steps',
      'stop-fake-virus-popups',
      'understand-windows-security-scan',
    ]
  },
  {
    id: 'email',
    title: 'Email problems',
    description: 'Narrow down sending, receiving, synchronisation and missing-mail issues.',
    slugs: [
      'email-not-sending-receiving-syncing',
      'find-missing-email',
      'test-email-sending-and-receiving',
    ]
  },
  {
    id: 'phone-tablet',
    title: 'Moving to a phone or tablet',
    description: 'Choose a supported path and keep the old device until checks are complete.',
    slugs: [
      'move-to-new-phone-or-tablet',
      'prepare-phone-tablet-transfer',
      'phone-account-continuity-after-device-move',
      'check-new-phone-before-erasing-old',
    ]
  },
  {
    id: 'printer',
    title: 'Printer troubleshooting',
    description: 'Find a sensible starting point for printing, queues and scanning.',
    slugs: [
      'printer-not-printing-first-checks',
      'check-stuck-print-queue',
      'printer-prints-but-will-not-scan',
    ]
  },
  {
    id: 'new-printer',
    title: 'New printer setup',
    description: 'Prepare your equipment, connect one device and check the result.',
    slugs: [
      'set-up-new-home-printer',
      'prepare-new-printer-setup',
      'test-new-printer-and-scanner',
    ]
  },
  {
    id: 'password',
    title: 'Password safety and control',
    description: 'Build a password system you can use and keep recovery in your control.',
    slugs: [
      'start-using-password-manager',
      'move-passwords-without-losing-access',
      'password-manager-recovery-plan',
    ]
  },
  {
    id: 'office',
    title: 'Home office setup',
    description: 'Make your existing screens, connections and calls work together.',
    slugs: [
      'home-office-technology-setup',
      'check-monitor-dock-and-cables',
      'check-video-call-camera-sound-light',
    ]
  },
]

module.exports = topics.map((topic) => ({
  ...topic,
  articles: topic.slugs.map((slug) => {
    const { data } = matter(readFileSync(join(__dirname, '../guides', `${slug}.njk`), 'utf8'))
    return { path: `/guides/${slug}/`, title: data.title, description: data.description }
  }),
}))
