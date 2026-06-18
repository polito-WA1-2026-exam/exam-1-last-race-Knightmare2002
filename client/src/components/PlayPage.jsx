import { useEffect, useState } from 'react';
import { Container, Spinner, Alert, Card, Row, Col } from 'react-bootstrap';
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
    );
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

      {/* Placeholder */}
      <Card className="border-0 shadow-sm text-center p-5 text-muted" style={{ borderStyle: 'dashed !important', backgroundColor: '#fdfdfd' }}>
        <Card.Body>
          <p className="mb-0">
            <em>Setup and planning UI will be mounted here in the next step.</em>
          </p>
        </Card.Body>
      </Card>
      
    </Container>
  )
}

export default PlayPage