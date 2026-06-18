import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router';
import { Container, Button, Spinner, Alert, Table, Badge } from 'react-bootstrap';
import gameAPI from '../API/gameAPI';
import { AuthContext } from '../context/AuthContext';

function LeaderboardPage() {
  const { user } = useContext(AuthContext);
  const [ranking, setRanking] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRanking = async () => {
      try {
        const data = await gameAPI.getRanking();
        setRanking(data)
      } catch (err) {
        setErrorMsg(err.message || 'Failed to load ranking')
      } finally {
        setLoading(false)
      }
    }

    loadRanking()
  }, [])

  return (
    <Container className="py-5">
      
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <p className="text-uppercase text-muted fw-bold mb-1" style={{ letterSpacing: '1px' }}>
            Race the Rails
          </p>
          <h1 className="display-5 fw-bold mb-0">Leaderboard</h1>
        </div>

        <div className="d-flex gap-2">
          <Button as={Link} to="/home" variant="outline-secondary" className="px-4 rounded-pill shadow-sm">
            Back
          </Button>
          <Button as={Link} to="/play" variant="primary" className="px-4 rounded-pill shadow-sm">
            Play
          </Button>
        </div>
      </div>

      {loading && (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3 text-muted">Loading ranking...</p>
        </div>
      )}
      
      {errorMsg && (
        <Alert variant="danger" className="text-center shadow-sm">
          {errorMsg}
        </Alert>
      )}

      {!loading && !errorMsg && (
        <>
          
          <div className="shadow-sm rounded overflow-hidden">
            <Table hover responsive className="mb-0 bg-white align-middle">
              <thead className="table-light">
                <tr>
                  <th className="py-3 px-4 text-muted">#</th>
                  <th className="py-3 px-4 text-muted">PLAYER</th>
                  <th className="py-3 px-4 text-muted text-end">BEST SCORE</th>
                </tr>
              </thead>
              <tbody>
                {ranking.map((player, index) => {
                  const isCurrentUser = player.username === user?.username
                  
                  return (
                    <tr key={player.username} className={isCurrentUser ? 'table-primary' : ''}>
                      <td className="py-3 px-4 fw-bold">{index + 1}</td>
                      <td className="py-3 px-4">
                        {player.username}
                        {isCurrentUser && (
                          <Badge bg="primary" className="ms-2">You</Badge>
                        )}
                      </td>
                      <td className="py-3 px-4 text-end fw-bold text-primary">
                        {player.best_score}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </Table>
          </div>

          <p className="text-muted text-end mt-3 small">
            Showing best score per player — {ranking.length} player{ranking.length !== 1 ? 's' : ''} ranked
          </p>
        </>
      )}
    </Container>
  )
}

export default LeaderboardPage