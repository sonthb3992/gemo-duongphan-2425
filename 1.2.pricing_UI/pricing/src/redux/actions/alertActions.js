export const showAlert = (type, message) => {
  return {
    type: "SHOW_ALERT",
    payload: { type, message },
  };
};

export const dismissAlert = () => {
  return {
    type: "DISMISS_ALERT",
  };
};
