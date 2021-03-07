import React, { useState, useEffect } from 'react';
import "../bstyles.scss";
import { Bar, Pie } from "react-chartjs-2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSync } from "@fortawesome/free-solid-svg-icons";
import axios from 'axios';

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
        <div style={{width:"100%", textAlign:"center"}}>
          <progress class="progress is-primary" max="100" style={{width:"100%", marginBottom:"1em"}} />
          <h3><b>Loading statistics...</b></h3>
        </div>
      :
        <div class="tile is-ancestor is-vertical">
          <div class="box tile is-12">
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
              <div class="content" style={{width:"100%"}}>
                <div class="tile is-parent is-vertical">
                  <div class="tile" style={tileTextStyle}>
                    <h2 class="title is-4 level-item">Twilio Call Volume</h2>
                  </div>
                  {/* TODO: Update to use Twilio data once available */}
                  <Bar class="tile"
                    data={{
                      labels: ['1', '2', '3', '4', '5'],
                      datasets: [{
                        label: 'Set Label',
                        data: [12, 19, 3, 5, 2],
                        backgroundColor: '#3e8ed0',
                      }]
                    }}
                    width={graphWidth}
                    height={graphHeight}
                    options={{
                      maintainAspectRatio: false,
                      scales: {
                        yAxes: [{ticks: {suggestedMin: 0}}]
                      }
                    }}
                  />
                  </div>
              </div>
            </div>
            <div class="tile is-6">
              <div class="content" style={{width:"100%"}}>
                <div class="tile is-parent is-vertical">
                  <div class="tile" style={tileTextStyle}>
                    <h2 class="title is-4 level-item">Ticket Statuses</h2>
                  </div>
                  <Pie class="tile"
                    data={{
                      labels: stats ? Object.keys(stats.statuses) : [],
                      datasets: [{
                        label: 'Set Label',
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
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  );
}