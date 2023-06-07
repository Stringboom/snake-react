import React, { useState, useEffect } from 'react';

const ROWS = 20;
const COLS = 20;
const INITIAL_SNAKE = [
  { row: 10, col: 10 },
  { row: 10, col: 9 },
  { row: 10, col: 8 }
];
const INITIAL_DIRECTION = 'right';

const getRandomFoodPosition = () => {
    const row = Math.floor(Math.random() * ROWS);
    const col = Math.floor(Math.random() * COLS);
    return { row, col };
  };

  const getNewDirection = (keyCode) => {
    switch (keyCode) {
      case 37: // Left arrow key
        return 'left';
      case 38: // Up arrow key
        return 'up';
      case 39: // Right arrow key
        return 'right';
      case 40: // Down arrow key
        return 'down';
      default:
        return null;
    }
  };

  



const SnakeGame = () => {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState(getRandomFoodPosition());
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    if (gameStarted && !gameOver) {
      const interval = setInterval(moveSnake, 100);
      return () => clearInterval(interval);
    }
  }, [snake, gameOver, gameStarted]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      const newDirection = getNewDirection(event.keyCode);
      if (newDirection) {
        handleDirectionChange(newDirection);
      }
    };
  
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  const moveSnake = () => {
    if (gameOver) return;

    const head = { ...snake[0] };
    switch (direction) {
      case 'up':
        head.row--;
        break;
      case 'down':
        head.row++;
        break;
      case 'left':
        head.col--;
        break;
      case 'right':
        head.col++;
        break;
      default:
        break;
    }

    if (isCollision(head) || isOutOfBounds(head)) {
      setGameOver(true);
      setGameStarted(false);
      return;
    }

    const newSnake = [head, ...snake];
    if (head.row === food.row && head.col === food.col) {
      setFood(getRandomFoodPosition());
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
  };

  const isCollision = (head) => {
    return snake.some((segment, index) => {
      if (index === 0) return false;
      return segment.row === head.row && segment.col === head.col;
    });
  };

  const isOutOfBounds = (head) => {
    return (
      head.row < 0 ||
      head.row >= ROWS ||
      head.col < 0 ||
      head.col >= COLS
    );
  };

  const handleStartGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(getRandomFoodPosition());
    setGameOver(false);
    setGameStarted(true);
  };

  const renderCells = () => {
    const cells = [];
  
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        const isSnakeCell = snake.some(
          (segment) => segment.row === row && segment.col === col
        );
        const isFoodCell = food.row === row && food.col === col;
  
        cells.push(
          <div
            key={`${row}-${col}`}
            className={`cell ${isSnakeCell ? 'snake' : ''} ${
              isFoodCell ? 'food' : ''
            }`}
            style={{
              gridRow: row + 1,
              gridColumn: col + 1
            }}
          />
        );
      }
    }
  
    return cells;
  };

  const handleDirectionChange = (newDirection) => {
    if (
      (direction === 'up' && newDirection !== 'down') ||
      (direction === 'down' && newDirection !== 'up') ||
      (direction === 'left' && newDirection !== 'right') ||
      (direction === 'right' && newDirection !== 'left')
    ) {
      setDirection(newDirection);
    }
  };
  

  return (
    <div className="game-container">
      {gameOver && <div className="game-over">Game Over!</div>}
      <div className="game-board">{renderCells()}</div>
      {!gameStarted && (
        <button onClick={handleStartGame}>Start Game</button>
      )}
      <div className="control-buttons">
        <button onClick={() => handleDirectionChange('up')}>Up</button>
        <br/>
        <button onClick={() => handleDirectionChange('left')}>Left</button>
        <button onClick={() => handleDirectionChange('right')}>Right</button>
        <br/>
        <button onClick={() => handleDirectionChange('down')}>Down</button>
      </div>
    </div>
    
  );
};

export default SnakeGame;
