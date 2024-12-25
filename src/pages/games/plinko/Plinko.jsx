import React, { useState, useEffect } from "react";
import Matter from "matter-js";

const PlinkoGame = () => {
  const [engine] = useState(Matter.Engine.create());
  const [render, setRender] = useState(null);

  useEffect(() => {
    const { Engine, Render, World, Bodies } = Matter;

    // Create the rendering context
    const render = Render.create({
      element: document.getElementById('plinko-board'),
      engine,
      options: {
        width: 800,
        height: 600,
        wireframes: false,
      },
    });

    setRender(render);

    // Create ground and walls
    const ground = Bodies.rectangle(400, 590, 800, 20, { isStatic: true });
    const leftWall = Bodies.rectangle(0, 300, 20, 600, { isStatic: true });
    const rightWall = Bodies.rectangle(800, 300, 20, 600, { isStatic: true });

    // Add pegs
    const pegs = [];
    const pegSpacing = 50;
    for (let row = 0; row < 10; row++) {
      for (let col = 0; col < 16; col++) {
        if (row % 2 === 0 || col < 15) {
          pegs.push(
            Bodies.circle(
              col * pegSpacing + (row % 2 === 0 ? 25 : 0) + 50,
              row * pegSpacing + 50,
              5,
              { isStatic: true }
            )
          );
        }
      }
    }

    // Add slots
    const slots = [];
    for (let i = 0; i < 16; i++) {
      slots.push(
        Bodies.rectangle(i * pegSpacing + 50, 580, 10, 60, { isStatic: true })
      );
    }

    // Add objects to the world
    World.add(engine.world, [ground, leftWall, rightWall, ...pegs, ...slots]);

    // Run the engine and renderer
    Engine.run(engine);
    Render.run(render);

    return () => {
      Render.stop(render);
      Engine.clear(engine);
      World.clear(engine.world);
      Engine.clear(engine);
      render.canvas.remove();
      render.textures = {};
    };
  }, [engine]);

  const dropBall = () => {
    const { World, Bodies } = Matter;
    const ball = Bodies.circle(400, 50, 10);
    World.add(engine.world, ball);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-800">
      <button
        onClick={dropBall}
        className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
      >
        Drop Ball
      </button>
      <div
        id="plinko-board"
        className="relative w-[800px] h-[600px] border-2 border-white"
      ></div>
    </div>
  );
};

export default PlinkoGame;
