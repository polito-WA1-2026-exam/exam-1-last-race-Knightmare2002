import { useState, useEffect, useRef } from 'react';
import { Container, Card, Button, Badge, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router';

function ExecutionPage(props) {
    const submitResult = props.submitResult
    const getStationName = props.getStationName
    const onReplay = props.onReplay
    const game = props.game
    const selectedSegments = props.selectedSegments
    const routeStationIds = props.routeStationIds
    const onCreateNew = props.onCreateNew

    const navigate = useNavigate()

    const [executionStarted, setExecutionStarted] = useState(false);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);

    // Automatic scrolling
    const bottomRef = useRef(null)

    useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [currentStepIndex, executionStarted])

    if (!submitResult) return null

    let failureReason = submitResult.reason || 'Invalid or incomplete route.'
    if (!submitResult.valid) {
        if (selectedSegments.length < 3) {
        failureReason = "You must select at least 3 segments (4 stations) to complete a valid route."
        } else if (!routeStationIds || routeStationIds.length === 0 || routeStationIds[0] !== game?.startStation?.id) {
        failureReason = "Your route does not start at the correct initial station."
        } else if (routeStationIds[routeStationIds.length - 1] !== game?.destinationStation?.id) {
        failureReason = "Your route does not reach the required destination station."
        }
    }    

    const totalSteps = submitResult.steps.length
    const isFinished = currentStepIndex >= totalSteps

    const handleStartExecution = () => {
    setExecutionStarted(true);
    setCurrentStepIndex(0); 
    }

    const handleNextStep = () => {
    setCurrentStepIndex((idx) => idx + 1);
    }

    return (
        <Container className="py-5">
            {/* Header */}
            <Container className="px-0 mb-4">
                <p className="text-uppercase text-muted fw-bold mb-1" style={{ letterSpacing: '1px' }}>
                    Phase 03 / 04
                </p>
                <h1 className="display-5 fw-bold mb-4">Game Ended</h1>
                
                <h3 className="text-secondary mb-4">
                    {submitResult.valid 
                        ? "Discover what happened in your planned route."
                        : "Your route failed the validation checks."
                    }
                </h3>

                <Badge 
                    bg={submitResult.valid ? "success" : "danger"} 
                    pill 
                    className="px-3 py-2 shadow-sm fs-6 mb-3"
                >
                    Execution and Results
                </Badge>
            </Container>


            {/* Invalid Route */}
            {!submitResult.valid ? (
                <Card className="mt-4 shadow-sm border-0 bg-light border-top border-5 border-danger">
                    <Card.Body className="p-5 text-center">
                        <Card.Title className="text-danger fw-bold mb-4 fs-2">Mission Failed</Card.Title>
                        
                        <p className="fs-5 text-muted mb-4">
                            {failureReason}
                        </p>

                        <Alert variant="danger" className="py-4 shadow-sm mb-4">
                            <h3 className="mb-2">Final Score</h3>
                            <h1 className="display-1 fw-bold text-danger mb-0">0</h1>
                        </Alert>

                        <div className="d-flex justify-content-center gap-3 flex-wrap">
                            <Button variant="outline-danger" size="lg" className="px-4 rounded-pill shadow-sm fw-bold" onClick={onReplay}>
                                Play Again
                            </Button>

                            <Button variant="danger" size="lg" className="px-4 rounded-pill shadow-sm fw-bold" onClick={onCreateNew}>
                                Create New Game
                            </Button>

                            <Button variant="dark" size="lg" className="px-4 rounded-pill shadow-sm fw-bold" onClick={() => navigate('/leaderboard')}>
                                Leaderboard
                            </Button>
                        </div>
                    </Card.Body>
                </Card>
            ) : (

                /* Valid route */
            <>
                {!executionStarted ? (
                <Card className="shadow-sm border-0 bg-light text-center py-5">
                    <Card.Body>
                        <p className="fs-5 mb-4">
                            The submitted route is valid. Ready to execute your journey?
                        </p>
                        <Button variant="primary" size="lg" className="px-5 rounded-pill shadow-sm" onClick={handleStartExecution}>
                            Start Execution
                        </Button>
                    </Card.Body>
                </Card>
                ) : (
                <>
                    {/* Execution */}
                    <div className="d-flex flex-column gap-4">
                    {submitResult.steps.slice(0, currentStepIndex + 1).map((step) => {
                        if (!step) return null;
                        
                        return (
                        <Card key={step.stepIndex} className="shadow-sm border-0 bg-light">
                            <Card.Body className="p-4">
                                <h5 className="mb-3 text-secondary">Step {step.stepIndex}</h5>
                                
                                <div className="d-flex align-items-center gap-3 mb-3 p-3 rounded shadow-sm border">
                                    <span className="fs-5 fw-bold">{getStationName(step.fromStationId)}</span>
                                    <i className="bi bi-arrow-right-circle-fill text-primary fs-4"></i>
                                    <span className="fs-5 fw-bold">{getStationName(step.toStationId)}</span>
                                </div>

                                <div className="mb-3">
                                    <p className="fs-5 mb-2">
                                    <strong>Event:</strong> <em>{step.event.description}</em>
                                    </p>
                                    <div className="d-flex align-items-center gap-2">
                                        <span className="fs-6">Effect:</span>
                                        <Badge bg={step.event.effect >= 0 ? "success" : "danger"} className="fs-6 px-3 py-2">
                                            {step.event.effect >= 0 ? '+' : ''}{step.event.effect} Coins
                                        </Badge>
                                    </div>
                                </div>

                                <div className="text-end border-top pt-3 mt-3">
                                    <p className="mb-0 fs-5">
                                    Balance: <strong className={step.coinsAfterStep >= 0 ? "text-success" : "text-danger"}>{step.coinsAfterStep} Coins</strong>
                                    </p>
                                </div>
                            </Card.Body>
                        </Card>
                        )
                    })}
                    </div>

                    {/* Next step */}
                    {!isFinished && (
                    <div className="text-center mt-5">
                        <Button variant="primary" size="lg" className="px-5 shadow-sm fw-bold rounded-pill" onClick={handleNextStep}>
                        {currentStepIndex === totalSteps - 1 ? 'Show Final Result' : 'Next Step'}
                        </Button>
                    </div>
                    )}

                    {/* Result */}
                    {isFinished && (
                    <Card className="mt-5 shadow-sm border-0 bg-light border-top border-5 border-success">
                        <Card.Body className="p-5 text-center">
                            <Card.Title className="text-primary fw-bold mb-4 fs-2">Mission Complete</Card.Title>
                            
                            <Alert variant="success" className="py-4 shadow-sm mb-4">
                                <h3 className="mb-2">Final Score</h3>
                                <h1 className="display-1 fw-bold text-success mb-0">{submitResult.finalScore}</h1>
                            </Alert>

                            <div className="d-flex justify-content-center gap-3 flex-wrap">
                                <Button variant="outline-success" size="lg" className="px-4 rounded-pill shadow-sm fw-bold" onClick={onReplay}>
                                    Play Again
                                </Button>

                                <Button variant="success" size="lg" className="px-4 rounded-pill shadow-sm fw-bold" onClick={onCreateNew}>
                                    Create New Game
                                </Button>

                                <Button variant="dark" size="lg" className="px-4 rounded-pill shadow-sm fw-bold" onClick={() => navigate('/leaderboard')}>
                                    Leaderboard
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                    )}
                    
                    {/* Automatic scrolling */}
                    <div ref={bottomRef} style={{ height: '50px' }}></div>
                </>
                )}
            </>
            )}

        </Container>
    )
}

export default ExecutionPage