export interface ScriptFile {
  name: string
  type: string
  status: string
  description: string
}

export interface Run {
  script: string
  target: string
  duration: string
  status: string
  time: string
}

export interface WeeklyRunStat {
  label: string
  passed: number
  failed: number
}
