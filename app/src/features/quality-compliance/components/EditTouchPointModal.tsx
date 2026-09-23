import { useState } from 'react'

import { Dialog, DialogBody, DialogContent, DialogFooter, DialogHeader } from '../../../shared/ui'
import type { WorkAreaRow } from '../data/qcMock'

const PRIORITIES = ['Critical', 'High', 'Medium', 'Low']

export function EditTouchPointModal({ row, onClose, onRemove }: { row: WorkAreaRow; onClose: () => void; onRemove: (id: string) => void }) {
  const [touchPoint, setTouchPoint] = useState(row.touchPoint)
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>(row.priority.split(' / '))
  const [response, setResponse] = useState(row.response)
  const [resolution, setResolution] = useState(row.resolution)
  const [triggers, setTriggers] = useState(row.triggers)

  function togglePriority(priority: string) {
    setSelectedPriorities((prev) => (prev.includes(priority) ? prev.filter((item) => item !== priority) : [...prev, priority]))
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent size="md">
        <DialogHeader title="Edit touch point" description="WORK-AREA RULE" />
        <DialogBody>
          <label className="flex flex-col gap-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-text-3">Sub-area / touch point</span>
            <input
              value={touchPoint}
              onChange={(event) => setTouchPoint(event.target.value)}
              className="h-10 rounded-sm border border-line-2 bg-bg px-3 text-sm text-text outline-none focus-visible:border-accent"
            />
          </label>

          <div className="flex flex-col gap-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-text-3">Priority</span>
            <div className="flex flex-wrap gap-1.5">
              {PRIORITIES.map((priority) => (
                <button
                  key={priority}
                  type="button"
                  onClick={() => togglePriority(priority)}
                  className={`rounded-full border px-3 py-1 text-xs font-medium ${
                    selectedPriorities.includes(priority) ? 'border-accent bg-accent-dim text-accent' : 'border-line-2 text-text-2 hover:bg-bg-2'
                  }`}
                >
                  {priority}
                </button>
              ))}
            </div>
            <p className="text-xs text-text-4">Pick more than one when the priority depends on the situation — explain the switch below.</p>
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            <label className="flex flex-col gap-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-text-3">Response time</span>
              <input
                value={response}
                onChange={(event) => setResponse(event.target.value)}
                className="h-10 rounded-sm border border-line-2 bg-bg px-3 text-sm text-text outline-none focus-visible:border-accent"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-text-3">Resolution time</span>
              <input
                value={resolution}
                onChange={(event) => setResolution(event.target.value)}
                className="h-10 rounded-sm border border-line-2 bg-bg px-3 text-sm text-text outline-none focus-visible:border-accent"
              />
            </label>
          </div>

          <label className="flex flex-col gap-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-text-3">Conditional triggers</span>
            <textarea
              rows={3}
              value={triggers}
              onChange={(event) => setTriggers(event.target.value)}
              className="resize-none rounded-sm border border-line-2 bg-bg px-3 py-2 text-sm text-text outline-none focus-visible:border-accent"
            />
          </label>
        </DialogBody>
        <DialogFooter>
          <button type="button" onClick={onClose} className="h-9 rounded-sm bg-accent px-4 text-sm font-medium text-accent-ink">
            Save changes
          </button>
          <button
            type="button"
            onClick={() => onRemove(row.id)}
            className="ms-auto h-9 rounded-sm border border-bad/40 px-4 text-sm font-medium text-bad hover:bg-bad/10"
          >
            Remove
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
