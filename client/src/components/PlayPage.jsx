import { useEffect, useState } from 'react';
import { Container, Spinner, Alert, Card, Row, Col, Badge, ListGroup } from 'react-bootstrap';
import gameAPI from '../API/gameAPI';

function PlayPage() {
  const [game, setGame] = useState(null);
  const [planningData, setPlanningData] = useState(null);
  const [networkMap, setNetworkMap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const bootstrapGame = async () => {
      try {
        const map = await gameAPI.getNetworkMap();
        const newGame = await gameAPI.createGame();
        const planning = await gameAPI.getPlanningData(newGame.gameId)

        {/* Just some debugging tools */}
        console.log('MAP', map)
        console.log('GAME', newGame)
        console.log('PLANNING', planning)
        //=================================

        setNetworkMap(map)
        setGame(newGame)
        setPlanningData(planning)
      } catch (err) {
        setErrorMsg(err.message || 'Failed to load game')
      } finally {
        setLoading(false)
      }

    };

    bootstrapGame()
  }, [])

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

  return (
    <Container className="py-5">
      
      {/* Header */}
      <p className="text-uppercase text-muted fw-bold mb-1" style={{ letterSpacing: '1px' }}>
        Phase 01 / 02
      </p>
      <h1 className="display-5 fw-bold mb-4">Game Loaded</h1>
      <h3 className="text-secondary mb-4">
        Study the complete network before moving to the planning phase.
      </h3>
      <Badge bg="primary" pill className="px-3 py-2 shadow-sm fs-6 mb-3">
          Setup ready
      </Badge>


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
              <div className="fs-5">{planningData?.timeLimitSeconds} s</div>
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
                          {(networkMap?.lineStations || [])
                            .filter((ls) => ls.line_id === line.id)
                            .map((ls) => ls.station_name)
                            .join(' — ') || 'No stations available for this line.'
                          }
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

      </Row>
      
    </Container>
  )
}

export default PlayPage