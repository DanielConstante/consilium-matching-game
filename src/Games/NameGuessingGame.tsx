import React, { useState, useEffect } from "react";

// Import your images from the src/assets directory
import AlecHendersonImg from "./assets/images/Alec-Henderson.jpg";
import DanielConstanteImg from "./assets/images/Daniel-Constante.jpg";
import RyanSaundersImg from "./assets/images/Ryan-Saunders.jpg";
import Caleb from "./assets/images/Caleb-Gentry.jpg";
import Stephan from "./assets/images/Stephan-Terrill.jpg";

// MUI imports for the dialog modal
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";

// Define types for the mock data
interface ImageData {
  id: number;
  name: string;
  department: string;
  imageUrl: string;
}

const GuessingGame: React.FC = () => {
  const [currentImage, setCurrentImage] = useState<ImageData | null>(null);
  const [score, setScore] = useState<number>(0);
  const [nameOptions, setNameOptions] = useState<string[]>([]);
  const [departmentOptions, setDepartmentOptions] = useState<string[]>([]);
  const [nameSelected, setNameSelected] = useState<boolean>(false);
  const [correctName, setCorrectName] = useState<string>("");
  const [modalMessage, setModalMessage] = useState<string>("");
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [attempts, setAttempts] = useState<number>(0); // Track total attempts (name + department)
  const [nameAttempts, setNameAttempts] = useState<number>(0); // Track name attempts
  const [departmentAttempts, setDepartmentAttempts] = useState<number>(0); // Track department attempts
  const [gameOver, setGameOver] = useState<boolean>(false); // Track if the game is over
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [incorrectNames, setIncorrectNames] = useState<string[]>([]);
  const [startGame, setStartGame] = useState<boolean>(false);
  
  const mockData: ImageData[] = [
    { id: 1, name: "Allec", department: "Python", imageUrl: AlecHendersonImg },
    {
      id: 2,
      name: "Daniel",
      department: "React",
      imageUrl: DanielConstanteImg,
    },
    { id: 3, name: "Ryan", department: "Software", imageUrl: RyanSaundersImg },
    { id: 4, name: "Caleb", department: "Web Developer", imageUrl: Caleb },
    { id: 5, name: "Stephan", department: "Marketing", imageUrl: Stephan },
  ];

  const generateOptions = (
    correct: string,
    optionsArray: string[],
    field: keyof ImageData
  ) => {
    const allOptions = [...new Set(mockData.map((item) => item[field]))];

    // Filter out the correct option from the options
    const incorrectOptions = allOptions.filter((option) => option !== correct);

    // Randomly pick 2 incorrect options
    const randomIncorrectOptions: string[] = []; // Ensure this is a string[] type
    while (randomIncorrectOptions.length < 2 && incorrectOptions.length > 0) {
      const randomIndex = Math.floor(Math.random() * incorrectOptions.length);
      randomIncorrectOptions.push(
        String(incorrectOptions.splice(randomIndex, 1)[0])
      ); // Convert to string if needed
    }

    // Return 3 options: 2 incorrect ones + 1 correct one, all as strings
    return [String(correct), ...randomIncorrectOptions].sort(
      () => 0.5 - Math.random()
    );
  };

  const loadNextImage = () => {
    if (mockData.length > 0 && !gameOver) {
      const randomIndex = Math.floor(Math.random() * mockData.length);
      const selectedImage = mockData[randomIndex];
      setCurrentImage(selectedImage);

      setNameOptions(generateOptions(selectedImage.name, nameOptions, "name"));
      setDepartmentOptions(
        generateOptions(
          selectedImage.department,
          departmentOptions,
          "department"
        )
      );

      setNameSelected(false);
      setCorrectName(selectedImage.name);
      setAttempts(0); // Reset total attempts
      setNameAttempts(0); // Reset name attempts
      setDepartmentAttempts(0); // Reset department attempts
    }
  };

  useEffect(() => {
    loadNextImage();
  }, [gameOver]);

  const handleNameSelection = (selectedName: string) => {
    if (nameAttempts < 3 && !gameOver) {
      if (selectedName === currentImage?.name) {
        setNameSelected(true);
        setModalMessage("Correct Name! Now select the department.");
        setModalVisible(true);
      } else {
        setNameAttempts((prev) => prev + 1);
        setAttempts((prev) => prev + 1);
        setModalMessage("Incorrect Name! Try again.");
        setModalVisible(true);

        // Add the incorrect name to the list to disable the button
        setIncorrectNames((prev) => [...prev, selectedName]);
      }
    } else {
      setModalMessage("You've reached the maximum number of tries for Name.");
      setModalVisible(true);
    }
  };

  const handleDepartmentSelection = (selectedDepartment: string) => {
    if (departmentAttempts < 3 && nameSelected && !gameOver) {
      if (selectedDepartment === currentImage?.department) {
        // Prevent score from going beyond 5
        setScore((prevScore) => {
          const newScore = prevScore < 5 ? prevScore + 1 : prevScore;
          if (newScore === 5) {
            // When score reaches 5, show a special message
            setModalMessage("Game Done! You are awesome!");
            setGameOver(true); // End the game when score reaches 5
          }
          return newScore;
        });
        if (score === 5) return; // Prevent further actions if the score is 5
        setModalMessage("Correct Department! You've scored a point.");
        setModalVisible(true);
        if (nameAttempts === 0 && departmentAttempts === 0) {
          setModalMessage("Awesome! Both Name and Department are correct!");
          loadNextImage();
        }
      } else {
        setDepartmentAttempts((prev) => prev + 1);
        setAttempts((prev) => prev + 1);
        setModalMessage("Incorrect Department! Try again.");
        setModalVisible(true);
      }
    } else if (!nameSelected) {
      setModalMessage("Please select the correct name first!");
      setModalVisible(true);
    } else {
      setModalMessage(
        "You've reached the maximum number of tries for Department."
      );
      setModalVisible(true);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    if (attempts >= 3) {
      setGameOver(true); // Game over after 6 attempts
      // loadNextImage();
    } else {
      setIsDisabled(false); // Continue to next image
    }
  };

  const resetGame = () => {
    setScore(0);
    setAttempts(0);
    setNameAttempts(0);
    setDepartmentAttempts(0);
    setGameOver(false);
    loadNextImage();
  };

  if (!currentImage) return <div>Loading...</div>;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <div className="flex flex-col justify-center items-center min-h-screen p-4 bg-gray-100">
        <h1 className="text-3xl font-bold mb-6">Guess the Name & Department</h1>

        {startGame && (
          <div className="mt-6 text-2xl font-semibold text-red-500">
            <div className="mb-6 flex justify-center">
              <img
                src={currentImage.imageUrl}
                alt="Guess Who"
                className="rounded-full w-64 h-64 object-cover"
                style={{ borderRadius: "50%", width: "256px", height: "256px" }}
              />
            </div>
            <Button
              onClick={resetGame}
              variant="contained"
              color="primary"
              className="mt-4"
            >
              Start Game
            </Button>
          </div>
        )}
        <div className="mb-6 flex justify-center">
          <img
            src={currentImage.imageUrl}
            alt="Guess Who"
            className="rounded-full w-64 h-64 object-cover"
            style={{ borderRadius: "50%", width: "256px", height: "256px" }}
          />
        </div>
        <div className="space-y-6 text-center">
          <h2 className="text-xl font-semibold">Who is this?</h2>
          <div className="space-y-4">
            {nameOptions.map((name) => (
              <button
                key={name}
                onClick={() => handleNameSelection(name)}
                className="bg-blue-500 text-white p-3 rounded w-64"
                disabled={
                  nameAttempts >= 3 || gameOver || incorrectNames.includes(name)
                } // Disable after max attempts or game over
              >
                {name}
              </button>
            ))}
          </div>

          <h2 className="text-xl font-semibold">What is their department?</h2>
          <div className="space-y-4">
            {departmentOptions.map((department) => (
              <button
                key={department}
                onClick={() => handleDepartmentSelection(department)}
                className="bg-green-500 text-white p-3 rounded w-64"
                disabled={
                  !nameSelected ||
                  isDisabled ||
                  departmentAttempts >= 3 ||
                  gameOver
                } // Disable until name selected, or after max attempts, or game over
              >
                {department}
              </button>
            ))}
          </div>
        </div>
        <p className="mt-6 text-xl font-semibold">Score: {score}</p>
        <p className="mt-2 text-xl font-semibold">
          Incorrect Tries: {attempts}
        </p>

        {/* Material-UI Dialog Modal */}
        <Dialog open={modalVisible} onClose={closeModal}>
          <DialogTitle>Result</DialogTitle>
          <DialogContent>
            <p>{modalMessage}</p>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeModal} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>

        {/* Game Over Message */}
        {gameOver && (
          <div className="mt-6 text-2xl font-semibold text-red-500">
            Game Over! Final Score: {score}
            <br />
            <Button
              onClick={resetGame}
              variant="contained"
              color="primary"
              className="mt-4"
            >
              New Game
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GuessingGame;
