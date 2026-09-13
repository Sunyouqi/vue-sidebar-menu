export interface AutomationNode {
  id: string
  name: string
  path: string
  kind: 'folder' | 'file'
  children: AutomationNode[]
  expanded: boolean
  file?: File
}
