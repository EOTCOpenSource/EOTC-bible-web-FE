import { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const nextConfig: NextConfig = {
  webpack: (config: any) => {
    config.watchOptions = {
      ...config.watchOptions,
      poll: 1000,
      aggregateTimeout: 300,
    }
    return config
  },
}

const withNextIntl = createNextIntlPlugin()
export default withNextIntl(nextConfig)
