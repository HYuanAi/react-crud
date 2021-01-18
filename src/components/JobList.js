import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Card, Button, Spinner, Pagination } from 'react-bootstrap';
import { ConfirmModal } from './ConfirmModal';

import JobService from '../shared/job-service';

export class JobList extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            isLoading: false,
            showModal: false,
            totalPages: 1,
            currentPage: 1, 
            pageSize: 5, 
            selectedJob: undefined,
            jobs: [] 
        };
        this.setModalShow = this.setModalShow.bind(this);
        this.deleteJob = this.deleteJob.bind(this);
        this.loadJobs = this.loadJobs.bind(this);
        this.setCurrentPage = this.setCurrentPage.bind(this);
        this.getPaginationItems = this.getPaginationItems.bind(this);
    }

    async setModalShow(show) {
        if (show === false) 
            await this.loadJobs();
        this.setState({ showModal: show});
    }

    deleteJob(job) {
        this.setState({ selectedJob: job })
        this.setModalShow(true);
    }

    async loadJobs() {
        this.isLoading = true;

        const response = await JobService.retrieveJobs(this.state.currentPage, this.state.pageSize);
        if (response) {
            const data = await response.json();
            this.setState({
                isLoading: false,
                totalPages: Math.ceil(data.totalCount / this.state.pageSize),
                jobs: data.jobs
            })
        }
    }

    async setCurrentPage(pageNumber) {
        await this.setState({ currentPage: pageNumber });
        this.loadJobs();
    }

    getPaginationItems(totalPages, currentPage) {
        const paginationItems = [];
        for (let number = 1; number <= totalPages; number++) {
            paginationItems.push(
                <Pagination.Item key={number} active={number === currentPage} onClick={() => this.setCurrentPage(number)}>
                    {number}
                </Pagination.Item>
            );
        }
        return paginationItems;
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
                                        <Button variant="primary" className="mr-2">Edit</Button>
                                    </LinkContainer>
                                    <Button variant="danger" onClick={() => this.deleteJob(job)}>Delete</Button>
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

                <div>
                    <Pagination size="sm" className="float-right">
                        {this.getPaginationItems(this.state.totalPages, this.state.currentPage)}
                    </Pagination>
                </div>
                
                <ConfirmModal
                    show={this.state.showModal}
                    onHide={() => this.setModalShow(false)}
                    job={this.state.selectedJob}
                ></ConfirmModal>
            </>
        )
    }
}