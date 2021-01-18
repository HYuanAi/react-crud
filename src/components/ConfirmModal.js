import React from 'react';
import { Modal, Button, Alert } from 'react-bootstrap';
import JobService from '../shared/job-service';

export class ConfirmModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            deleteError: false
        }
        this.deleteJob = this.deleteJob.bind(this);
    }

    async deleteJob(id) {
        if (id) {
            const res = await JobService.deleteJob(id);
            if (res) {
                this.state.deleteError = !res.status === 200;
                return !this.state.deleteError;
            } else 
                this.state.deleteError = true
        }
    }

    render() {
        return (
            <Modal show={this.props.show} size="sm" centered>
                <Modal.Header>
                    <Modal.Title>
                        Delete Job
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure to delete the job '{this.props.job ? this.props.job.title : ''}'?
                    { this.state.deleteError ? <Alert variant="warning">There is an error deleting the job. Please try again later.</Alert> : ''}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={this.props.onHide}>Cancel</Button>
                    <Button variant="primary" onClick={() => this.deleteJob(this.props.job?.id) && this.props.onHide()}>Delete</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}