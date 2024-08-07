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

import Divider from "@material-ui/core/Divider";
import CircularProgress from "@material-ui/core/CircularProgress";

import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";

import NextLink from "next/link";
import Link from "@material-ui/core/Link";

import firebase from "../src/firebase/initFirebase";
import { useCollection } from "react-firebase-hooks/firestore";

import { useState, useEffect, useRef } from "react";

export default function Index() {
  const cardColors = ["#FEFEFE", "#da7f8f", "#cdf0ea", "#ffe194", "#c6b4ce"];
  const cardColorsName = ["Cotton", "Ruby", "Ocean", "Daffodil", "Amethyst"];

  const scrollBar = useRef();

  const [wishList, loadingWishList, wishListError] = useCollection(
    firebase.firestore().collection("wishes2021")
  );

  const [readyToAdd, setReadyToAdd] = React.useState(false);

  const [canvasLeft, setCanvasLeft] = React.useState(0);
  const [canvasTop, setCanvasTop] = React.useState(0);

  const handleCanvas = (canvas) => {
    const ctx = canvas.getContext("2d");
  };

  const [cardWish, setCardWish] = useState({});
  const handleCanvasClick = (event) => {
    const posX = event.pageX + scrollBar.current.scrollLeft - canvasLeft;
    const posY = event.pageY - canvasTop;
    // console.log(posX, posY);
    if (readyToAdd) {
      const pos = {
        x: posX,
        y: posY,
      };
      let overlap = false;
      wishList.forEach((doc) => {
        if (
          doc.data().pos.x - 10 <= posX &&
          posX <= doc.data().pos.x + 10 &&
          doc.data().pos.y - 16 <= posY &&
          posY <= doc.data().pos.y + 16
        ) {
          overlap = true;
        }
      });

      if (overlap) {
        setSnackbarVal({
          severity: "warning",
          text: "Cannot place a card on another card",
        });
        setOpenSnackbar(true);
      } else if (
        parseInt(posX) >= 1380 &&
        parseInt(posX) <= 1470 &&
        parseInt(posY) >= 25 &&
        parseInt(posY) <= 110
      ) {
        setSnackbarVal({
          severity: "warning",
          text: "Cannot cover the moon 🌝",
        });
        setOpenSnackbar(true);
      } else {
        addWish(pos);
        setReadyToAdd(false);
      }
    } else {
      wishList.forEach((doc) => {
        if (
          doc.data().pos.x - 10 <= posX &&
          posX <= doc.data().pos.x + 10 &&
          doc.data().pos.y - 16 <= posY &&
          posY <= doc.data().pos.y + 16
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
          const cX = Math.round(doc.data().pos.x);
          const cY = Math.round(doc.data().pos.y);
          ctx.fillStyle = "#FEFEFE";
          ctx.fillRect(cX - 1, 0, 1, cY - 16);

          ctx.fillStyle = "#000000";
          ctx.fillRect(cX - 9 - 2, cY - 15 - 1, 19 + 2, 32 + 2);
          ctx.fillStyle = cardColors[doc.data().card];
          ctx.fillRect(cX - 10, cY - 15, 19, 32);
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

  const [card, setCard] = React.useState(-1);
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
    return <MuiAlert elevation={7} ref={ref} variant="filled" {...props} />;
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
    if (card == -1) {
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
      setOpenSnackbar(false);
      await firebase.firestore().collection("wishes2021").add(wishData);

      setSnackbarVal({
        severity: "success",
        text: "Complete!",
      });
      setOpenSnackbar(true);
      setWish("");
      setCard(-1);
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
        text: "Click on the image to place your card (you can scroll)",
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
    <Box
      width="100vw"
      minHeight="100vh"
      maxWidth="100%"
      sx={{
        // background: "rgb(122,127,155)",
        background:
          "linear-gradient(0deg, rgba(122,127,155,1) 0%, rgba(112,107,139,1) 100%)",
        m: "0",
        p: "0",
      }}
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="flex-start"
        flexDirection="column"
        sx={{ color: "white" }}
      >
        <Typography variant="h4" align="center" mt="8vh">
          七夕—TANABATA
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          sx={{ color: "#ecd8b0" }}
        >
          @KVIS — 7/7/2021
        </Typography>
        <Typography align="center" variant="button">
          {wishCount} wishes!
        </Typography>

        <Typography align="center" variant="button" sx={{ maxWidth: "80vw" }}>
          <Divider variant="middle" />
          Tanabata is over for this year, may all your wishes come true ✨
        </Typography>
      </Box>

      <Box display="flex" alignItems="center" justifyContent="center" pt="2vh">
        <Button variant="contained" color="primary" disabled>
          Make a Wish
        </Button>
        <Dialog
          open={openWishForm}
          onClose={handleWishFormClickClose}
          maxWidth="lg"
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <Box sx={{ backgroundColor: cardColors[card] }}>
            <DialogTitle id="alert-dialog-title" align="center">
              Make a Wish ✨
            </DialogTitle>
            <DialogContent>
              <Box
                display="flex"
                justifyContent="center"
                alignItems="flex-start"
                flexDirection="column"
                color="secondary"
              >
                <FormControl
                  sx={FormControlStyle}
                  variant="standard"
                  error={cardError}
                  color="secondary"
                >
                  <InputLabel id="demo-simple-select-label">
                    Select your theme
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={card}
                    onChange={handleCardChange}
                  >
                    {cardColorsName.map((x, idx) => {
                      return (
                        <MenuItem value={idx} key={idx}>
                          {x}
                        </MenuItem>
                      );
                    })}
                  </Select>
                  <FormHelperText
                    sx={{ display: cardError ? "block" : "none" }}
                  >
                    Please select your theme!
                  </FormHelperText>
                </FormControl>

                <FormControl
                  sx={FormControlStyle}
                  component="fieldset"
                  error={wishError}
                  color="secondary"
                >
                  <FormLabel component="legend">Wish</FormLabel>
                  <RadioGroup
                    value={wish}
                    onChange={handleWishChange}
                    color="secondary"
                  >
                    <FormControlLabel
                      value="幸せになりますように"
                      control={<Radio color="secondary" size="small" />}
                      label={
                        wish == "幸せになりますように"
                          ? "I wish you happiness"
                          : "幸せになりますように "
                      }
                    />
                    <FormControlLabel
                      value="健康でありますように"
                      control={<Radio color="secondary" size="small" />}
                      label={
                        wish == "健康でありますように"
                          ? "I wish you good health"
                          : "健康でありますように"
                      }
                    />
                    <FormControlLabel
                      value="金持ちになりますように"
                      control={<Radio color="secondary" size="small" />}
                      label={
                        wish == "金持ちになりますように"
                          ? "I wish you wealthiness"
                          : "金持ちになりますように"
                      }
                    />
                    <FormControlLabel
                      value="free"
                      control={<Radio color="secondary" size="small" />}
                      label={
                        <TextField
                          value={yourWish}
                          onChange={handleYourWishChange}
                          size="small"
                          variant="standard"
                          color="secondary"
                          placeholder="type anything!"
                        />
                      }
                    />
                  </RadioGroup>
                  <FormHelperText
                    sx={{ display: wishError ? "block" : "none" }}
                  >
                    Please select your wish
                  </FormHelperText>
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
                    color="secondary"
                  />
                </FormControl>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={handleWishFormClickClose}
                color="secondary"
                variant="contained"
              >
                Cancel
              </Button>
              <LoadingButton
                onClick={handleWishFormSubmit}
                color="secondary"
                loading={submitting}
                variant="contained"
              >
                Wish
              </LoadingButton>
            </DialogActions>
          </Box>
        </Dialog>
      </Box>

      <Box display="flex" alignItems="center" justifyContent="center" pt="10px">
        <Button
          variant="contained"
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
              <Typography variant="body1" align="justify">
                Tanabata (たなばた, 七夕), meaning the “Evening of the seventh,”
                also known as the Star Festival, is a Japanese festival 🎉. It
                celebrates the meeting of the deities Orihime and Hikoboshi,
                which is represented by the stars{" "}
                <Link
                  href="https://en.wikipedia.org/wiki/Vega"
                  color="secondary"
                >
                  Vega
                </Link>{" "}
                and{" "}
                <Link
                  href="https://en.wikipedia.org/wiki/Altair"
                  color="secondary"
                >
                  Altair
                </Link>
                , respectively. From the legend, the Milky Way 🌌 separates
                these lovers, and they are allowed to meet only once a year on{" "}
                <b>Tanabata day</b>.
              </Typography>
              <Divider>o</Divider>
              <Typography variant="body1" align="justify">
                On this day, people around the world will write their wish on
                the paper called Tanzaku and put it on a bamboo tree 🎋 to wish
                upon the stars ⭐.
              </Typography>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleInfoClickClose}
              color="primary"
              variant="contained"
              color="secondary"
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Box>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarVal.severity}
          sx={{ width: "100%" }}
        >
          {snackbarVal.text}
        </Alert>
      </Snackbar>

      <Box display="flex" justifyContent="center" alignItems="center">
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
          <Box
            sx={{
              maxWidth: "80vw",
              overflow: "auto",
              mt: "20px",
            }}
            onClick={handleCanvasClick}
            ref={scrollBar}
          >
            <Canvas
              ref={handleCanvas}
              width="1500px"
              height="350px"
              style={{
                // backgroundColor: "#EEEEEE",
                backgroundImage: "url(background5.png)",
                borderRadius: "5px",
                left: "10px",
                cursor: "pointer",
              }}
            />
          </Box>
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
              sx={{ height: "340px", pb: "40px" }}
            >
              <Typography align="center" variant="body1">
                {cardWish.wish}
              </Typography>
            </Box>
            <Box
              display="flex"
              justifyContent="flex-end"
              alignItems="center"
              flexDirection="column"
              sx={{ height: "10px" }}
            >
              <Typography align="center" variant="overline">
                {cardWish.name}
              </Typography>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleWishCardClose}
              color="secondary"
              variant="contained"
            >
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
          <Button size="small" variant="contained" color="primary">
            Visit Last Year's Website
          </Button>
        </NextLink>
      </Box>
      {/* Credit */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
        sx={{ pt: "5vh", pb: "5vh", color: "white" }}
      >
        <Typography variant="caption">
          Code with 💖 by{" "}
          <Link href="https://instagram.com/thnsn_kmd">@thnsn_kmd</Link>{" "}
        </Typography>
        <Typography variant="caption">
          Designed by{" "}
          <Link href="https://instagram.com/crackerloveyou">
            @crackerloveyou
          </Link>
        </Typography>
      </Box>
    </Box>
  );
}
