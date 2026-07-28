export interface MitraStepsBlock {
  blockType: 'mitra-steps'
  heading?: string
  steps: { title: string; description?: string }[]
}
