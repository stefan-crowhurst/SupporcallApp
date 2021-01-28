import React, { useEffect, useState } from 'react';
import "../bstyles.scss";
import axios from "axios";
import moment from "moment";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faPlus, faSync, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Route, Switch, useRouteMatch, Link } from 'react-router-dom';
import { TicketTable } from '../components/tickettable';
import { TicketCreateForm } from '../components/ticketcreateform';
import { TicketView } from '../components/ticketview';

export const Tickets = () => {
  let match = useRouteMatch();

  return (
    <div style={{width:"100%"}}>
      <div class="table-container box" style={{width:"100%"}}>
        <Switch>
          <Route path={match.url + "/create"}>
            <TicketCreateForm />
          </Route>
          <Route path={match.url + "/:ticketid"}>
            <TicketView />
          </Route>
          <Route path={match.url}>
            <TicketTable />
          </Route>
        </Switch>
      </div>
    </div>
  );
}