// Git epoch timestamps are timezone-independent; sitemap dates use UTC consistently.
module.exports = function gitCalendarDate(epochSeconds) {
  const value = String(epochSeconds).trim()
  if (!/^\d+$/.test(value)) throw new Error('Invalid Git timestamp')
  const date = new Date(Number(value) * 1000)
  if (!Number.isFinite(date.getTime())) throw new Error('Invalid Git timestamp')
  return date.toISOString().slice(0, 10)
}
