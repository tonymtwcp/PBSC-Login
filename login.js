const formStyles = {
  './images/test-169.jpg': {
    formBoxStyle: { width: 17, height: 21.2 },
    inputBoxStyle: { height: 80, marginLeft: 60, marginBottom: 21 },
    inputFieldStyle: { width: 166, height: 28, fontSize: 16 },
    loginBtnStyle: { width: 90, height: 45 },
  },
  './images/test-43.jpg': {
    formBoxStyle: { width: 13.6, height: 21 },
    inputBoxStyle: { height: 80, marginLeft: 45, marginBottom: 23 },
    inputFieldStyle: { width: 118, height: 28 },
    loginBtnStyle: { width: 68, height: 39 },
  },
};

const doFirst = () => {
  const imageElement = document.querySelector('#bg-img');
  const formBox = document.querySelector('#form-box');
  const inputBox = document.querySelector('#input-box');
  const inputFields = document.querySelectorAll('.input-field');
  const accountInput = document.querySelector('#account');
  const passwordInput = document.querySelector('#password');
  const loginBtn = document.querySelector('#login-btn');
  const errorMessage = document.querySelector('#error-message');

  const setFormStyle = (imageSrc, imageRatio) => {
    const formStyle = formStyles[imageSrc];
    if (formStyle) {
      const { formBoxStyle, inputBoxStyle, inputFieldStyle, loginBtnStyle } =
        formStyle;

      formBox.style.transform = `scale(${imageRatio})`;
      formBox.style.width = `${formBoxStyle.width}rem`;
      formBox.style.height = `${formBoxStyle.height}rem`;
      inputBox.style.height = `${inputBoxStyle.height}px`;
      inputBox.style.marginLeft = `${inputBoxStyle.marginLeft}px`;
      inputBox.style.marginBottom = `${inputBoxStyle.marginBottom}px`;

      inputFields.forEach((inputField) => {
        inputField.style.width = `${inputFieldStyle.width}px`;
        inputField.style.height = `${inputFieldStyle.height}px`;
      });

      loginBtn.style.width = `${loginBtnStyle.width}px`;
      loginBtn.style.height = `${loginBtnStyle.height}px`;
    }
  };

  const handleResize = () => {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const screenRatio = screenWidth / screenHeight;

    const imageSrc =
      screenRatio > 1.9 || screenRatio < 1
        ? './images/test-169.jpg'
        : './images/test-43.jpg';
    imageElement.src = imageSrc;

    imageElement.onload = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const imageWidth = imageElement.naturalWidth;
      const imageHeight = imageElement.naturalHeight;

      const shouldUseMin = scrollHeight > screenHeight && screenRatio > 1;
      const imageRatio = shouldUseMin
        ? Math.min(screenWidth / imageWidth, scrollHeight / imageHeight)
        : Math.max(screenWidth / imageWidth, scrollHeight / imageHeight);

      setFormStyle(imageSrc, imageRatio);
    };

    document.documentElement.style.setProperty(
      '--doc-height',
      `${screenHeight}px`
    );
  };

  const showError = (message) => {
    let errorMessageTimeout;

    if (!errorMessage) {
      console.error('Error message element not found.');
      return;
    }

    errorMessage.textContent = message;
    errorMessage.classList.remove('active');
    errorMessage.classList.add('active');

    clearTimeout(errorMessageTimeout);
    errorMessageTimeout = setTimeout(() => {
      errorMessage.textContent = '';
      errorMessage.classList.remove('active');
    }, 2000);
  };

  const handleLogin = async () => {
    const account = accountInput.value;
    const password = passwordInput.value;

    if (!account || !password) {
      showError('Account or Password cannot be empty.');
      return;
    }

    const apiUrl = 'LOGIN_API_URL';
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ account, password }),
    };

    try {
      const response = await fetch(apiUrl, requestOptions);
      const data = await response.json();

      if (data.error) {
        showError(data.error);
        passwordInput.value = '';
      }
    } catch (error) {
      console.error(error);
      showError('An error occurred, please try again later.');
      passwordInput.value = '';
    }
  };

  loginBtn.addEventListener('click', handleLogin);

  formBox.addEventListener('submit', (e) => {
    e.preventDefault();
  });

  handleResize();
  window.addEventListener('resize', handleResize);
  window.addEventListener('orientationchange', handleResize);
  window.addEventListener('touchmove', handleResize);
};

window.addEventListener('load', doFirst);
