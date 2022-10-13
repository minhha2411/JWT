const saveToken = ({ accessToken, refreshToken }) => {
  localStorage.setItem("ACCESS_TOKEN", accessToken);
  localStorage.setItem("REFRESH_TOKEN", refreshToken);
};

export { saveToken };
