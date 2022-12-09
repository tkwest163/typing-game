import { useCallback, useEffect, useState } from 'react'
import './App.scss'

// Text
const text = "The quick fox jumps over the lazy dog";
const words = text.split(" ");

// Calculations
const calculateWPM = (charCount) => (minutes) => charCount / 5 / minutes;
const charCount = (x) => x.split(" ").join("").length;

const calculateMinutes = (finishedTime) => (startedTime) => 
(finishedTime - startedTime) / 60000;

const calculateAccuracy = (incorrectChars) => (totalChars) => 
100 - (incorrectChars / totalChars) * 100;

// useStates
const App = () => {
  const [WPM, setWPM] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [startedTime, setStartedTime] = useState();
  const [finishedTime, setFinishedTime] = useState();
  const [incorrectChars, setIncorrectChars] = useState(0);

// Reset
const reset = useCallback(() => {
  setStartedTime()
  setFinishedTime()
  setCurrentWordIndex(0)
  setIncorrectChars(0)
}, []);

 // This makes it so that once you finish typing and get your score, you press esc 
 // to exit and restart. 27 is the keycode for ESC
useEffect(() => {
  const handleKeyUpEvent = ({ keyCode }) => {
    const pressedESCKey = keyCode === 27;

    if (!pressedESCKey || !finishedTime) {
      return;
    }
    reset();
  };

// This removes that score screen when reset
  window.addEventListener('keyup', handleKeyUpEvent)
  return () => window.removeEventListener("keyup", handleKeyUpEvent)
}, [finishedTime, reset]);

  return (
    <div className="app">
      <div className="words">
        {words.map((word, wordIndex) => (
          <div className={`word ${
            currentWordIndex === wordIndex && !finishedTime
            ? `current ${
              (inputValue && 
              words[currentWordIndex].startsWith(inputValue)) ||
               !inputValue 
               ? "correct" 
               : "incorrect"
          }`
          : ""
          }`} 
          >
            {word.split("").map((char, charIndex) => (
              <div className={`char ${inputValue [charIndex] === char ? 'correct' : ""
            }`}>{char}</div>
          ))}
          </div>
        ))}
      </div>
       

    <input 
    className="input" 
    value={inputValue}
    onKeyDown={()=> {
      if (!startedTime) {
        setStartedTime(Date.now());
      }
      // if the character you type is not part of the word, increase inCorrectChars by 1
      if(!words[currentWordIndex].startsWith(inputValue)) {
        setIncorrectChars(setIncorrectChars + 1);
      }

      const isCorrectWord = words[currentWordIndex] === inputValue;

      // No recoil for correct index letter inputted
      if (!isCorrectWord) {
        return;
      }

      setInputValue("");

      // Stop the timer at the end of words.length
      if (currentWordIndex === words.length - 1) {
        const finishedTime = Date.now();

        setFinishedTime(finishedTime);
        
        setWPM(
          calculateWPM(charCount(text))(
            calculateMinutes(finishedTime)(startedTime)
          )
        );

        setAccuracy(calculateAccuracy(incorrectChars)(charCount(text)));

      return;
    }

      setCurrentWordIndex(currentWordIndex + 1);

    }}
    onChange={(e) => setInputValue(e.target.value.trim())} />
    

    <div className={`score ${finishedTime ? "visible" : ""}`}>
    <div className="inner">

      {/* Round both of these scores to a whole number */}
      <div className="wpm">{Math.ceil(WPM)} WPM</div>
      <div className="accuracy">{Math.ceil(accuracy)}% Accuracy</div>

  </div>
  </div>
  </div>
  );
};
  


export default App;
