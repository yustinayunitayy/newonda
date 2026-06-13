export interface StatItem {
  value: string
  label: string
}

export interface StatsBarBlock {
  blockType: 'statsBar'
  items: StatItem[]
}
