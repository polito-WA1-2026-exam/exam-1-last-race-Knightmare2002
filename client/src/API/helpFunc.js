async function getJson(response) {
  const json = await response.json().catch(() => null)
  if (!response.ok) {
    const error = json?.error || 'Request failed'
    throw new Error(error)
  }
  return json
}

export default getJson