import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Card, Button, Spinner, Pagination, Form } from 'react-bootstrap';
import JobDeleteModal from './JobDeleteModal';

import JobService from '../shared/job-service';

export default class JobList extends React.Component {
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
        this.setPageSize = this.setPageSize.bind(this);
        this.getPaginationItems = this.getPaginationItems.bind(this);
    }

    async setModalShow(show) {
        if (!show) this.loadJobs();
        this.setState({ showModal: show });
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
            });
            if (data.jobs.length === 0 && this.state.currentPage > 1) {
                this.setState({ currentPage: 1 });
                this.loadJobs();
            }
        }
    }

    async setCurrentPage(pageNumber) {
        if (pageNumber > 0) {
            await this.setState({ currentPage: pageNumber });
            this.loadJobs();
        }
    }

    async setPageSize(event) {
        if (event.target.value > 0) {
            await this.setState({ pageSize: event.target.value });
            this.loadJobs();
        }
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
        if (this.state.isLoading) return 
            <Spinner animation="border" role="status">
                <span className="sr-only">Loading...</span>
            </Spinner> 

        const paginationControls = (
            <div className="d-flex justify-content-between">
                    <Form inline>
                        <small className="text-muted ml-auto">Jobs per page: </small>
                        <Form.Control
                            as="select"
                            className="ml-1 my-1 mr-sm-2"
                            size="sm"
                            value={this.state.pageSize}
                            onChange={this.setPageSize}
                            custom
                        >
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="15">15</option>
                            <option value="20">20</option>
                        </Form.Control>
                    </Form>
                    <Pagination size="sm">
                        {this.getPaginationItems(this.state.totalPages, this.state.currentPage)}
                    </Pagination>
                </div>
        );
        
        return (
            <>
                <div className="my-5">
                    <LinkContainer to="/jobs/new">
                        <Button variant="primary" className="mr-2">Add New Job</Button>
                    </LinkContainer>
                </div>

                {paginationControls}

                <div className="py-2">
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
                                    <small className='text-muted'>
                                        Job created on: {job.created_at} <br/>
                                        Job last updated on: {job.updated_at}
                                    </small>
                                </Card.Footer>
                            </Card>
                        ))}
                    </>
                </div>

                {paginationControls}

                <div className="mb-5"></div>
                
                <JobDeleteModal
                    show={this.state.showModal}
                    onHide={() => this.setModalShow(false)}
                    job={this.state.selectedJob}
                ></JobDeleteModal>
            </>
        )
    }
}