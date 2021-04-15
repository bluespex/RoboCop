import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import { Button, Typography } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import { withStyles } from "@material-ui/core/styles";
import { withFirebase } from "./Firebase";
import { withRouter } from "react-router-dom";
import Link from "react-router-dom/Link";
import Divider from "@material-ui/core/Divider";
import TextField from "@material-ui/core/TextField";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import Avatar from "@material-ui/core/Avatar";
import Box from "@material-ui/core/Box";

const fs = require("browserify-fs");

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const useStyles = {
  box: {
    "font-size": "20px",
    padding: "10px",
    fontFamily: "Comic Sans",
  },
  paper: {
    marginTop: "8px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  gg: {
    "font-size": "30px",
    padding: "10px",
    fontFamily: "Comic Sans",
  },
  avatar: {
    margin: "4px",
    backgroundColor: "#009688",
  },
  image: {
    marginTop: "30px",
    width: "200px",
    height: "auto",
    "object-fit": "cover",
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: "16px",
  },
  submit: {
    margin: "16px 0px 8px",
  },
};

const INITIAL_STATE = {
  id: "",
  email: "prajjwal@gmail.com",
  firstName: "",
  lastName: "",
  mobile: "1234567890",
  age: "20",
  address: "",
  image: null,
  error: null,
};

class RegisterNewCaseBase extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  onSubmit = (event) => {
    event.preventDefault();
    const id = Date.now();
    const newMissing = {
      email: this.state.email,
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      mobile: this.state.mobile,
      age: this.state.age,
      address: this.state.address,
    };

    this.props.firebase.db.doc(`/missing/${id}`).set(newMissing);
    for (const key in this.state.image) {
      if (this.state.image.hasOwnProperty.call(this.state.image, key)) {
        const element = this.state.image[key];
        const uploadTask = this.props.firebase.storage
          .ref(`/images/${element.name}`)
          .put(element);
        //initiates the firebase side uploading
        uploadTask.on(
          "state_changed",
          (snapShot) => {
            //takes a snap shot of the process as it is happening
            console.log(snapShot);
          },
          (err) => {
            //catches the errors
            console.log(err);
          },
          () => {
            // gets the functions from storage refences the image storage in firebase by the children
            // gets the download url then sets the image from firebase as the value for the imgUrl key:
            this.props.firebase.storage
              .ref("images")
              .child(element.name)
              .getDownloadURL()
              .then((fireBaseUrl) => {
                console.log(fireBaseUrl);
                const ID = id.toString();
                this.props.firebase.db
                  .collection("missing")
                  .doc(ID)
                  .collection("images")
                  .add({ url: fireBaseUrl, when: new Date() });
              });
          }
        );
      }
    }
    alert(`${this.state.firstName} registered`);
  };
  onChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };
  imageChange = (event) => {
    this.setState({ image: event.target.files });
  };
  render() {
    const { classes } = this.props;
    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Typography component="h1" variant="h5">
            Register New Case
          </Typography>
          <form className={classes.form} noValidate onSubmit={this.onSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="fname"
                  name="firstName"
                  variant="outlined"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                  onChange={this.onChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="lname"
                  onChange={this.onChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  onChange={this.onChange}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="mobile"
                  label="Mobile Number"
                  name="mobile"
                  autoComplete="mobile"
                  onChange={this.onChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="age"
                  label="Age"
                  name="age"
                  autoComplete="Age"
                  onChange={this.onChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="address"
                  label="Address"
                  name="address"
                  autoComplete="address"
                  onChange={this.onChange}
                />
              </Grid>
              <input
                type="file"
                onChange={this.imageChange}
                className={classes.box}
                multiple
              ></input>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Submit
            </Button>
          </form>
        </div>
        <Box mt={5}>
          <Copyright />
        </Box>
      </Container>
    );
  }
}

const RegisterNewCase = withFirebase(
  withStyles(useStyles)(RegisterNewCaseBase)
);

export default RegisterNewCase;
