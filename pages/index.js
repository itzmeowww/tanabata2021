import * as React from "react";

import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import LoadingButton from "@material-ui/lab/LoadingButton";

import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";

import TextField from "@material-ui/core/TextField";
import FormHelperText from "@material-ui/core/FormHelperText";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormLabel from "@material-ui/core/FormLabel";

import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";

import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/core/Alert";

import CircularProgress from "@material-ui/core/CircularProgress";

import NextLink from "next/link";

import firebase from "../src/firebase/initFirebase";
import { useCollection } from "react-firebase-hooks/firestore";

import { useState, useEffect, useRef } from "react";

export default function Index() {
  const cardColors = ["#FEFEFE", "#FAEBE0", "#B5CDA3", "#C1AC95"];
  const textColors = ["#FF8474", "#FF8474", "#FF8474", "#FF8474"];

  const [wishList, loadingWishList, wishListError] = useCollection(
    firebase.firestore().collection("wishes2021")
  );

  const [readyToAdd, setReadyToAdd] = React.useState(false);
  const [scrollLeft, setScrollLeft] = React.useState(0);
  const [canvasLeft, setCanvasLeft] = React.useState(0);
  const [canvasTop, setCanvasTop] = React.useState(0);

  const handleOnScroll = (e) => {
    setScrollLeft(e.target.scrollLeft);
  };
  const handleCanvas = (canvas) => {
    const ctx = canvas.getContext("2d");
  };

  const [cardWish, setCardWish] = useState({});
  const handleCanvasClick = (event) => {
    const posX = event.pageX + scrollLeft - canvasLeft;
    const posY = event.pageY - canvasTop;
    if (readyToAdd) {
      const pos = {
        x: posX,
        y: posY,
      };
      let overlap = false;
      wishList.forEach((doc) => {
        if (
          doc.data().pos.x - 9 <= posX &&
          posX <= doc.data().pos.x + 9 &&
          doc.data().pos.y - 15 <= posY &&
          posY <= doc.data().pos.y + 15
        ) {
          overlap = true;
        }
      });
      if (overlap) {
        setSnackbarVal({
          severity: "warning",
          text: "Card overlap!",
        });
        setOpenSnackbar(true);
      } else {
        addWish(pos);
        setReadyToAdd(false);
      }
    } else {
      wishList.forEach((doc) => {
        if (
          doc.data().pos.x - 9 <= posX &&
          posX <= doc.data().pos.x + 9 &&
          doc.data().pos.y - 15 <= posY &&
          posY <= doc.data().pos.y + 15
        ) {
          setCardWish(doc.data());
          setOpenWishCard(true);
        }
      });
    }
  };
  const Canvas = (props) => {
    const canvasRef = useRef(null);

    const draw = (ctx) => {
      if (!loadingWishList) {
        wishList.forEach((doc) => {
          ctx.beginPath();
          ctx.moveTo(doc.data().pos.x, 0);
          ctx.lineTo(doc.data().pos.x, doc.data().pos.y - 15);
          ctx.strokeStyle = "black";
          ctx.lineWidth = 0;
          ctx.stroke();

          ctx.fillStyle = "#000000";
          ctx.fillRect(
            doc.data().pos.x - 9 - 1,
            doc.data().pos.y - 15 - 1,
            18 + 2,
            30 + 2
          );
          ctx.fillStyle = cardColors[doc.data().card];
          ctx.fillRect(doc.data().pos.x - 9, doc.data().pos.y - 15, 18, 30);
          ctx.fill();
        });
      }
    };

    useEffect(() => {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      if (canvasLeft == 0) setCanvasLeft(canvas.offsetLeft + canvas.clientLeft);
      if (canvasTop == 0) setCanvasTop(canvas.offsetTop + canvas.clientTop);

      draw(context);
    }, [wishList, loadingWishList]);

    return <canvas ref={canvasRef} {...props} />;
  };

  const [openWishForm, setOpenWishForm] = useState(false);
  const [openInfo, setOpenInfo] = useState(false);

  const [card, setCard] = React.useState("");
  const [cardError, setCardError] = React.useState(false);

  const [wish, setWish] = React.useState("");
  const [wishError, setWishError] = React.useState(false);

  const [name, setName] = React.useState("");
  const [yourWish, setYourWish] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [wishCount, setWishCount] = React.useState(0);

  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [snackbarVal, setSnackbarVal] = React.useState({});

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnackbar(false);
  };

  useEffect(() => {
    if (!loadingWishList) {
      setWishCount(wishList.size);
    }
  }, [wishList, loadingWishList]);

  const validateWish = () => {
    let error = false;
    if (card == "") {
      error = true;
      setCardError(true);
    }
    if (wish == "" || (wish == "free" && yourWish == "")) {
      error = true;
      setWishError(true);
    }
    return error;
  };
  const addWish = async (pos) => {
    if (validateWish()) {
      return false;
    } else {
      const currentWish = wish == "free" ? yourWish : wish;

      const wishData = {
        wish: currentWish,
        card: card,
        name: name,
        pos: pos,
      };

      await firebase.firestore().collection("wishes2021").add(wishData);
      setWish("");
      setCard("");
      setYourWish("");
      return true;
    }
  };
  const handleYourWishChange = (event) => {
    setWishError(false);
    setWish("free");
    setYourWish(event.target.value);
  };

  const handleWishChange = (event) => {
    setWishError(false);
    setWish(event.target.value);
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleCardChange = (event) => {
    if (cardError) setCardError(false);
    setCard(event.target.value);
  };

  const handleWishFormClickOpen = () => {
    setOpenWishForm(true);
  };
  const handleWishFormClickClose = () => {
    setOpenWishForm(false);
  };

  const handleWishFormSubmit = async () => {
    if (!validateWish()) {
      handleWishFormClickClose();
      setReadyToAdd(true);
      setSnackbarVal({
        severity: "info",
        text: "Click the area to place your card",
      });
      setOpenSnackbar(true);
    }
    // setSubmitting(true);
    // const complete = await addWish();
    // setSubmitting(false);
  };

  const handleInfoClickOpen = () => {
    setOpenInfo(true);
  };
  const handleInfoClickClose = () => {
    setOpenInfo(false);
  };

  const [openWishCard, setOpenWishCard] = useState(false);
  const handleWishCardClose = () => {
    setOpenWishCard(false);
  };

  const FormControlStyle = {
    minWidth: 200,
    marginY: 1,
  };
  return (
    <Box width="100vw" height="100vh" maxWidth="100%">
      <Box
        display="flex"
        alignItems="center"
        justifyContent="flex-start"
        flexDirection="column"
      >
        <Typography variant="h4" align="center" mt="10vh">
          七夕—Tanabata
        </Typography>
        <Typography variant="subtitle1" align="center">
          @KVIS — 7/7/2021
        </Typography>

        <Typography align="center" variant="button">
          {wishCount} wishes!
        </Typography>
      </Box>

      <Box display="flex" alignItems="center" justifyContent="center" pt="2vh">
        <Button
          variant="outlined"
          color="primary"
          onClick={handleWishFormClickOpen}
        >
          Make a Wish
        </Button>
        <Dialog
          open={openWishForm}
          onClose={handleWishFormClickClose}
          maxWidth="lg"
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <Box sx={{ paddingX: 2, backgroundColor: cardColors[card] }}>
            <DialogTitle id="alert-dialog-title">Make a wish</DialogTitle>
            <DialogContent>
              <Box
                display="flex"
                justifyContent="center"
                alignItems="flex-start"
                flexDirection="column"
              >
                <FormControl
                  sx={FormControlStyle}
                  variant="standard"
                  error={cardError}
                >
                  <InputLabel id="demo-simple-select-label">Card</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={card}
                    onChange={handleCardChange}
                  >
                    <MenuItem value={1}>Strawberry</MenuItem>
                    <MenuItem value={2}>Avocado</MenuItem>
                    <MenuItem value={3}>Coconut</MenuItem>
                  </Select>
                  <FormHelperText>Please select your card</FormHelperText>
                </FormControl>
                <FormControl
                  sx={FormControlStyle}
                  component="fieldset"
                  error={wishError}
                >
                  <FormLabel component="legend">Wish</FormLabel>
                  <RadioGroup value={wish} onChange={handleWishChange}>
                    <FormControlLabel
                      value="wish A"
                      control={<Radio size="small" />}
                      label="Wish A"
                    />
                    <FormControlLabel
                      value="wish B"
                      control={<Radio size="small" />}
                      label="Wish B"
                    />
                    <FormControlLabel
                      value="wish C"
                      control={<Radio size="small" />}
                      label="Wish C"
                    />
                    <FormControlLabel
                      value="free"
                      control={<Radio size="small" />}
                      label={
                        <TextField
                          value={yourWish}
                          onChange={handleYourWishChange}
                          size="small"
                          variant="standard"
                          placeholder="type anything!"
                        />
                      }
                    />
                  </RadioGroup>
                  <FormHelperText>Please select your wish</FormHelperText>
                </FormControl>

                <FormControl sx={FormControlStyle} variant="standard">
                  <TextField
                    size="small"
                    id="name"
                    label="Name"
                    variant="standard"
                    value={name}
                    placeholder="name#batch"
                    onChange={handleNameChange}
                  />
                </FormControl>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleWishFormClickClose} color="primary">
                Cancel
              </Button>
              <LoadingButton
                onClick={handleWishFormSubmit}
                color="primary"
                loading={submitting}
              >
                Make a Wish
              </LoadingButton>
            </DialogActions>
          </Box>
        </Dialog>
      </Box>
      <Box display="flex" alignItems="center" justifyContent="center" pt="10px">
        <Button
          variant="outlined"
          color="primary"
          onClick={handleInfoClickOpen}
        >
          What is Tanabata?
        </Button>
        <Dialog
          open={openInfo}
          onClose={handleInfoClickClose}
          maxWidth="sm"
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle>What is Tanabata?</DialogTitle>
          <DialogContent>
            <DialogContentText>
              PLEASE ADD SOMETHING HERE PLEASE ADD SOMETHING HERE PLEASE ADD
              SOMETHING HERE PLEASE ADD SOMETHING HERE
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleInfoClickClose} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarVal.severity}
          sx={{ width: "100%" }}
        >
          {snackbarVal.text}
        </Alert>
      </Snackbar>
      <Box
        onScroll={handleOnScroll}
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{
          maxWidth: "100vw",
          overflow: "auto",
          p: "20px",
        }}
        onClick={handleCanvasClick}
      >
        {loadingWishList ? (
          <Box
            width="100%"
            height="300px"
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <CircularProgress />
          </Box>
        ) : (
          <Canvas
            ref={handleCanvas}
            width="600px"
            height="300px"
            style={{
              backgroundColor: "#EEEEEE",
              borderRadius: "5px",
              left: "10px",
            }}
          />
        )}
      </Box>
      <Dialog
        open={openWishCard}
        onClose={handleWishCardClose}
        maxWidth="lg"
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <Box
          sx={{
            paddingX: 2,
            backgroundColor: cardColors[cardWish.card],
            width: "250px",
            minHeight: "400px",
          }}
        >
          <DialogContent>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              flexDirection="column"
              sx={{ height: "300px" }}
            >
              <Typography align="center" variant="body1">
                {cardWish.wish}
              </Typography>
            </Box>
            <Box
              display={cardWish.name == "" ? "none" : "flex"}
              justifyContent="flex-end"
              alignItems="center"
              flexDirection="column"
              sx={{ height: "80px" }}
            >
              <Typography align="center" variant="overline">
                {cardWish.name}
              </Typography>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleWishCardClose} color="primary">
              Close
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        pt="5vh"
        pb="5vh"
      >
        <NextLink href="https://itzmeowww.github.io/tanabata2020/">
          <Button size="small" variant="outlined" color="primary">
            Visit Last Year's Website
          </Button>
        </NextLink>
      </Box>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
        sx={{ pt: "5vh", pb: "5vh" }}
      >
        <Typography variant="caption">
          Code with 💖 by{" "}
          <NextLink href="https://instagram.com/thnsn_kmd">@thnsn_kmd</NextLink>{" "}
        </Typography>
        <Typography variant="caption">
          and will be designed soon by{" "}
          <NextLink href="https://instagram.com/crackerloveyou">
            @crackerloveyou
          </NextLink>
        </Typography>
      </Box>
    </Box>
  );
}
