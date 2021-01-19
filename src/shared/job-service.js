import { format } from 'date-fns';

const JOB_BASE_URL = "http://localhost:3000/jobs"

function createJob(newJob) {
    const url = JOB_BASE_URL;
    return fetch(url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            title: newJob.title,
            description: newJob.description,
            expiry_date: format(newJob.expiry_date, 'yyyy-MM-dd') 
        })
    })
}

function retrieveJobs(pageNumber, pageSize) {
    const url = JOB_BASE_URL + `?page[number]=${pageNumber}&page[size]=${pageSize}`;
    
    return fetch(url, {
        method: "GET"
    });
}

function retrieveJob(id) {
    const url = JOB_BASE_URL + `/${id}/`;
    return fetch(url, {
        method: "GET"
    });
}

function editJob(newJob) {
    const url = JOB_BASE_URL + `/${newJob.id}/`;
    return fetch(url, {
        method: "POST",
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            title: newJob.title,
            description: newJob.description,
            expiry_date: format(newJob.expiry_date, 'yyyy-MM-dd') 
        })
    });
}

function deleteJob(id) {
    const url = JOB_BASE_URL + `/${id}/`;
    return fetch(url, {
        method: "DELETE"
    });
}

const jobService = { 
    createJob, 
    retrieveJobs, 
    retrieveJob, 
    editJob, 
    deleteJob
};

export default jobService;