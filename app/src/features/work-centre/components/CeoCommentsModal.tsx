import { useState } from 'react'

import { Dialog, DialogBody, DialogContent, DialogFooter, DialogHeader } from '../../../shared/ui'

export function CeoCommentsModal({ onClose }: { onClose: () => void }) {
  const [comment, setComment] = useState('')
  const [priority, setPriority] = useState('Medium')

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent size="md">
        <DialogHeader title="CEO Comments" description="Top management visibility on this task" />
        <DialogBody>
          <label className="flex flex-col gap-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-text-3">Top Management Comments</span>
            <textarea
              rows={4}
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              className="resize-none rounded-sm border border-line-2 bg-bg px-3 py-2 text-sm text-text outline-none focus-visible:border-accent"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-text-3">Notify Users</span>
            <select multiple className="h-24 rounded-sm border border-line-2 bg-bg px-3 py-2 text-sm text-text outline-none">
              <option>Tom Baker</option>
              <option>Sarah Johnson</option>
              <option>Mike Chen</option>
            </select>
          </label>
          <div className="grid grid-cols-2 gap-3.5">
            <label className="flex flex-col gap-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-text-3">Priority</span>
              <select value={priority} onChange={(event) => setPriority(event.target.value)} className="h-10 rounded-sm border border-line-2 bg-bg px-3 text-sm text-text outline-none">
                {['Low', 'Medium', 'High', 'Critical'].map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-text-3">User Status</span>
              <div className="flex h-10 items-center rounded-sm border border-line-2 bg-bg-2 px-3 text-sm text-text-2">Current Status: Under Study</div>
            </div>
          </div>
          <button type="button" className="self-start rounded-sm border border-line-2 px-3 py-1.5 text-xs font-medium text-text-2 hover:bg-bg-2">
            + Add File
          </button>
          <p className="text-xs text-text-4">Process owner and assignee are required.</p>
        </DialogBody>
        <DialogFooter className="justify-end">
          <button type="button" onClick={onClose} className="h-9 rounded-sm border border-line-2 px-4 text-sm font-medium text-text-2 hover:bg-bg-2">
            Cancel
          </button>
          <button type="button" onClick={onClose} className="h-9 rounded-sm bg-accent px-4 text-sm font-medium text-accent-ink">
            Save
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
