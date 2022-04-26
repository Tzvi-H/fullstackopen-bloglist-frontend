import { useState, forwardRef, useImperativeHandle } from "react";

const Togglable = forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false);

  const toggleVisiblity = () => {
    setVisible(!visible);
  };

  const hideWhenVisible = { display: visible ? "none" : "" };
  const showWhenVisible = { display: visible ? "" : "none" };

  useImperativeHandle(ref, () => ({ toggleVisiblity }));

  return (
    <div>
      <div style={hideWhenVisible}>
        <button onClick={toggleVisiblity}>{props.buttonLabel}</button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <button onClick={toggleVisiblity}>cancel</button>
      </div>
    </div>
  );
});

Togglable.displayName = "Togglable";

export default Togglable;
