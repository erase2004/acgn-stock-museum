import type { Component } from 'react'
import { useState } from 'react'

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
      <div className={`cursor-pointer ${classes}`} onClick={() => setIsOpen(!isOpen)}>
        {title}
        <i className={`fa ml-2 ${iconClass}`} aria-hidden="true"></i>
      </div>
      {isOpen && children}
    </>
  )
}
