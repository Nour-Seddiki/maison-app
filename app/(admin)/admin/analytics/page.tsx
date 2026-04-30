'use client'

import { motion } from 'framer-motion'

const metrics = [
  { label: 'Total Page Views', value: '45,892', change: '+12.3%', positive: true },
  { label: 'Unique Visitors', value: '12,456', change: '+8.7%', positive: true },
  { label: 'Avg. Session Duration', value: '4m 23s', change: '+2.1%', positive: true },
  { label: 'Bounce Rate', value: '32.4%', change: '-5.2%', positive: true },
  { label: 'Inquiry Conversion', value: '3.8%', change: '+0.4%', positive: true },
  { label: 'Total Inquiries', value: '247', change: '+15%', positive: true },
]

const topProperties = [
  { title: 'The Stanhope Residence', views: 1240, inquiries: 8, conversion: '0.6%' },
  { title: 'One Southbank Tower', views: 890, inquiries: 5, conversion: '0.5%' },
  { title: 'Belgrave Square', views: 756, inquiries: 4, conversion: '0.5%' },
  { title: 'Portland Place Penthouse', views: 623, inquiries: 3, conversion: '0.4%' },
]

const topSearches = [
  { term: 'Mayfair Penthouse', count: 342 },
  { term: 'Chelsea Townhouse', count: 289 },
  { term: 'Knightsbridge Apartment', count: 234 },
  { term: 'Belgravia Victorian', count: 198 },
  { term: 'Kensington Estate', count: 167 },
]

export default function AdminAnalyticsPage() {
  return (
    <div className="min-h-screen pt-28 pb-24 px-6 md:px-12">
      <div className="max-w-[1400px] mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <p className="label-caps text-gold mb-2">Administration</p>
          <h1 className="font-heading text-4xl italic text-text-primary">Platform Analytics</h1>
        </motion.div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {metrics.map((metric, i) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-surface border border-border p-6"
            >
              <p className="label-caps text-text-muted mb-4">{metric.label}</p>
              <p className="font-heading text-3xl text-text-primary">{metric.value}</p>
              <p className={`text-xs font-body mt-2 ${metric.positive ? 'text-success' : 'text-error'}`}>{metric.change}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Top Properties */}
          <div className="bg-surface border border-border">
            <div className="px-6 py-4 border-b border-border">
              <h3 className="font-heading text-xl text-text-primary">Top Properties</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="label-caps text-text-muted text-left px-6 py-3">Property</th>
                    <th className="label-caps text-text-muted text-left px-6 py-3">Views</th>
                    <th className="label-caps text-text-muted text-left px-6 py-3">Inquiries</th>
                    <th className="label-caps text-text-muted text-left px-6 py-3">Conv.</th>
                  </tr>
                </thead>
                <tbody>
                  {topProperties.map((p, i) => (
                    <tr key={i} className="border-b border-border">
                      <td className="px-6 py-3 text-sm text-text-primary font-body">{p.title}</td>
                      <td className="px-6 py-3 text-sm text-text-secondary font-body">{p.views.toLocaleString()}</td>
                      <td className="px-6 py-3 text-sm text-text-secondary font-body">{p.inquiries}</td>
                      <td className="px-6 py-3 text-sm text-gold font-body">{p.conversion}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Top Searches */}
          <div className="bg-surface border border-border">
            <div className="px-6 py-4 border-b border-border">
              <h3 className="font-heading text-xl text-text-primary">Top Searches</h3>
            </div>
            <div className="p-6 space-y-4">
              {topSearches.map((search, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm text-text-primary font-body">{search.term}</span>
                  <div className="flex items-center gap-4">
                    <div className="w-32 h-1.5 bg-surface-2">
                      <div className="h-full bg-gold" style={{ width: `${(search.count / 342) * 100}%` }} />
                    </div>
                    <span className="text-xs text-text-muted font-body w-8 text-right">{search.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
