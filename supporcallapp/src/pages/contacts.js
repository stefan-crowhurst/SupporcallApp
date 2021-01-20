import React from 'react';
import { Link } from "react-router-dom";
import "../bstyles.scss";

export const Contacts = () => {
  return (
    <div style={{width:"100%"}}>
      <table class="table">
        <thead>
          <tr>
            <th><abbr title="Number">Num</abbr></th>
            <th>Team</th>
            <th><abbr title="Title">Tle</abbr></th>
          </tr>
        </thead>
        <tfoot>
          <tr>
            <th><abbr title="Number">Num</abbr></th>
            <th>Team</th>
            <th><abbr title="Title">Tle</abbr></th>
          </tr>
        </tfoot>
        <tbody>
          <tr>
            <th>1</th>
            <td>Data</td>
            <td>Here</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}