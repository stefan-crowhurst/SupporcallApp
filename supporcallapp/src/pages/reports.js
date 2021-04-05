import React, { useState, useEffect } from 'react';
import "../bstyles.scss";
import { Bar, Pie } from "react-chartjs-2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSync } from "@fortawesome/free-solid-svg-icons";
import axios from 'axios';

/**
 * Show a range of reports on the state of the system in a dashboard
 * 
 * @returns Reports dashboard page
 */
export const Reports = () => {
  var [isLoading, setIsLoading] = useState(false);
  var [stats, setStats] = useState(null);
  var graphWidth = 100;
  var graphHeight = 50;
  var tileTextStyle = {justifyContent:"center", alignItems:"center"};

  useEffect(() => {
    refreshData().then(() => setIsLoading(false));
  }, []);

  async function refreshData() {
    setIsLoading(true);
    await axios.get("https://supporcallapi.azurewebsites.net/api/Stats/false").then((r) => {
      setStats(r.data);
    });
  };

  return (
    <div class="box" style={{width:"100%"}}>
      <div class="level">
        <div class="level-left">
          <h2 class="title is-3 level-item">Usage Reports</h2>
        </div>
        <div class="level-right">
          <button class="button is-rounded is-light level-item" onClick={async (e) => {
            e.preventDefault(); // prevent page reload
            refreshData().then(() => setIsLoading(false));
          }}>
            <span class="icon"><FontAwesomeIcon icon={faSync} /></span>
          </button>
        </div>
      </div>
      {isLoading ?
        // Show loading bar
        <div style={{width:"100%", textAlign:"center"}}>
          <progress class="progress is-primary" max="100" style={{width:"100%", marginBottom:"1em"}} />
          <h3><b>Loading statistics...</b></h3>
        </div>
      :
        // Show stats
        <div class="tile is-ancestor is-vertical">
          <div class="box tile is-12">
            {/* Banner of basic numeric statistics */}
            <div class="level has-text-centered" style={{width:"100%"}}>
              <div class="level-item">
                <div class="tile is-parent is-vertical">
                  <div class="tile" style={tileTextStyle}>
                    <span class="title is-3">{stats && stats.loggedNums ? stats.loggedNums.TicketsToday : "XX"}</span>
                  </div>
                  <div class="tile" style={tileTextStyle}>
                    Tickets logged today
                  </div>
                </div>
              </div>
              <div class="level-item">
                <div class="tile is-parent is-vertical">
                  <div class="tile" style={tileTextStyle}>
                    <span class="title is-3">{stats && stats.loggedNums ? stats.loggedNums.TicketsWeek : "XX"}</span>
                  </div>
                  <div class="tile" style={tileTextStyle}>
                    Tickets logged this week
                  </div>
                </div>
              </div>
              <div class="level-item">
                <div class="tile is-parent is-vertical">
                  <div class="tile" style={tileTextStyle}>
                    <span class="title is-3">{stats && stats.loggedNums ? stats.loggedNums.TicketsMonth : "XX"}</span>
                  </div>
                  <div class="tile" style={tileTextStyle}>
                    Tickets logged this month
                  </div>
                </div>
              </div>
              <div class="level-item">
                <div class="tile is-parent is-vertical">
                  <div class="tile" style={tileTextStyle}>
                    <span class="title is-3">{stats && stats.loggedNums ? stats.loggedNums.RepliesToday : "XX"}</span>
                  </div>
                  <div class="tile" style={tileTextStyle}>
                    Replies today
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="box tile is-parent is-12">
            <div class="tile is-6" style={{marginBottom:0}}>
              {/* Number of calls per day chart */}
              <div class="content" style={{width:"100%"}}>
                <div class="tile is-parent is-vertical">
                  <div class="tile" style={tileTextStyle}>
                    <h2 class="title is-4 level-item">Twilio Call Volume Per Day</h2>
                  </div>
                  {/* This is a bad way of checking if there have been no calls, but it was the only way I could get it to work */}
                  {stats && (stats.twilioCalls[Object.keys(stats.twilioCalls)[0]] !== 0 || stats.twilioCalls[Object.keys(stats.twilioCalls)[1]] !== 0 || stats.twilioCalls[Object.keys(stats.twilioCalls)[2]] !== 0 || stats.twilioCalls[Object.keys(stats.twilioCalls)[3]] !== 0 || stats.twilioCalls[Object.keys(stats.twilioCalls)[4]] !== 0 || stats.twilioCalls[Object.keys(stats.twilioCalls)[5]] !== 0 || stats.twilioCalls[Object.keys(stats.twilioCalls)[6]] !== 0 || stats.twilioCalls[Object.keys(stats.twilioCalls)[7]] !== 0) ?
                    <Bar class="tile"
                      data={{
                        labels: stats ? Object.keys(stats.twilioCalls).reverse() : [],
                        datasets: [{
                          label: "Num of calls",
                          data: stats ? Object.values(stats.twilioCalls).reverse() : [],
                          backgroundColor: '#3e8ed0',
                        }]
                      }}
                      width={graphWidth}
                      height={graphHeight}
                      options={{
                        maintainAspectRatio: false,
                        scales: {
                          yAxes: [{ticks: {suggestedMin: 0}}] // make the y axis start at 0
                        }
                      }}
                    />
                  :
                    // Show no data
                    <div class="notification is-warning"><b>No calls made in the last week</b></div>
                  }
                  </div>
              </div>
            </div>
            <div class="tile is-6">
              {/* Ticket status breakdown chart */}
              <div class="content" style={{width:"100%"}}>
                <div class="tile is-parent is-vertical">
                  <div class="tile" style={tileTextStyle}>
                    <h2 class="title is-4 level-item">Current Ticket Statuses</h2>
                  </div>
                  {/* This is a bad way of checking if the values are all 0, but it was the only way I could get it to work */}
                  {stats && (stats.statuses["Open"] !== 0 || stats.statuses["In Need Of Action"] !== 0 || stats.statuses["Actioned"] !== 0 || stats.statuses["Solved"] !== 0) ?
                    <Pie class="tile"
                      data={{
                        labels: stats ? Object.keys(stats.statuses) : [],
                        datasets: [{
                          data: stats ? Object.values(stats.statuses) : [],
                          backgroundColor: ['#D90000', "#ffe08a", "#09a2e3", "#48c78e"],
                        }]
                      }}
                      width={graphWidth}
                      height={graphHeight}
                      options={{
                        maintainAspectRatio: false
                      }}
                    />
                  :
                    // Show no data
                    <div class="notification is-warning"><b>No ticket status data found</b></div>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  );
}