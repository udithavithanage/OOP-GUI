import React, { useState } from "react";

function Alert({ msg }) {
  const [visible, setVisible] = useState(true);
  const cut = () => {
    setVisible(!visible);
  };

  return (
    <>
      {visible && (
        <div className="alert-box">
          <span className="alert-message">{msg}</span>
          <button className="close-btn" onClick={cut}>
            &times;
          </button>
        </div>
      )}
    </>
  );
}

export default Alert;
