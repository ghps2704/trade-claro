import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { Trade, TradeFormData } from '../types'
import { useAuth } from './useAuth'

export function useTrades() {
  const { user } = useAuth()
  const [trades, setTrades] = useState<Trade[]>([])
  const [loading, setLoading] = useState(true)

  const fetchTrades = useCallback(async () => {
    if (!user) return
    setLoading(true)
    const { data, error } = await supabase
      .from('trades')
      .select('*')
      .order('date', { ascending: false })
      .order('created_at', { ascending: false })

    if (!error && data) setTrades(data as Trade[])
    setLoading(false)
  }, [user])

  useEffect(() => { fetchTrades() }, [fetchTrades])

  const createTrade = async (formData: TradeFormData) => {
    if (!user) return { error: new Error('Not authenticated') }
    const { data, error } = await supabase
      .from('trades')
      .insert({ ...formData, user_id: user.id })
      .select()
      .single()

    if (!error && data) setTrades(prev => [data as Trade, ...prev])
    return { error }
  }

  const updateTrade = async (id: string, formData: Partial<TradeFormData>) => {
    const { data, error } = await supabase
      .from('trades')
      .update(formData)
      .eq('id', id)
      .select()
      .single()

    if (!error && data) {
      setTrades(prev => prev.map(t => t.id === id ? data as Trade : t))
    }
    return { error }
  }

  const deleteTrade = async (id: string) => {
    const { error } = await supabase.from('trades').delete().eq('id', id)
    if (!error) setTrades(prev => prev.filter(t => t.id !== id))
    return { error }
  }

  return { trades, loading, createTrade, updateTrade, deleteTrade, refetch: fetchTrades }
}
