const formStyles = {
  './images/test-169.jpg': {
    formBoxStyle: { width: 273, height: 336 },
    inputBoxStyle: { height: 82, marginLeft: 60, marginBottom: 18 },
    inputFieldStyle: { width: 164, height: 28 },
    loginBtnStyle: { width: 90, height: 45 },
  },
  './images/test-43.jpg': {
    formBoxStyle: { width: 218, height: 335 },
    inputBoxStyle: { height: 82, marginLeft: 45, marginBottom: 23 },
    inputFieldStyle: { width: 116, height: 28 },
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

  const setFormStyle = (imageSrc, imageRatio) => {
    const formStyle = formStyles[imageSrc];
    if (formStyle) {
      const { formBoxStyle, inputBoxStyle, inputFieldStyle, loginBtnStyle } =
        formStyle;

      formBox.style.transform = `scale(${imageRatio})`;
      formBox.style.width = `${formBoxStyle.width}px`;
      formBox.style.height = `${formBoxStyle.height}px`;
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
  };

  const showError = (message) => {
    const errorMessage = document.querySelector('#error-message');
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
};

window.addEventListener('load', doFirst);
