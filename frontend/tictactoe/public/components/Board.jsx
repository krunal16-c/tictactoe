import React from 'react';
import './Board.css';


const BoardSquare = ({ type, name }) => (
  <div className={`board-square ${type}`}>
    {name}
  </div>
);

const Board = () => {
  const squares = [
    { type: 'go', name: 'GO' },
    { type: 'property', name: 'Broadway Avenue' },
    { type: 'property', name: 'University of Saskatchewan' },
    { type: 'property', name: 'River Landing' },
    { type: 'property', name: 'Wanuskewin Heritage Park' },
    { type: 'property', name: 'Saskatoon Forestry Farm Park and Zoo' },
    { type: 'property', name: 'Western Development Museum' },
    { type: 'property', name: 'Meewasin Valley' },
    { type: 'property', name: 'Remai Modern' },
    { type: 'property', name: 'Saskatoon City Hospital' },
    { type: 'property', name: 'Diefenbaker Canada Centre' },
    { type: 'property', name: 'Saskatoon Farmers Market' },
    // ... add more Saskatoon locations here

  ];

  return (
    <div className="monopoly-board">
      {squares.map((square, index) => (
        <BoardSquare key={index} type={square.type} name={square.name} />
      ))}
    </div>
  );
};

export default Board;