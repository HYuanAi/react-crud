import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Form, Jumbotron, Alert, Button } from 'react-bootstrap';
import DatePicker from 'react-datepicker';

import JobService from '../shared/job-service';

export class JobDetails extends React.Component {

    constructor(props) {
        super(props);
        this.state = { 
            job: {
                title: undefined,
                description: undefined,
                expiry_date: undefined
            },
            validated: false,
            success: false,
            error: false
        };
        this.setTitle = this.setTitle.bind(this);
        this.setDescription = this.setDescription.bind(this);
        this.setExpiryDate = this.setExpiryDate.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    setTitle(event) {
        this.setState({ job: {
            title: event.target.value, 
            description: this.state.job.description, 
            expiry_date: this.state.job.expiry_date
        }});
    }

    setDescription(event) {
        this.setState({ job: {
            title: this.state.job.title, 
            description: event.target.value, 
            expiry_date: this.state.job.expiry_date
        }});
    }

    setExpiryDate(date) {
        this.setState({ job: {
            title: this.state.job.title, 
            description: this.state.job.description, 
            expiry_date: date
        }});
    }

    handleSubmit(event) {
        event.preventDefault();
        
        // Check validity 
        const form = event.currentTarget;
        if (form.checkValidity()) {
            JobService.createJob(this.state.job)
                .then(res => {
                    if (res.status === 201) 
                        this.setState({
                            success: true, 
                            error: false
                        })
                    else
                        this.setState({ error: true })
                })
                .catch(err => this.setState({ error: true }));
        }

        this.setState({ validated: true });
    }

    render() {
        const DatepickerInput = React.forwardRef(({ value, onClick }, ref) => (
            <Form.Control type="text" value={value} onChange={this.setExpiryDate} onClick={onClick} />
        ));

        if (this.state.success) {
            return <Redirect to="/jobs" />
        }

        return (
            <>  
                <Jumbotron className="mt-5">
                    <div className="mb-5">
                        <Link to="/jobs">Back</Link>
                    </div>
                    <h3 className="mb-2">Add New Job</h3>
                    { this.state.error ? <Alert variant="warning">There is an error creating the job. Please try again later.</Alert> : ''}
                    <Form noValidate validated={this.state.validated} onSubmit={this.handleSubmit}>
                        <Form.Group controlId="jobTitle">
                            <Form.Label>Job Title <span className="text-danger">*</span></Form.Label>
                            <Form.Control type="text" value={this.state.job.title} onChange={this.setTitle} required />
                            <Form.Control.Feedback type="invalid">Please enter a job title.</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="job">
                            <Form.Label>Description</Form.Label>
                            <Form.Control as="textarea" rows={4} value={this.state.job.description} onChange={this.setDescription} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Expiry Date</Form.Label><br/>
                            <DatePicker 
                                selected={this.state.job.expiry_date} 
                                onChange={this.setExpiryDate} 
                                minDate={new Date()}
                                customInput={<DatepickerInput />}/>
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Create
                        </Button>
                    </Form>
                </Jumbotron>
                
            </>
        )
    }
}