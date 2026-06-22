// Builds the graph representing the network
function buildGraph(segments) {
  const graph = new Map()

  for (const seg of segments) {
    const a = seg.from_station_id
    const b = seg.to_station_id

    if (!graph.has(a)) graph.set(a, [])
    if (!graph.has(b)) graph.set(b, [])

    graph.get(a).push({
      to: b,
      lineId: seg.line_id,
      lineName: seg.line_name
    })

    graph.get(b).push({
      to: a,
      lineId: seg.line_id,
      lineName: seg.line_name
    })
  }

  return graph
}

//Classic BFS
function shortestDistance(graph, startId, destinationId) {
  const queue = [{ stationId: startId, dist: 0 }]
  const visited = new Set([startId])

  while (queue.length > 0) {
    const current = queue.shift()

    if (current.stationId === destinationId) {
      return current.dist
    }

    const neighbors = graph.get(current.stationId) || []
    for (const n of neighbors) {
      if (!visited.has(n.to)) {
        visited.add(n.to)
        queue.push({ stationId: n.to, dist: current.dist + 1 })
      }
    }
  }

  return Infinity //extreme fallback
}

//Random pair generator
function chooseRandomStartDestination(stations, graph, minDistance = 3) {
  const candidates = []

  for (const start of stations) {
    for (const end of stations) {
      if (start.id !== end.id) {
        const dist = shortestDistance(graph, start.id, end.id)
        if (dist >= minDistance && dist !== Infinity) {
          candidates.push({
            startStation: start,
            destinationStation: end
          })
        }
      }
    }
  }

  if (candidates.length === 0) {
    throw new Error('No valid start/destination pairs found')
  }

  const index = Math.floor(Math.random() * candidates.length)
  return candidates[index]
}

//Helper function to allow a -> b and b -> a as a single segment
function normalizeSegmentKey(a, b) {
  return a < b ? `${a}-${b}` : `${b}-${a}`
}

//Validation function
function validateRoute(routeStationIds, segments, interchangeStationIds, startId, destinationId) {

  // User didn't add any segment
  if (!Array.isArray(routeStationIds) || routeStationIds.length < 2) {
    return { valid: false, reason: 'Route must contain at least 2 stations' }
  }

  // User didn't choose the right initial station
  if (routeStationIds[0] !== startId) {
    return { valid: false, reason: 'Route must start from assigned start station' }
  }

  // User didn't choose the right destination station
  if (routeStationIds[routeStationIds.length - 1] !== destinationId) {
    return { valid: false, reason: 'Route must end at assigned destination station' }
  }

  // {key: [{l_id, l_name, from, to}]}
  const segmentMap = new Map()
  for (const seg of segments) {
    const key = normalizeSegmentKey(seg.from_station_id, seg.to_station_id)
    if (!segmentMap.has(key)) segmentMap.set(key, [])
    segmentMap.get(key).push(seg)
  }

  const usedSegments = new Set()
  let previousLineId = null

  for (let i = 0; i < routeStationIds.length - 1; i++) {
    const from = routeStationIds[i]
    const to = routeStationIds[i + 1]
    const key = normalizeSegmentKey(from, to)
    
    // Segment already used
    if (usedSegments.has(key)) {
      return { valid: false, reason: 'A segment cannot be used more than once' }
    }

    // Non existing segment 
    const matchingSegments = segmentMap.get(key)
    if (!matchingSegments || matchingSegments.length === 0) {
      return { valid: false, reason: 'Route contains a non-existing segment' }
    }

    // Cannot change lane unless it uses an interchange station
    let chosenSegment = matchingSegments[0]

    if (previousLineId !== null) {
      const sameLine = matchingSegments.find(seg => seg.line_id === previousLineId)
      if (sameLine) {
        chosenSegment = sameLine
      } else {
        const interchangeStation = from
        if (!interchangeStationIds.has(interchangeStation)) {
          return {
            valid: false,
            reason: 'Line changes are allowed only at interchange stations'
          }
        }
      }
    }

    previousLineId = chosenSegment.line_id
    usedSegments.add(key)
  }

  return { valid: true }
}

export {
  buildGraph,
  shortestDistance,
  chooseRandomStartDestination,
  validateRoute
};