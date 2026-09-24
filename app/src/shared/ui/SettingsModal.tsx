import { useEffect, useState } from 'react'

import { CheckIcon, SettingsIcon } from './icons'
import { Dialog, DialogBody, DialogContent, DialogFooter, DialogHeader } from './Dialog'

export interface SettingsTabConfig {
  key: string
  label: string
  instruction: string
  items: { key: string; label: string }[]
}

export type SettingsSelections = Record<string, string[]>

interface SettingsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tabs: SettingsTabConfig[]
  value: SettingsSelections
  onSave: (value: SettingsSelections) => void
}

/** Matches the live prototype's gear-icon "SETTINGS" modal: pill tabs, a
 * Select All / Deselect All pair per tab, checkbox tiles, shared footer. */
export function SettingsModal({ open, onOpenChange, tabs, value, onSave }: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState(tabs[0]?.key ?? '')
  const [draft, setDraft] = useState<SettingsSelections>(value)

  useEffect(() => {
    if (open) {
      setDraft(value)
      setActiveTab(tabs[0]?.key ?? '')
    }
  }, [open, value, tabs])

  const tab = tabs.find((t) => t.key === activeTab) ?? tabs[0]
  const selected = new Set(tab ? (draft[tab.key] ?? []) : [])

  function toggleItem(itemKey: string) {
    if (!tab) return
    setDraft((d) => {
      const current = new Set(d[tab.key] ?? [])
      if (current.has(itemKey)) current.delete(itemKey)
      else current.add(itemKey)
      return { ...d, [tab.key]: [...current] }
    })
  }

  function setAll(items: string[]) {
    if (!tab) return
    setDraft((d) => ({ ...d, [tab.key]: items }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader icon={<SettingsIcon size={15} />} title="Settings" />
        <DialogBody>
          <div className="flex gap-1.5 rounded-md bg-paper-2 p-1">
            {tabs.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setActiveTab(t.key)}
                className={`rounded-sm px-3 py-1.5 text-sm font-medium ${
                  t.key === activeTab ? 'bg-blue-med text-white' : 'text-text-3'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {tab ? (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <p className="text-sm text-text-3">{tab.instruction}</p>
                <div className="flex gap-2 text-xs font-medium text-accent">
                  <button type="button" onClick={() => setAll(tab.items.map((i) => i.key))}>
                    Select All
                  </button>
                  <span className="text-text-4">|</span>
                  <button type="button" onClick={() => setAll([])}>
                    Deselect All
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {tab.items.map((item) => (
                  <label
                    key={item.key}
                    className="flex items-center gap-2 rounded-md border border-line px-3 py-2 text-sm text-text-2"
                  >
                    <input
                      type="checkbox"
                      checked={selected.has(item.key)}
                      onChange={() => toggleItem(item.key)}
                      className="h-4 w-4"
                    />
                    {item.label}
                  </label>
                ))}
              </div>
            </div>
          ) : null}
        </DialogBody>
        <DialogFooter>
          <div className="ms-auto flex gap-2">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="rounded-sm px-4 py-2 text-sm text-text-2 hover:bg-bg-2"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                onSave(draft)
                onOpenChange(false)
              }}
              className="flex items-center gap-1.5 rounded-sm bg-blue-med px-4 py-2 text-sm font-medium text-white hover:bg-blue-dark"
            >
              <CheckIcon size={13} /> Save Settings
            </button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
