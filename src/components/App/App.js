import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import GlobalStyle from '../../styles/globalStyles';
import Controls from '../Controls/Controls';
import Header from '../Header/Header';
import Pomodoro from '../Pomodoro/Pomodoro';
import { CURRENT_TIME } from '../../config/config';

function App() {
  const [currentTime, setCurrentTime] = useState(CURRENT_TIME);
  const [timeLeft, setTimeLeft] = useState(currentTime * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  let intervalRef = useRef(null);

  useEffect(() => setTimeLeft(currentTime * 60), [currentTime]);

  const padTime = (time) => {
    return Math.floor(time).toString().padStart(2, '0');
  };

  const minutes = padTime(timeLeft / 60);

  const seconds = padTime(timeLeft - minutes * 60);

  const toStartTimer = () => {
    if (intervalRef.current !== null) return;
    setIsEdit(false);
    setIsRunning(true);
    intervalRef.current = setInterval(
      () =>
        setTimeLeft((timeLeft) => {
          if (timeLeft >= 1) return timeLeft - 1;
          setTimeout(toResetTime(), 2000);
          return 0;
        }),
      1000
    );
  };

  const toPauseTime = () => {
    if (intervalRef.current === null) return;
    clearInterval(intervalRef.current);
    setIsRunning(false);
    intervalRef.current = null;
  };

  const toResetTime = () => {
    clearInterval(intervalRef.current);
    setTimeLeft(currentTime * 60);
    setIsRunning(false);
    intervalRef.current = null;
  };

  const handleShowEditButton = () => {
    setIsEdit(!isEdit);
  };

  const handleTimeEditSubtract = () => {
    if (currentTime <= 1) return;
    setCurrentTime(currentTime - 1);
  };

  const handleTimeEditAdd = () => {
    if (currentTime >= 60) return;
    setCurrentTime(currentTime + 1);
  };

  return (
    <Wrapper>
      <AppContainer>
        <GlobalStyle />
        <Header />
        <Pomodoro
          handleHiddenButtonEdit={isEdit}
          handleTimeEditSubtract={handleTimeEditSubtract}
          handleTimeEditAdd={handleTimeEditAdd}
          minutes={minutes}
          seconds={seconds}
        />
        <Controls
          isRunning={isRunning}
          onStartClick={toStartTimer}
          onResetClick={toResetTime}
          onPauseClick={toPauseTime}
          isEdit={isEdit}
          handleShowEditButton={handleShowEditButton}
        />
      </AppContainer>
    </Wrapper>
  );
}

export default App;

const Wrapper = styled.div`
  background-color: #fc5650;
  height: 100vh;
`;

const AppContainer = styled.div`
  max-width: 800px;
  padding: 20px;
  margin: auto;
  display: flex;
  flex-direction: column;
  gap: 30px;
`;
