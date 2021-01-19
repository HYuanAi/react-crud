import React from 'react';
import { Link, Redirect, withRouter } from 'react-router-dom';
import { Form, Jumbotron, Alert, Button } from 'react-bootstrap';
import DatePicker from 'react-datepicker';

import JobService from '../shared/job-service';

export const detailMode = {
    NEW: "new", 
    EDIT: "edit"
}

class JobDetails extends React.Component {

    constructor(props) {
        super(props);
        this.state = { 
            job: {
                title: '',
                description: '',
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
            ...this.state.job,
            title: event.target.value
        }});
    }

    setDescription(event) {
        this.setState({ job: {
            ...this.state.job,
            description: event.target.value
        }});
    }

    setExpiryDate(date) {
        this.setState({ job: {
            ...this.state.job,
            expiry_date: date
        }});
    }

    handleSubmit(event) {
        event.preventDefault();
        
        // Check validity 
        const form = event.currentTarget;
        if (form.checkValidity()) {
            if (this.props.mode === detailMode.NEW) 
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
            else if (this.props.mode === detailMode.EDIT)
                JobService.editJob(this.state.job)
                    .then(res => { 
                        if (res.status === 200)
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

    async componentDidMount() {
        if (this.props.mode === detailMode.EDIT) {
            // Load the job to edit 
            const id = this.props.match.params.id;
            
            const response = await JobService.retrieveJob(id);
            if (response) {
                const data = await response.json();
                data.expiry_date = new Date(data.expiry_date);
                this.setState({
                    job: data
                });
            }
        }
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
                    <div className="mb-3">
                        <Link to="/jobs">Back</Link>
                    </div>
                    <h3 className="mb-2">{ this.props.mode === detailMode.NEW ? 'Add New Job' : 'Edit Job'}</h3>
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
                        { this.props.mode === detailMode.NEW ? 'Create' : 'Save Changes'}
                        </Button>
                    </Form>
                </Jumbotron>
                
            </>
        )
    }
}

export default withRouter(JobDetails);