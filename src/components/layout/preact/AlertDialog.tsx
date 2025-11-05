import { useEffect, useRef, useState } from 'preact/hooks'
import { useLocalStorage } from 'usehooks-ts'

export default function AlertDialog() {
  const [open, setOpen] = useState(false)
  const [setting, setSetting, removeSetting] = useLocalStorage('no-more-warning', false)
  const checkboxRef = useRef<HTMLInputElement>(null)
  const targetUrl = useRef('')

  function handleClicked(e: MouseEvent) {
    const element = e.target as HTMLElement

    if (element.tagName === 'A') {
      const anchor = element as HTMLAnchorElement

      if (anchor.hostname !== location.hostname && !setting) {
        e.preventDefault()
        targetUrl.current = anchor.href
        setOpen(true)
      }
    }
  }

  function updateSetting() {
    if (!checkboxRef.current) return

    const checked = checkboxRef.current.checked
    if (checked) setSetting(true)
    else removeSetting()
  }

  function cancel() {
    updateSetting()
    setOpen(false)
  }

  function confirm() {
    updateSetting()
    setOpen(false)
    window.open(targetUrl.current, '_blank')
  }

  useEffect(() => {
    window.addEventListener('click', handleClicked)

    return () => {
      window.removeEventListener('click', handleClicked)
    }
  }, [setting])

  return (
    <dialog class="modal" open={open}>
      <div class="modal-box">
        <p class="py-4 text-xl text-error">即將開啟外部連結，請確認</p>
        <label class="label">
          不再顯示類似警告
          <input type="checkbox" class="checkbox checkbox-sm" ref={checkboxRef} />
        </label>
        <div class="modal-action">
          <form method="dialog">
            <button class="btn mr-2 btn-outline" onClick={cancel}>
              取消
            </button>
            <button class="btn btn-primary" onClick={confirm}>
              確認
            </button>
          </form>
        </div>
      </div>
    </dialog>
  )
}
