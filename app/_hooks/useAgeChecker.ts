import { useEffect, useRef } from 'react'

declare global {
  interface Window {
    AgeCheckerConfig: any
    AgeCheckerAPI: any
  }
}

export interface useAgeCheckerProps {
  onAccept: (uuid: string) => void
}

export default function useAgeChecker({ onAccept }: useAgeCheckerProps) {
  const onAcceptRef = useRef(onAccept)

  useEffect(() => {
    onAcceptRef.current = onAccept
  })

  if (process.env.ENVIRONMENT === 'development') {
    const verifyAge = () => {
      onAcceptRef.current('uuid')
    }
    return { verifyAge }
  }

  const showAgeChecker = () => {
    if (document.getElementById('age-checker-script') == null) {
      window.AgeCheckerConfig = {
        key: process.env.EXPO_PUBLIC_AGECHECKER_NET_KEY,
        mode: 'manual',
        show_close: true,
        onready: function () {
          window.AgeCheckerAPI.show()
        },
        onstatuschanged: function (status: any) {
          if (status.status === 'accepted') {
            onAcceptRef.current(status.uuid as string)
          }
        },
      }
      const h = document.getElementsByTagName('head')[0]
      const a = document.createElement('script')
      a.src = 'https://cdn.agechecker.net/static/popup/v1/popup.js'
      a.id = 'age-checker-script'
      a.crossOrigin = 'anonymous'
      a.onerror = function (a) {
        window.location.href = 'https://agechecker.net/loaderror'
      }
      h.insertBefore(a, h.firstChild)
    } else if (window.AgeCheckerAPI != null) {
      window.AgeCheckerAPI.show()
    }
  }

  const verifyAge = () => {
    showAgeChecker()
  }

  return { verifyAge }
}
