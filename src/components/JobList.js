import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Card, Button, Spinner } from 'react-bootstrap';
import { ConfirmModal } from './ConfirmModal';

import JobService from '../shared/job-service';

export class JobList extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            isLoading: false,
            showModal: false,
            currentPage: 1, 
            jobs: [] 
        };
        this.setModalShow = this.setModalShow.bind(this);
        this.loadJobs = this.loadJobs.bind(this);
    }

    setModalShow(show) {
        this.setState({ showModal: show});
    }

    async loadJobs() {
        this.isLoading = true;

        const response = await JobService.retrieveJobs(this.state.currentPage, 10);
        if (response) {
            const data = await response.json();
            this.setState({
                isLoading: false, 
                jobs: data
            })
        }
    }

    async componentDidMount() {
        this.loadJobs();
    }

    render() {
        return (
            <>
                { this.state.isLoading ? 
                    <Spinner animation="border" role="status">
                        <span className="sr-only">Loading...</span>
                    </Spinner> : ''
                }

                <div class="py-5">
                    <>
                        { this.state.jobs.map(job => (
                            <Card key={job.id} className="mb-2">
                                <Card.Body>
                                    <Card.Title>{job.title}</Card.Title>
                                    <Card.Text>
                                        {job.description} <br /> <br />
                                        Expiry date: {job.expiry_date}
                                    </Card.Text>
                                    <LinkContainer to={`/jobs/${job.id}/edit`}>
                                        <Button variant="primary">Edit</Button>
                                    </LinkContainer>
                                    <Button variant="danger" onClick={() => this.setModalShow(true)}>Delete</Button>
                                </Card.Body>
                                <Card.Footer>
                                    <small class='text-muted'>
                                        Job created on: {job.created_at} <br/>
                                        Job last updated on: {job.updated_at}
                                    </small>
                                </Card.Footer>
                            </Card>
                        ))}
                    </>
                </div>
                
                {/* <ConfirmModal
                    show={this.showModal}
                    onHide={() => this.setModalShow(false)}
                ></ConfirmModal> */}
            </>
        )
    }
}