// Pings Google directly with our sitemap
export async function pingGoogleSitemap() {
  // Replace with the actual domain if NEXT_PUBLIC_SITE_URL is not set
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sporthealth.sjc.br/'
  const sitemapUrl = `${baseUrl}/sitemap.xml`
  
  try {
    const res = await fetch(`https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`)
    if (res.ok) {
      console.log(`[Google Ping] Successfully pinged Google with sitemap: ${sitemapUrl}`)
      return true
    } else {
      console.error(`[Google Ping] Failed to ping Google. Status: ${res.status}`)
      return false
    }
  } catch (err) {
    console.error(`[Google Ping] Error pinging Google:`, err)
    return false
  }
}
