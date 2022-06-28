import { useState } from "react";

const scaleLimit = {
  lower: 0.1,
  upper: 2,
};

const defaultView = {
  translate: {
    x: 0,
    y: 0,
  },
  scale: 1,
};

export default function useViewBox() {
  const [view, setView] = useState(defaultView);

  const eventData = {
    mousePos: {
      x: 0,
      y: 0,
    },
    translate: view.translate,
  };

  const startMove = ({ clientX, clientY }) => {
    eventData.mousePos.x = clientX;
    eventData.mousePos.y = clientY;

    eventData.translate = { ...view.translate };
  };

  const move = ({ clientX, clientY }) => {
    const dx = clientX - eventData.mousePos.x;
    const dy = clientY - eventData.mousePos.y;

    const translate = {
      x: eventData.translate.x + dx,
      y: eventData.translate.y + dy,
    };

    setView((view) => ({ ...view, translate }));
  };

  const mouseDownHandler = (e) => {
    startMove(e);

    document.addEventListener("mousemove", mouseMoveHandler);
    document.addEventListener("mouseup", mouseUpHandler);
  };

  const mouseMoveHandler = (e) => move(e);

  const mouseUpHandler = () => {
    document.removeEventListener("mousemove", mouseMoveHandler);
    document.removeEventListener("mouseup", mouseUpHandler);
  };

  const wheelHandler = (e) => {
    const modifier = e.deltaY > 0 ? -0.1 : 0.1;

    const scale = Math.round((view.scale + modifier) * 100) / 100;

    if (scale >= scaleLimit.lower && scale <= scaleLimit.upper)
      setView((view) => ({ ...view, scale }));
  };

  const transform = () => ({
    transform: `translate(${view.translate.x}px, ${view.translate.y}px) scale(${view.scale})`,
    transformOrigin: "left center",
  });

  return {
    mouseDownHandler,
    wheelHandler,
    transform,
  };
}
