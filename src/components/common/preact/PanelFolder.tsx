import type { Component } from 'preact'
import { useState } from 'preact/hooks'

type Props = {
  title: string
  classes?: string
  state?: boolean
  children: Component
}

export default function PanelFolder({ title, classes, state = false, children }: Props) {
  const [isOpen, setIsOpen] = useState(state)
  const iconClass = isOpen ? 'fa-folder-open' : 'fa-folder'

  return (
    <>
      <div class={`cursor-pointer ${classes}`} onClick={() => setIsOpen(!isOpen)}>
        {title}
        <i class={`fa ml-2 ${iconClass}`} aria-hidden="true"></i>
      </div>
      {isOpen && children}
    </>
  )
}
