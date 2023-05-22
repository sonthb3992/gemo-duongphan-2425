import React from "react";

const ProgressBar = ({ status }) => {
  let barWidth = "0%";
  let backgroundColor = "";

  if (status === "Pending") {
    barWidth = "5%";
    backgroundColor = "#ffcc00";
  } else if (status === "In Progress") {
    barWidth = "50%";
    backgroundColor = "#ff9900";
  } else if (status === "Completed") {
    barWidth = "100%";
    backgroundColor = "#00cc00";
  } else if (status === "Cancelled") {
    barWidth = "100%";
    backgroundColor = "#ff0000";
  }

  return (
    <div className="row d-flex align-items-center">
      <div className="col-md-2">
        <p className="text-muted mb-0 small">Track Order</p>
      </div>
      <div className="col-md-10">
        <div
          className="progress"
          style={{ height: "6px", borderRadius: "16px" }}
        >
          <div
            className="progress-bar"
            role="progressbar"
            style={{
              width: barWidth,
              borderRadius: "16px",
              backgroundColor: backgroundColor,
            }}
            aria-valuenow={barWidth}
            aria-valuemin="0"
            aria-valuemax="100"
          ></div>
        </div>
        <div className="d-flex justify-content-between mb-1">
          <p className="text-muted mt-1 mb-0 small ms-xl-5">Pending</p>
          <p className="text-muted mt-1 mb-0 small ms-xl-5">In Progress</p>
          {status === "Completed" ? (
            <p className="text-muted mt-1 mb-0 small ms-xl-5">Completed</p>
          ) : (
            <p className="text-muted mt-1 mb-0 small ms-xl-5">Cancelled</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
