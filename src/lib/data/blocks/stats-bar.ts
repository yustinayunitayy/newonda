export interface StatItem {
  value: string
  label: string
}

export interface StatsBarBlock {
  blockType: 'stats-bar'
  items: StatItem[]
}
