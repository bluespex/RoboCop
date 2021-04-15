import React, { Component } from "react";
import Link from "react-router-dom/Link";

//MUI stuff
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";

import { withFirebase } from "./Firebase";

class Navbar extends Component {
  render() {
    return (
      <AppBar>
        <Toolbar className="nav-container">
          <Button color="inherit" component={Link} to="/findMissing">
            Find person
          </Button>
          <Button color="inherit" component={Link} to="/register">
            Register new case
          </Button>
        </Toolbar>
      </AppBar>
    );
  }
}

export default withFirebase(Navbar);
