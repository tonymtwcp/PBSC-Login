const formStyles = {
  "./images/PBSC-169.jpg": {
    LoginformStyle: { width: 17, height: 21.2 },
    inputContainerStyle: { height: 80, marginLeft: 60, marginBottom: 21 },
    inputFieldStyle: { width: 166, height: 28 },
    loginBtnStyle: { width: 90, height: 45 },
  },
  "./images/PBSC-43.jpg": {
    LoginformStyle: { width: 13.6, height: 21 },
    inputContainerStyle: { height: 80, marginLeft: 45, marginBottom: 25 },
    inputFieldStyle: { width: 118, height: 28 },
    loginBtnStyle: { width: 68, height: 39 },
  },
};

const initialize = () => {
  const bgImage = document.querySelector("#bg-img");
  const Loginform = document.querySelector("#login-form");
  const inputContainer = document.querySelector("#input-container");
  const inputFields = document.querySelectorAll(".input-field");
  const accountInput = document.querySelector("#account-input");
  const passwordInput = document.querySelector("#password-input");
  const loginBtn = document.querySelector("#login-btn");
  const errorMessage = document.querySelector("#error-message");
  let imageRatioInitialized = false;
  let errorMessageTimeout;

  const setFormStyle = (imageSrc, imageRatio) => {
    const formStyle = formStyles[imageSrc];
    if (formStyle) {
      const {
        LoginformStyle,
        inputContainerStyle,
        inputFieldStyle,
        loginBtnStyle,
      } = formStyle;

      Loginform.style.transform = `scale(${imageRatio})`;

      Loginform.style.width = `${LoginformStyle.width}rem`;
      Loginform.style.height = `${LoginformStyle.height}rem`;

      inputContainer.style.height = `${inputContainerStyle.height}px`;
      inputContainer.style.marginLeft = `${inputContainerStyle.marginLeft}px`;
      inputContainer.style.marginBottom = `${inputContainerStyle.marginBottom}px`;

      inputFields.forEach((inputField) => {
        inputField.style.width = `${inputFieldStyle.width}px`;
        inputField.style.height = `${inputFieldStyle.height}px`;
      });

      loginBtn.style.width = `${loginBtnStyle.width}px`;
      loginBtn.style.height = `${loginBtnStyle.height}px`;
    }
  };

  const handleResize = () => {
    const isSafariMobile =
      /iPhone|iPad|iPod/i.test(navigator.userAgent) &&
      /Safari/i.test(navigator.userAgent);
    if (isSafariMobile && imageRatioInitialized) return;

    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const screenRatio = screenWidth / screenHeight;

    const imageSrc =
      screenRatio > 1.9 || screenRatio < 1
        ? "./images/PBSC-169.jpg"
        : "./images/PBSC-43.jpg";
    bgImage.src = imageSrc;

    bgImage.onload = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const imageWidth = bgImage.naturalWidth;
      const imageHeight = bgImage.naturalHeight;

      const shouldUseMin = scrollHeight > screenHeight;
      const imageRatio = shouldUseMin
        ? Math.min(screenWidth / imageWidth, scrollHeight / imageHeight)
        : Math.max(screenWidth / imageWidth, scrollHeight / imageHeight);

      setFormStyle(imageSrc, imageRatio);
      imageRatioInitialized = true;
    };

    document.documentElement.style.setProperty(
      "--doc-height",
      `${screenHeight}px`
    );
  };

  const showError = (message) => {
    if (!errorMessage) {
      console.error("Error message element not found.");
      return;
    }

    errorMessage.textContent = message;
    errorMessage.classList.remove("active");
    errorMessage.classList.add("active");

    clearTimeout(errorMessageTimeout);

    errorMessageTimeout = setTimeout(() => {
      errorMessage.textContent = "";
      errorMessage.classList.remove("active");
    }, 2000);
  };

  const handleLogin = async () => {
    const account = accountInput.value;
    const password = passwordInput.value;

    if (!account || !password) {
      showError("Account or Password cannot be empty.");
      return;
    }

    try {
      const res = await fetch("LOGIN_API_URL", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ account, password }),
      });
      const data = await res.json();

      if (data.error) {
        showError(data.error);
        passwordInput.value = "";
      }
    } catch (e) {
      console.error(e);
      showError("An error occurred, please try again later.");
      passwordInput.value = "";
    }
  };

  loginBtn.addEventListener("click", handleLogin);

  Loginform.addEventListener("submit", (e) => {
    e.preventDefault();
  });

  handleResize();
  window.addEventListener("resize", handleResize);
  window.addEventListener("orientationchange", handleResize);
};

window.addEventListener("load", initialize);
