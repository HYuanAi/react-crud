import React from 'react';
import { Switch, Route, Redirect } from "react-router-dom";
import { Container } from 'react-bootstrap';
import { JobList } from './components/JobList';
import { JobDetails } from './components/JobDetails';
// import { EditJob } from './components/EditJob';

import 'bootstrap/dist/css/bootstrap.min.css';
import "react-datepicker/dist/react-datepicker.css";
import './App.css';

const App = () => (
  <Container>
    <Switch>
      <Route exact path="/">
        <Redirect to="/jobs"></Redirect>
      </Route>
      <Route exact path="/jobs">
        <JobList />
      </Route>
      <Route exact path="/jobs/new">
        <JobDetails />
      </Route>
      {/* <Route exact path="/jobs/{id}/edit">
        <EditJob />
      </Route> */}
    </Switch>
  </Container>
)

export default App;
