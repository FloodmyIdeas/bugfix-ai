// @ts-nocheck
'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import type { Plan } from '@/lib/plans'

interface PlanContextType {
  plan: Plan
  setPlan: (p: Plan) => void
  usageToday: number
  incrementUsage: () => void
  resetUsage: () => void
}

const PlanContext = createContext<PlanContextType>({
  plan: 'free',
  setPlan: () => {},
  usageToday: 0,
  incrementUsage: () => {},
  resetUsage: () => {},
})

export function PlanProvider({ children }: { children: React.ReactNode }) {
  const [plan, setPlanState] = useState<Plan>('free')
  const [usageToday, setUsageToday] = useState(0)

  useEffect(() => {
    // Load plan from localStorage (set after Stripe success)
    const storedPlan = localStorage.getItem('bugfix_plan') as Plan | null
    if (storedPlan) setPlanState(storedPlan)

    // Load usage with date check
    const usageData = localStorage.getItem('bugfix_usage')
    if (usageData) {
      const { date, count } = JSON.parse(usageData)
      const today = new Date().toDateString()
      if (date === today) setUsageToday(count)
      else localStorage.setItem('bugfix_usage', JSON.stringify({ date: today, count: 0 }))
    }
  }, [])

  const setPlan = (p: Plan) => {
    setPlanState(p)
    localStorage.setItem('bugfix_plan', p)
  }

  const incrementUsage = () => {
    const next = usageToday + 1
    setUsageToday(next)
    localStorage.setItem('bugfix_usage', JSON.stringify({
      date: new Date().toDateString(),
      count: next,
    }))
  }

  const resetUsage = () => {
    setUsageToday(0)
    localStorage.setItem('bugfix_usage', JSON.stringify({
      date: new Date().toDateString(),
      count: 0,
    }))
  }

  return (
    <PlanContext.Provider value={{ plan, setPlan, usageToday, incrementUsage, resetUsage }}>
      {children}
    </PlanContext.Provider>
  )
}

export const usePlan = () => useContext(PlanContext)
