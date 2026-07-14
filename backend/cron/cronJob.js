import cron from 'node-cron'
import { scrapeSchemes } from '../services/scraperService.js'

export function initCronJobs() {
  console.log('Initializing background cron jobs...')

  cron.schedule('0 0 * * *', async () => {
    console.log('[CRON] Executing scheduled scraper service...')
    await scrapeSchemes()
  })
}
