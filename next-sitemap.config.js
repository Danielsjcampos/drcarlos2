/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://sporthealth.com.br',
  generateRobotsTxt: true,
  exclude: ['/login', '/dashboard*'],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
      {
        userAgent: '*',
        disallow: ['/login', '/dashboard'],
      },
    ],
  },
}
