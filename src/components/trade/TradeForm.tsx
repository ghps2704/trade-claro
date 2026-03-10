import { useState } from 'react'
import type { TradeFormData } from '../../types'
import { PREDEFINED_TAGS, ASSETS } from '../../types'
import TagChip from '../ui/TagChip'

import type { Trade } from '../../types'

interface TradeFormProps {
  onSubmit: (data: TradeFormData) => Promise<void>
  onClose: () => void
  initialData?: Trade
}

const EMOTION_LABELS: Record<number, string> = {
  1: 'Péssimo', 2: 'Muito ruim', 3: 'Ruim', 4: 'Abaixo do normal',
  5: 'Neutro', 6: 'Razoável', 7: 'Bom', 8: 'Muito bom', 9: 'Ótimo', 10: 'Excelente',
}

const today = new Date().toISOString().split('T')[0]

export default function TradeForm({ onSubmit, onClose, initialData }: TradeFormProps) {
  const [form, setForm] = useState<TradeFormData>(initialData ?? {
    date: today,
    asset: '',
    type: 'Long',
    result: 0,
    emotion: 5,
    confidence: 5,
    followed_plan: true,
    note: '',
    tags: [],
  })
  const [customTag, setCustomTag] = useState('')
  const [loading, setLoading] = useState(false)
  const [assetInput, setAssetInput] = useState(initialData?.asset ?? '')
  const [showAssets, setShowAssets] = useState(false)
  const [resultInput, setResultInput] = useState(initialData ? String(initialData.result) : '')

  const toggleTag = (tag: string) => {
    setForm(f => ({
      ...f,
      tags: f.tags.includes(tag) ? f.tags.filter(t => t !== tag) : [...f.tags, tag],
    }))
  }

  const addCustomTag = () => {
    const tag = customTag.trim().toLowerCase()
    if (tag && !form.tags.includes(tag)) {
      setForm(f => ({ ...f, tags: [...f.tags, tag] }))
    }
    setCustomTag('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.asset) {
      // Try to auto-select if there's an exact or unique match
      const matches = ASSETS.filter(a => a.toLowerCase().includes(assetInput.toLowerCase()))
      if (matches.length === 1) {
        setForm(f => ({ ...f, asset: matches[0] }))
        setAssetInput(matches[0])
      }
      return
    }
    setLoading(true)
    await onSubmit(form)
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-surface border-b border-border px-6 py-4 flex items-center justify-between">
          <h2 className="font-title text-xl font-bold text-text-primary">{initialData ? 'Editar Trade' : 'Novo Trade'}</h2>
          <button onClick={onClose} className="text-text-secondary hover:text-text-primary transition-colors text-xl">×</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Asset + Direction */}
          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <label className="block text-text-secondary text-sm mb-1.5">Ativo</label>
              <input
                type="text"
                value={assetInput}
                onChange={e => { setAssetInput(e.target.value.toUpperCase()); setForm(f => ({ ...f, asset: '' })); setShowAssets(true) }}
                onFocus={() => setShowAssets(true)}
                onBlur={() => setTimeout(() => setShowAssets(false), 150)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    const matches = ASSETS.filter(a => a.toLowerCase().includes(assetInput.toLowerCase()))
                    if (matches.length > 0) {
                      setForm(f => ({ ...f, asset: matches[0] }))
                      setAssetInput(matches[0])
                      setShowAssets(false)
                    }
                  }
                }}
                placeholder="Ex: WINFUT"
                className={`w-full bg-bg border rounded-lg px-3 py-2.5 text-text-primary placeholder-text-secondary focus:outline-none transition-colors ${
                  form.asset ? 'border-accent' : 'border-border focus:border-accent'
                }`}
                required
              />
              {showAssets && assetInput && (
                <div className="absolute top-full mt-1 left-0 right-0 bg-surface border border-border rounded-lg overflow-hidden z-10">
                  {ASSETS.filter(a => a.toLowerCase().includes(assetInput.toLowerCase())).map(asset => (
                    <button
                      key={asset}
                      type="button"
                      onMouseDown={() => { setForm(f => ({ ...f, asset })); setAssetInput(asset); setShowAssets(false) }}
                      className="w-full text-left px-3 py-2 text-text-primary hover:bg-border transition-colors text-sm"
                    >{asset}</button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-text-secondary text-sm mb-1.5">Direção</label>
              <div className="flex gap-2">
                {(['Long', 'Short'] as const).map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setForm(f => ({ ...f, type: t }))}
                    className={`flex-1 py-2.5 rounded-lg font-semibold text-sm transition-all ${
                      form.type === t
                        ? t === 'Long' ? 'bg-accent text-bg' : 'bg-negative text-white'
                        : 'bg-bg border border-border text-text-secondary hover:border-accent/40'
                    }`}
                  >{t}</button>
                ))}
              </div>
            </div>
          </div>

          {/* Result + Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-text-secondary text-sm mb-1.5">Resultado (R$)</label>
              <input
                type="number"
                step="0.01"
                value={resultInput}
                onChange={e => {
                  setResultInput(e.target.value)
                  setForm(f => ({ ...f, result: parseFloat(e.target.value) || 0 }))
                }}
                placeholder="Ex: 350.00 ou -120.50"
                className="w-full bg-bg border border-border rounded-lg px-3 py-2.5 text-text-primary placeholder-text-secondary focus:outline-none focus:border-accent transition-colors font-mono"
                required
              />
            </div>
            <div>
              <label className="block text-text-secondary text-sm mb-1.5">Data</label>
              <input
                type="date"
                value={form.date}
                onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                className="w-full bg-bg border border-border rounded-lg px-3 py-2.5 text-text-primary focus:outline-none focus:border-accent transition-colors"
                required
              />
            </div>
          </div>

          {/* Emotion slider */}
          <div>
            <label className="flex justify-between text-sm mb-1.5">
              <span className="text-text-secondary">Emoção antes do trade</span>
              <span className="text-accent font-medium">{form.emotion} — {EMOTION_LABELS[form.emotion]}</span>
            </label>
            <input
              type="range" min="1" max="10" value={form.emotion}
              onChange={e => setForm(f => ({ ...f, emotion: parseInt(e.target.value) }))}
              className="w-full accent-[#00D4AA]"
            />
            <div className="flex justify-between text-xs text-text-secondary mt-1">
              <span>Péssimo</span><span>Excelente</span>
            </div>
          </div>

          {/* Confidence slider */}
          <div>
            <label className="flex justify-between text-sm mb-1.5">
              <span className="text-text-secondary">Confiança no setup</span>
              <span className="text-accent font-medium">{form.confidence}/10</span>
            </label>
            <input
              type="range" min="1" max="10" value={form.confidence}
              onChange={e => setForm(f => ({ ...f, confidence: parseInt(e.target.value) }))}
              className="w-full accent-[#00D4AA]"
            />
          </div>

          {/* Followed plan */}
          <div>
            <label className="block text-text-secondary text-sm mb-1.5">Seguiu o plano?</label>
            <div className="flex gap-2">
              {[true, false].map(val => (
                <button
                  key={String(val)}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, followed_plan: val }))}
                  className={`flex-1 py-2.5 rounded-lg font-semibold text-sm transition-all ${
                    form.followed_plan === val
                      ? val ? 'bg-accent text-bg' : 'bg-negative text-white'
                      : 'bg-bg border border-border text-text-secondary hover:border-accent/40'
                  }`}
                >{val ? 'Sim ✓' : 'Não ✗'}</button>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-text-secondary text-sm mb-2">Tags</label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {PREDEFINED_TAGS.map(tag => (
                <TagChip
                  key={tag}
                  tag={tag}
                  onClick={() => toggleTag(tag)}
                  selected={form.tags.includes(tag)}
                />
              ))}
            </div>
            {form.tags.filter(t => !PREDEFINED_TAGS.includes(t)).map(tag => (
              <TagChip key={tag} tag={tag} onRemove={() => toggleTag(tag)} />
            ))}
            <div className="flex gap-2 mt-2">
              <input
                type="text"
                value={customTag}
                onChange={e => setCustomTag(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCustomTag())}
                placeholder="Tag personalizada..."
                className="flex-1 bg-bg border border-border rounded-lg px-3 py-2 text-text-primary placeholder-text-secondary text-sm focus:outline-none focus:border-accent transition-colors"
              />
              <button type="button" onClick={addCustomTag} className="px-3 py-2 border border-border rounded-lg text-text-secondary hover:text-accent hover:border-accent transition-colors text-sm">
                +
              </button>
            </div>
          </div>

          {/* Note */}
          <div>
            <label className="block text-text-secondary text-sm mb-1.5">Anotação</label>
            <textarea
              value={form.note || ''}
              onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
              placeholder="O que aconteceu neste trade? O que você pensou, sentiu, observou..."
              rows={3}
              className="w-full bg-bg border border-border rounded-lg px-3 py-2.5 text-text-primary placeholder-text-secondary text-sm focus:outline-none focus:border-accent transition-colors resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border border-border rounded-xl text-text-secondary hover:text-text-primary hover:border-accent/40 transition-all"
            >Cancelar</button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 bg-accent text-bg font-bold rounded-xl hover:bg-accent/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >{loading ? 'Salvando...' : initialData ? 'Salvar alterações' : 'Salvar Trade'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}
