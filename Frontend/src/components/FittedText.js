import { useEffect, useRef } from "react";
import fitty from "fitty";

function FittedText({ children, className = "" }) {
  const textRef = useRef(null);

  useEffect(() => {
    if (textRef.current) {
      fitty(textRef.current, {
        minSize: 8,
        maxSize: 36,
        multiLine: false,
      });
    }
  }, []);

  return (
    <div ref={textRef} className={className}>
      {children}
    </div>
  );
}

export default FittedText;
