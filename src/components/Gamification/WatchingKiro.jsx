import { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import { keyframes } from "@mui/material/styles";

const floatGhost = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-4px); }
  100% { transform: translateY(0px); }
`;

const DEFAULT_BODY_PATH =
  "M100 32c-33.2 0-60 26.8-60 60v58.6c0 4.3 5.2 6.5 8.4 3.6l10.9-9.8a4 4 0 0 1 5.5 0l13 11.8a4 4 0 0 0 5.4 0l13-11.8a4 4 0 0 1 5.5 0l13 11.8a4 4 0 0 0 5.4 0l13-11.8a4 4 0 0 1 5.5 0l10.9 9.8c3.2 2.9 8.4.7 8.4-3.6V92c0-33.2-26.8-60-60-60Z";

const LEFT_EYE_CENTER = { x: 78, y: 98 };
const RIGHT_EYE_CENTER = { x: 122, y: 98 };
const EYE_CENTER = {
  x: (LEFT_EYE_CENTER.x + RIGHT_EYE_CENTER.x) / 2,
  y: (LEFT_EYE_CENTER.y + RIGHT_EYE_CENTER.y) / 2,
};

function WatchingKiro({
  size = 180,
  maxOffset = 4.5,
  className,
  bodyPath = DEFAULT_BODY_PATH,
}) {
  const wrapperRef = useRef(null);
  const [pupilOffset, setPupilOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event) => {
      const wrapper = wrapperRef.current;
      if (!wrapper) return;

      const rect = wrapper.getBoundingClientRect();
      const eyeCenterX = rect.left + (EYE_CENTER.x / 200) * rect.width;
      const eyeCenterY = rect.top + (EYE_CENTER.y / 220) * rect.height;

      const dx = event.clientX - eyeCenterX;
      const dy = event.clientY - eyeCenterY;
      const angle = Math.atan2(dy, dx);

      // Keep pupils inside the eye white by limiting travel.
      const offsetX = Math.cos(angle) * maxOffset;
      const offsetY = Math.sin(angle) * maxOffset;

      setPupilOffset((prev) => {
        if (
          Math.abs(prev.x - offsetX) < 0.05 &&
          Math.abs(prev.y - offsetY) < 0.05
        ) {
          return prev;
        }
        return { x: offsetX, y: offsetY };
      });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [maxOffset]);

  return (
    <Box
      ref={wrapperRef}
      className={className}
      sx={{
        width: size,
        height: size,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        animation: `${floatGhost} 2.6s ease-in-out infinite`,
      }}
      aria-label="Watching Kiro mascot"
      role="img"
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 200 220"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Fixed ghost body (replace this path to swap mascot shape). */}
        <g id="ghost-body">
          <path
            d={bodyPath}
            fill="#FFFFFF"
            stroke="#D7DCE5"
            strokeWidth="3"
            strokeLinejoin="round"
          />
        </g>

        {/* Fixed outer eyes (white) */}
        <g id="outer-eyes">
          <circle
            cx={LEFT_EYE_CENTER.x}
            cy={LEFT_EYE_CENTER.y}
            r="12"
            fill="#FFFFFF"
            stroke="#D7DCE5"
            strokeWidth="2"
          />
          <circle
            cx={RIGHT_EYE_CENTER.x}
            cy={RIGHT_EYE_CENTER.y}
            r="12"
            fill="#FFFFFF"
            stroke="#D7DCE5"
            strokeWidth="2"
          />
        </g>

        {/* Movable pupils (dark) */}
        <g id="movable-pupils">
          <circle
            cx={LEFT_EYE_CENTER.x}
            cy={LEFT_EYE_CENTER.y}
            r="4"
            fill="#2D3748"
            style={{
              transform: `translate(${pupilOffset.x}px, ${pupilOffset.y}px)`,
              transition: "transform 80ms linear",
            }}
          />
          <circle
            cx={RIGHT_EYE_CENTER.x}
            cy={RIGHT_EYE_CENTER.y}
            r="4"
            fill="#2D3748"
            style={{
              transform: `translate(${pupilOffset.x}px, ${pupilOffset.y}px)`,
              transition: "transform 80ms linear",
            }}
          />
        </g>
      </svg>
    </Box>
  );
}

export default WatchingKiro;
