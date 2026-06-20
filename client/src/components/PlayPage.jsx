import { useEffect, useState } from 'react';
import { Container, Spinner, Alert, Card, Row, Col, Badge, ListGroup, Button } from 'react-bootstrap';
import gameAPI from '../API/gameAPI';

import ExecutionPage from './ExecutionPage';

function PlayPage() {
  const [game, setGame] = useState(null);
  const [planningData, setPlanningData] = useState(null);
  const [networkMap, setNetworkMap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [phase, setPhase] = useState('setup');
  const [selectedSegments, setSelectedSegments] = useState([]);
  const [submitResult, setSubmitResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);


{/* Starting the game */}
const fetchGameData = async () => {
    try {
      setLoading(true)
      const map = await gameAPI.getNetworkMap()
      const newGame = await gameAPI.createGame()
      const planning = await gameAPI.getPlanningData(newGame.gameId)

      setNetworkMap(map)
      setGame(newGame)
      setPlanningData(planning)
    } catch (err) {
      setErrorMsg(err.message || 'Failed to load game')
    } finally {
      setLoading(false)
    }
  }

  //Botstraping game
  useEffect(() => {
    fetchGameData()
  }, [])

  // "Create New Game" Button function
  const handleCreateNewGame = () => {
    setPhase('setup')
    setSelectedSegments([])
    setSubmitResult(null)
    setTimeLeft(null)
    fetchGameData()
  }

{/* Countdown */}
useEffect(() => {
  if (phase !== 'planning' || !planningData?.timeLimitSeconds || submitResult || submitting) {
    return
  }

  if (timeLeft === null) {
    setTimeLeft(planningData.timeLimitSeconds);
    return
  }

  if (timeLeft === 0) {
    handleSubmitRoute()
    return
  }

  const timerId = setTimeout(() => {
    setTimeLeft((current) => current - 1)
  }, 1000)

  return () => clearTimeout(timerId)
}, [phase, planningData, timeLeft, submitResult, submitting])

  if (loading) {
    return (
      <Container className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <Spinner animation="border" variant="primary" />
        <p className="mt-3 text-muted">Loading game...</p>
      </Container>
    )
  }

  if (errorMsg) {
    return (
      <Container className="py-5">
        <Alert variant="danger" className="text-center shadow-sm">
          {errorMsg}
        </Alert>
      </Container>
    )
  }

  {/* Understands the orientation of each segment */}
  const buildRouteStationIds = () => {
    if (selectedSegments.length === 0 || !planningData?.startStation?.id) {
      return []
    }

    const routeStationIds = [planningData.startStation.id]
    let currentStationId = planningData.startStation.id

    for (const segment of selectedSegments) {
      if (segment.fromStationId === currentStationId) {
        routeStationIds.push(segment.toStationId)
        currentStationId = segment.toStationId
      } else if (segment.toStationId === currentStationId) {
        routeStationIds.push(segment.fromStationId)
        currentStationId = segment.fromStationId
      } else {
        routeStationIds.push(segment.fromStationId, segment.toStationId);
        currentStationId = segment.toStationId
      }
    }

    return routeStationIds
  }

  {/*Impose that a - b === b - a*/}
  const normalizeSegmentKey = (a, b) => {
    return a < b ? `${a}-${b}` : `${b}-${a}`
  }


  {/* Every segment must be selected only once */}
  const handleAddSegment = (segment) => {
    const segmentKey = normalizeSegmentKey(
      segment.fromStationId,
      segment.toStationId
    )

    const alreadySelected = selectedSegments.some(
      (s) =>
        normalizeSegmentKey(s.fromStationId, s.toStationId) === segmentKey
    )

    if (alreadySelected) return;

    setSelectedSegments([...selectedSegments, segment])
  }

  {/* Delete selected segments */}
  const handleRemoveSegment = (segmentToRemove) => {
    const segmentKeyToRemove = normalizeSegmentKey(
      segmentToRemove.fromStationId,
      segmentToRemove.toStationId
    )
    
    setSelectedSegments((current) =>
      current.filter(
        (segment) =>
           normalizeSegmentKey(segment.fromStationId, segment.toStationId) !== segmentKeyToRemove
      )
    )
  }

  {/* Submit */}
  const handleSubmitRoute = async () => {
    if (submitting || submitResult) return

    try {
      setSubmitting(true)
      setErrorMsg('')

      const routeStationIds = buildRouteStationIds();
      const result = await gameAPI.submitRoute(game.gameId, routeStationIds)

      setSubmitResult(result)

      setPhase('execution')
      
    } catch (err) {
      setErrorMsg(err.message || 'Failed to submit route');
    } finally {
      setSubmitting(false)
    }
  }

  {/* Obtain stations name */}
  const getStationName = (id) => {
    if (!networkMap?.stations) return id
      const station = networkMap.stations.find((s) => s.id === id)
      return station ? station.name : id
    }
  
  {/* Execution*/}
  if (phase === 'execution') {
    return (
      <ExecutionPage 
        submitResult={submitResult} 
        getStationName={getStationName}
        game={game}
        selectedSegments={selectedSegments}
        routeStationIds={buildRouteStationIds()}
        onReplay={() => {
          setPhase('setup')
          setSelectedSegments([])
          setSubmitResult(null)
          setTimeLeft(null)
        }} 
        onCreateNew={handleCreateNewGame}
      />
    )
  }

  return (
    <Container className="py-5">
      
      {/* Header */}
      <Container>
        <p className="text-uppercase text-muted fw-bold mb-1" style={{ letterSpacing: '1px' }}>
        Phase 01 / 02
        </p>
        <h1 className="display-5 fw-bold mb-4">Game Loaded</h1>
        <h3 className="text-secondary mb-4">
          Study the complete network before moving to the planning phase.
        </h3>

        {phase === 'setup' ? (
          <Badge bg="primary" pill className="px-3 py-2 shadow-sm fs-6 mb-3">
            Setup ready
        </Badge>
          ) : (
            <Badge bg="warning" pill className="px-3 py-2 shadow-sm fs-6 mb-3">
              Planning Phase
            </Badge>
          )
        }
      </Container>
      

      {/* Summary Grid */}
      <Card className="shadow-sm border-0 bg-light mb-4">
        <Card.Body className="p-4">
          <Card.Title className="text-primary fw-bold mb-4">Mission Briefing</Card.Title>
          <Row className="g-4">
            <Col sm={6} md={4}>
              <div className="text-muted small fw-bold text-uppercase">Start</div>
              <div className="fs-5">{game?.startStation?.name}</div>
            </Col>
            <Col sm={6} md={4}>
              <div className="text-muted small fw-bold text-uppercase">Destination</div>
              <div className="fs-5">{game?.destinationStation?.name}</div>
            </Col>
            <Col sm={6} md={4}>
              <div className="text-muted small fw-bold text-uppercase">Initial Coins</div>
              <div className="fs-5 fw-bold text-success">{game?.initialCoins}</div>
            </Col>
            <Col sm={6} md={4}>
              <div className="text-muted small fw-bold text-uppercase">Planning Time</div>
              <div 
                className={`fs-5 fw-bold ${
                  phase === 'planning' 
                    ? (timeLeft <= 10 ? 'text-danger animate-pulse' : 'text-success')
                    : ''
                }`}
              >
                {phase === 'planning' && timeLeft !== null 
                  ? `${timeLeft} s remaining` 
                  : `${planningData?.timeLimitSeconds ?? '--'} s`}
              </div>
            </Col>
            <Col sm={6} md={4}>
              <div className="text-muted small fw-bold text-uppercase">Stations</div>
              <div className="fs-5">{networkMap?.stations?.length}</div>
            </Col>
            <Col sm={6} md={4}>
              <div className="text-muted small fw-bold text-uppercase">Segments</div>
              <div className="fs-5">{planningData?.segments?.length}</div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Map & Stations */}
      {phase === 'setup' ?(
        <Row className="g-4">
        
        {/*Lines*/}
        <Col lg={8}>
          <Card className="shadow-sm border-0 h-100 bg-light">
            <Card.Body className="p-4">
              <Card.Title className="text-primary fw-bold mb-4">Network Map</Card.Title>

              {Array.isArray(networkMap?.lines) && networkMap.lines.length > 0 ? (
                <div className="d-flex flex-column gap-3">
                  {networkMap.lines.map((line) => (
                    
                    <Card key={line.id} className="border-0 shadow-sm bg-white">
                      <Card.Body>
                        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-2">
                          <strong className="fs-5">{line.name}</strong>

                          {line.color && (
                            <Badge
                              pill
                              style={{
                                backgroundColor: line.color,
                                color: '#fff', 
                                textShadow: '0 0 2px rgba(0,0,0,0.5)' 
                              }}
                            >
                              {line.color}
                            </Badge>
                          )}
                        </div>

                        <div className="text-muted small lh-lg">
                          {(() => {
                            const stations = (networkMap?.lineStations || [])
                              .filter((ls) => ls.line_id === line.id)
                              .map((ls) => ls.station_name);

                            if (stations.length === 0) return 'No stations available for this line.'

                            return stations.map((name, idx) => (
                              <span key={idx}>
                                {name}
                                {idx < stations.length - 1 && (
                                  <i className="bi bi-arrow-left-right mx-2 text-secondary"></i>
                                )}
                              </span>
                            ))
                          })()}
                        </div>
                      </Card.Body>
                    </Card>
                  ))}
                </div>
              ) : (
                <Alert variant="secondary" className="mb-0">
                  No line data available.
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Stations */}
        <Col lg={4}>
          <Card className="shadow-sm border-0 h-100 bg-light">
            <Card.Body className="p-4">
              <Card.Title className="text-primary fw-bold mb-4">All Stations</Card.Title>

              {Array.isArray(networkMap?.stations) && networkMap.stations.length > 0 ? (
                <ListGroup variant="flush" className="rounded shadow-sm">
                  {networkMap.stations.map((station) => (
                    <ListGroup.Item key={station.id} className="bg-white border-bottom">
                      <i className="bi bi-geo-alt-fill text-muted me-2"></i>
                      <span className="fw-bold">{station.name}</span>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              ) : (
                <Alert variant="secondary" className="mb-0">
                  No station data available.
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Col>

      </Row>) : (
          <Container className='px-0'>
            {/*All Stations */}
            <Row className="mb-4">
              <Col lg={12}>
                <Card className="shadow-sm border-0 bg-light">
                  <Card.Body className="p-4">
                    <Card.Title className="text-primary fw-bold mb-3">All Stations</Card.Title>

                    {Array.isArray(networkMap?.stations) && networkMap.stations.length > 0 ? (
                      <ListGroup className="flex-row flex-wrap gap-2 border-0">
                        {networkMap.stations.map((station) => (
                          <ListGroup.Item 
                            key={station.id} 
                            className="bg-white border rounded shadow-sm d-flex align-items-center px-3 py-2 w-auto"
                          >
                            <i className="bi bi-geo-alt-fill text-muted me-2"></i>
                            <span className="fw-bold">{station.name}</span>
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    ) : (
                      <Alert variant="secondary" className="mb-0">
                        No station data available.
                      </Alert>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            
            {/* Available Segments + Current Route */}
            <Row>
              {/* Segments */}
              <Col lg={7}>
                <Card className="shadow-sm border-0 h-100 bg-light">
                  <Card.Body>
                    <Card.Title className="mb-3">Available Segments</Card.Title>

                    {Array.isArray(planningData?.segments) && planningData.segments.length > 0 ? (
                      <div className="d-flex flex-column gap-2">
                        {planningData.segments.map((segment, index) => {
                          const alreadySelected = selectedSegments.some(
                            (s) =>
                              normalizeSegmentKey(s.fromStationId, s.toStationId) === normalizeSegmentKey(segment.fromStationId, segment.toStationId)
                          )

                          return (
                            <Card key={index} className="border-0 shadow-sm bg-white">
                              <Card.Body className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                                <div>
                                  <strong>
                                    {segment.fromStationName} <i className="bi bi-arrow-left-right mx-2 text-secondary"></i> {segment.toStationName}
                                  </strong>
                                </div>

                                <Button
                                  variant={alreadySelected ? 'outline-danger' : 'warning'}
                                  size="sm"
                                  onClick={() =>
                                    alreadySelected
                                      ? handleRemoveSegment(segment)
                                      : handleAddSegment(segment)
                                  }
                                >
                                  {alreadySelected ? 'Remove' : 'Add'}
                                </Button>
                              </Card.Body>
                            </Card>
                          )
                        })}
                      </div>
                    ) : (
                      <Alert variant="secondary" className="mb-0">
                        No segments available.
                      </Alert>
                    )}
                  </Card.Body>
                </Card>
              </Col>

              {/* Current Route */}
              <Col lg={5}>
                <Card className="shadow-sm border-0 h-100 bg-light">
                  <Card.Body>
                    <Card.Title className="mb-3">Current Route</Card.Title>

                    {selectedSegments.length > 0 ? (
                      <ListGroup variant="flush">
                        {selectedSegments.map((segment, index) => (
                          <ListGroup.Item
                            key={index}
                            className="d-flex justify-content-between align-items-center"
                          >
                            <span>
                              <span className="text-muted fw-bold me-2">{index + 1}.</span> 

                              {segment.fromStationName} <i className="bi bi-arrow-left-right mx-2 text-primary"></i> {segment.toStationName}
                            </span>
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    ) : (
                      <Alert variant="secondary" className="mb-0">
                        No segments selected yet.
                      </Alert>
                    )}
                  </Card.Body>
                </Card>
                <div className="d-flex justify-content-center mt-4">
                  <Button
                    variant="success"
                    onClick={handleSubmitRoute}
                    disabled={submitting || !!submitResult || selectedSegments.length === 0}
                  >
                    {submitting ? 'Submitting...' : 'Submit Route'}
                  </Button>
                </div>
              </Col>
            </Row>
          </Container>
          
        )
      }

      {/* Go to planning phase */}
      {phase === 'setup' && (
        <div className="d-flex justify-content-center mt-5 mb-3">
          <Button 
            variant="warning" 
            size="lg" 
            className="px-5 rounded-pill shadow-sm fw-bold"
            onClick={() => {setPhase('planning'); setTimeLeft(planningData?.timeLimitSeconds ?? 90)}}
          >
            Start Planning
          </Button>
        </div>
        ) 
      }
  
    </Container>
  )
}

export default PlayPage