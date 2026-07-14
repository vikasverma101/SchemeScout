const cron = require('node-cron')
const { scrapeSchemes } = require('../services/scraperService')

function initCronJobs() {
  // eslint-disable-next-line no-console
  console.log('Initializing background cron jobs...')

  // Run scraper every 24 hours (at midnight)
  // '0 0 * * *' -> every day at 12:00 AM
  cron.schedule('0 0 * * *', async () => {
    // eslint-disable-next-line no-console
    console.log('[CRON] Executing scheduled scraper service...')
    await scrapeSchemes()
  })
}

module.exports = { initCronJobs }
