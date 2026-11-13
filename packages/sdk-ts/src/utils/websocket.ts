/**
 * Closes a detached socket while observing errors until shutdown completes.
 *
 * In particular, Node's `ws` polyfill emits an asynchronous error when a
 * connecting socket is closed. Removing application handlers must not leave
 * that error unobserved. These temporary handlers capture only the socket and
 * are removed on close, without retaining application callbacks.
 */
export function closeWebSocketSafely(socket: WebSocket): void {
  if (socket.readyState === 3) {
    return
  }

  const ignoreError = () => {}
  let cleanup: () => void

  if (
    typeof socket.addEventListener === 'function' &&
    typeof socket.removeEventListener === 'function'
  ) {
    const onClose = () => {
      socket.removeEventListener('error', ignoreError)
      socket.removeEventListener('close', onClose)
    }

    cleanup = onClose
    socket.addEventListener('error', ignoreError)
    socket.addEventListener('close', onClose)
  } else {
    // Some isomorphic socket implementations expose only property handlers.
    const previousError = socket.onerror
    const previousClose = socket.onclose
    const onClose = () => {
      if (socket.onerror === ignoreError) {
        socket.onerror = previousError
      }

      if (socket.onclose === onClose) {
        socket.onclose = previousClose
      }
    }

    cleanup = onClose
    socket.onerror = ignoreError
    socket.onclose = onClose
  }

  try {
    if (socket.readyState === 0 || socket.readyState === 1) {
      socket.close()
    }
  } catch {
    // A custom close implementation may throw and still emit shutdown events.
    // Keep observing errors until its close event releases the handlers.
  } finally {
    // Also release handlers for synchronous close implementations.
    if (socket.readyState === 3) {
      cleanup()
    }
  }
}
