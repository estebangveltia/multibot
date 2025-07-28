export async function fetchDashboard(from?: string, to?: string) {
  const params = new URLSearchParams()
  if (from) params.set('from', from)
  if (to) params.set('to', to)
  const res = await fetch(`/app/dashboard?${params.toString()}`)
  return res.text()
}
