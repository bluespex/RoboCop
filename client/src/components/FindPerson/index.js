import React, { Component } from "react";
import { Button, Typography } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import { withStyles } from "@material-ui/core/styles";
import { withFirebase } from "../Firebase";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";

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
  btn: {
    margin: "16px 0px 8px",
    width: "200px",
  },
};
const INITIAL_STATE = {
  id: "",
  email: null,
  firstName: null,
  lastName: null,
  mobile: null,
  age: "20",
  address: "",
  image: null,
  imageUrl: null,
  error: null,
};

class FindPersonBase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...INITIAL_STATE,
    };
  }
  onSubmit = (event) => {
    event.preventDefault();
    console.log(this.state);

    const uploadTask = this.props.firebase.storage
      .ref(`/images/${this.state.image.name}`)
      .put(this.state.image);
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
          .child(this.state.image.name)
          .getDownloadURL()
          .then((fireBaseUrl) => {
            console.log(fireBaseUrl);
            this.state.image = fireBaseUrl;
            this.setState({ imageUrl: fireBaseUrl });

            const requestOptions = {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ url: this.state.imageUrl }),
            };
            fetch("http://localhost:5000/uploader", requestOptions)
              .then((response) => response.json())
              .then((data) => {
                console.log(data);
                this.props.firebase.db
                  .doc(`/missing/${data.id}`)
                  .get()
                  .then((doc) => {
                    if (!doc.exists) {
                      alert("Not found");
                    }
                    this.setState({ ...doc.data() });
                    console.log(this.state);
                  });
              })
              .catch((err) => console.log(err));
          });
      }
    );
  };

  imageChange = (event) => {
    const imageFile = event.target.files[0];
    this.setState({ image: imageFile });
  };
  render() {
    const { classes } = this.props;
    return (
      <div>
        {this.state.firstName === null ? (
          <Container component="main" maxWidth="xs">
            <form onSubmit={this.onSubmit} className={classes.form}>
              <input
                type="file"
                onChange={this.imageChange}
                className={classes.box}
              ></input>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Upload
              </Button>
            </form>
          </Container>
        ) : (
          <Grid container spacing={4} justify="center">
            <Grid item xs={6} sm={4}>
              <Paper className={classes.paper}>
                <img className={classes.image} src={this.state.imageUrl}></img>
                <Typography className={classes.gg}>
                  {this.state.firstName} {this.state.lastName}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={5} sm={7}>
              <Paper className={classes.paper}>
                <Grid
                  container
                  direction="row"
                  justify="center"
                  alignItems="center"
                >
                  <Typography gutterBottom={true}></Typography>
                  <Grid item xs={3}>
                    <Typography gutterBottom={true}></Typography>
                    <Typography
                      variant="h5"
                      color="primary"
                      gutterBottom={true}
                    >
                      <b>First Name</b>
                    </Typography>
                    <Divider variant="middle" />
                    <Typography gutterBottom={true}></Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography gutterBottom={true}></Typography>
                    <Typography variant="h5" gutterBottom={true}>
                      <b>:</b>
                    </Typography>
                    <Typography gutterBottom={true}></Typography>
                  </Grid>

                  <Grid item xs={3}>
                    <Typography gutterBottom={true}></Typography>
                    <Typography
                      variant="h5"
                      color="primary"
                      gutterBottom={true}
                    >
                      {this.state.firstName}
                    </Typography>
                    <Divider variant="middle" />
                    <Typography gutterBottom={true}></Typography>
                  </Grid>
                </Grid>
                <Grid
                  container
                  direction="row"
                  justify="center"
                  alignItems="center"
                >
                  <Grid item xs={3} p={10}>
                    <Typography
                      variant="h5"
                      color="secondary"
                      gutterBottom={true}
                    >
                      <b>Last Name</b>
                    </Typography>
                    <Divider variant="middle" />
                    <Typography gutterBottom={true}></Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography variant="h5" gutterBottom={true}>
                      <b>:</b>
                    </Typography>
                    <Typography gutterBottom={true}></Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography
                      variant="h5"
                      color="secondary"
                      gutterBottom={true}
                    >
                      {" "}
                      {this.state.lastName}
                    </Typography>
                    <Divider variant="middle" />
                    <Typography gutterBottom={true}></Typography>
                  </Grid>
                </Grid>
                <Grid
                  container
                  direction="row"
                  justify="center"
                  alignItems="center"
                >
                  <Grid item xs={3}>
                    <Typography
                      variant="h5"
                      color="primary"
                      gutterBottom={true}
                    >
                      <b>Email</b>
                    </Typography>
                    <Divider variant="middle" />
                    <Typography gutterBottom={true}></Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography variant="h5" gutterBottom={true}>
                      <b>:</b>
                    </Typography>
                    <Typography gutterBottom={true}></Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography
                      variant="h5"
                      color="primary"
                      gutterBottom={true}
                    >
                      {this.state.email}
                    </Typography>
                    <Divider variant="middle" />
                    <Typography gutterBottom={true}></Typography>
                  </Grid>
                </Grid>
                <Grid
                  container
                  direction="row"
                  justify="center"
                  alignItems="center"
                >
                  <Grid item xs={3}>
                    <Typography
                      variant="h5"
                      color="secondary"
                      gutterBottom={true}
                    >
                      <b>Mobile Number</b>
                    </Typography>
                    <Divider variant="middle" />
                    <Typography gutterBottom={true}></Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography variant="h5" gutterBottom="true">
                      <b>:</b>
                    </Typography>
                    <Typography gutterBottom={true}></Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography
                      variant="h5"
                      color="secondary"
                      gutterBottom="true"
                    >
                      {this.state.mobile}
                    </Typography>
                    <Divider variant="middle" />
                    <Typography gutterBottom={true}></Typography>
                  </Grid>
                </Grid>
                <Grid
                  container
                  direction="row"
                  justify="center"
                  alignItems="center"
                >
                  <Grid item xs={3}>
                    <Typography
                      variant="h5"
                      color="primary"
                      gutterBottom={true}
                    >
                      <b>Address</b>
                    </Typography>
                    <Divider variant="middle" />
                  </Grid>
                  <Grid item xs={3}>
                    <Typography variant="h5" gutterBottom={true}>
                      <b>:</b>
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography
                      variant="h5"
                      color="primary"
                      gutterBottom={true}
                    >
                      {this.state.address}
                    </Typography>
                    <Divider variant="middle" />
                  </Grid>
                </Grid>

                <Grid
                  container
                  direction="row"
                  justify="center"
                  alignItems="center"
                >
                  <Grid item xs={3}>
                    <Typography
                      variant="h5"
                      color="secondary"
                      gutterBottom={true}
                    >
                      <b>Age</b>
                    </Typography>

                    <Typography gutterBottom={true}></Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography variant="h5" gutterBottom={true}>
                      <b>:</b>
                    </Typography>
                    <Typography gutterBottom={true}></Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography
                      variant="h5"
                      color="primary"
                      gutterBottom={true}
                    >
                      {this.state.age}
                    </Typography>
                    <Divider variant="middle" />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            <Button
              onClick={() => {
                this.setState({ ...INITIAL_STATE });
              }}
              fullWidth
              variant="contained"
              color="primary"
              className={classes.btn}
            >
              Reset
            </Button>
          </Grid>
        )}
      </div>
    );
  }
}

const FindPerson = withFirebase(withStyles(useStyles)(FindPersonBase));
export default FindPerson;
