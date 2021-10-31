import React from "react";

function Alert(props) {
  return (
    <div>
      <div className={`alert alert-${props.type} alert-dismissible fade show`} role="alert">
        {props.massege}
        <button
          type="button"
          className="close"
          data-dismiss="alert"
          aria-label="Close"
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    </div>
  );
}

export default Alert;
