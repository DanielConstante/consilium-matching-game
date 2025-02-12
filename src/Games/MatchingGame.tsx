import React, { useState, useEffect, JSX, ReactNode } from "react";
import logo from "../assets/images/consilium-logo.png";
import InfoIcon from "@mui/icons-material/Info";
import { Box, TextField, Tooltip, Typography } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import axios from "axios";
import { API_URL } from "../../config";

const MatchingGame: React.FC = () => {
  const [playerName, setPlayerName] = useState<string>("");
  const [savedPlayer, setSavedPlayer] = useState<string>("");
  const [numberOfFaces, setNumberOfFaces] = useState<number>(5);
  const [numTries, setNumTries] = useState<number>(0);
  const [faces, setFaces] = useState<{
    leftSide: JSX.Element[];
    rightSide: JSX.Element[];
  }>({
    leftSide: [],
    rightSide: [],
  });
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<string | ReactNode>("");
  const [isGameStarted, setIsGameStarted] = useState<boolean>(false);

  useEffect(() => {
    if (isGameStarted) {
      generateFaces(); // Call generateFaces only when the game has started
    }

    return () => {
      document.body.removeEventListener("click", gameOverHandler);
    };
  }, [numberOfFaces, isGameStarted]);

  useEffect(() => {
    axios.get(`${API_URL}`).then((response) => {
      if (response.data?.name) {
        setSavedPlayer(response.data.name);
      }
    });
  }, []);

  const generateFaces = () => {
    const leftSideFaces: JSX.Element[] = [];
    //const rightSideFaces: JSX.Element[] = [];

    for (let i = 0; i < numberOfFaces; i++) {
      const randomTop = Math.floor(Math.random() * 400) + 1;
      const randomLeft = Math.floor(Math.random() * 350) + 1; // Adjusted left boundary
      leftSideFaces.push(
        <img
          key={`left-${i}`}
          src={logo}
          alt="Consilium Logo"
          style={{
            position: "absolute",
            top: `${randomTop}px`,
            left: `${randomLeft}px`,
            width: "50px",
          }}
          onClick={i === numberOfFaces - 1 ? nextLevel : undefined}
        />
      );
    }

    const rightFaces = leftSideFaces
      .slice(0, leftSideFaces.length - 1)
      .map((face) => {
        // Clone and adjust left position for right side
        const clonedFace = React.cloneElement(face, {
          key: `right-${face?.key?.split("-")[1] || "default-key"}`,
        });
        return clonedFace;
      });

    setFaces({
      leftSide: leftSideFaces,
      rightSide: rightFaces,
    });

    document.body.addEventListener("click", gameOverHandler);
  };

  const nextLevel = (event: React.MouseEvent) => {
    event.stopPropagation();
    setNumberOfFaces((prev) => prev + 5);
    setNumTries((prev) => prev + 1);
  };

  const gameOverHandler = () => {
    setGameOver(true);
    setIsModalOpen(true);
    setModalMessage(
      <>
        <div style={{ padding: "0 40px", fontFamily: "sans-serif" }}>
          You completed {numTries} tries.
          <br />
          Please try again.
        </div>
      </>
    );
    document.body.removeEventListener("click", gameOverHandler);
  };

  const savePlayer = async () => {
    if (playerName.trim() === "") return;
    try {
      const response = await axios.post(`${API_URL}`, { name: playerName });
      setSavedPlayer(response.data.name);
      setIsGameStarted(true);
    } catch (error) {
      console.error("Error saving player:", error);
    }
  };

  const reload = () => {
    window.location.reload();
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };
  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          height: "100vh",
        }}
      >
        {" "}
        {/* Center content vertically and horizontally */}
        <h1 style={{ textAlign: "center" }}>
          <span>Consilium Matching Game</span>
        </h1>
        {!isGameStarted && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginBottom: 2,
            }}
          >
            <TextField
              label="Enter your name"
              variant="outlined"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              sx={{ marginBottom: 1 }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={savePlayer}
              disabled={!playerName.trim()}
            >
              Save Name
            </Button>
          </Box>
        )}
        {savedPlayer && (
          <Typography variant="h6" sx={{ marginBottom: 2 }}>
            Player: {savedPlayer} | Tries: {numTries}
          </Typography>
        )}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 2,
          }}
        >
          {" "}
          {/* Container for paragraph and icon */}
          <Typography variant="h6" sx={{ fontSize: "1.2rem", marginRight: 1 }}>
            {" "}
            {/* Use Typography for paragraph */}
            <em>Click on the extra Consilium logo on the left.</em>
          </Typography>
          <Tooltip
            title={
              <Box>
                {" "}
                {/* Use Box for tooltip content */}
                <Typography variant="subtitle1">Instructions</Typography>{" "}
                {/* Typography for tooltip title */}
                <ul style={{ listStyleType: "none", paddingLeft: "10px" }}>
                  {" "}
                  {/* Remove default bullet styles */}
                  <li>Click on the extra Consilium logo on the left.</li>
                  <li>Each level adds one more logo.</li>
                  <li>Only one attempt per level.</li>
                  <li>Incorrect click ends the game.</li>
                  <li>Click "Restart Game" to play again.</li>
                </ul>
              </Box>
            }
            placement="top"
          >
            <InfoIcon />
          </Tooltip>
        </Box>
        <span
          id="restartButton"
          style={{ display: gameOver ? "block" : "none", marginBottom: "20px" }}
        >
          <button
            onClick={reload}
            style={{
              backgroundColor: "#3d698c",
              cursor: "pointer",
              color: "#fff",
              padding: "10px 20px",
              borderRadius: "16px",
              width: "150px",
              border: "none",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = "#0b2039";
              e.currentTarget.style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#3d698c";
              e.currentTarget.style.color = "#fff";
            }}
          >
            Restart Game
          </button>
        </span>
        <div
          style={{ display: "flex", justifyContent: "center", width: "100%" }}
        >
          {" "}
          {/* Container for left and right sides */}
          <div
            id="leftSide"
            style={{
              position: "relative", // Use relative positioning for children
              width: "400px", // Adjusted width
              height: "500px",
              marginRight: "20px", // Space between sides
            }}
          >
            {faces.leftSide}
          </div>
          <div
            id="rightSide"
            style={{
              position: "relative", // Use relative positioning for children
              width: "400px", // Adjusted width
              height: "500px",
              borderLeft: "2px solid",
            }}
          >
            {faces.rightSide}
          </div>
        </div>
      </div>
      <Dialog open={isModalOpen} onClose={closeModal}>
        <DialogTitle>Game Over</DialogTitle>
        <DialogContent>
          <p>{modalMessage}</p>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={reload}
            variant="contained"
            size="medium"
            color="primary"
          >
            Restart Game
          </Button>
          <Button
            onClick={closeModal}
            variant="contained"
            size="medium"
            sx={{ backgroundColor: "#3d698c", color: "#fff" }}
            //color="secondary"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default MatchingGame;
