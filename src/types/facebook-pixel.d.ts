interface Window {
  fbq: (
    track: string,
    event: string,
    parameters?: Record<string, unknown>,
    options?: { eventID?: string }
  ) => void
}