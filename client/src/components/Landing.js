import React, { Component } from "react";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { Box } from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";

export default class Landing extends Component {
  render() {
    return (
      <div>
        <Paper className="image" elevation={3}>
          <h1>Robo Cop</h1>

          <h4>A web tool to help find missing people using AI</h4>
          <br />
          <br />
          <br />
          <br />
        </Paper>

        <h1>About Us</h1>
        <h2>Piyush Shandilya 2K18/IT/082</h2>
        <h2>Priybhanu Yadav 2K18/IT/090</h2>
      </div>
    );
  }
}
