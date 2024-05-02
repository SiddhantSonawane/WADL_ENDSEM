const form = document.querySelector("form");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const confirmPasswordInput = document.getElementById("cpassword");

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const cpassword = document.getElementById("cpassword").value;
  const birthdate = document.getElementById("birthdate").value;
  const phone = document.getElementById("phone").value;
  const gender = document.querySelector('input[name="gender"]:checked').value;
  const street = document.getElementById("street").value;
  const suite = document.getElementById("suite").value;
  const city = document.getElementById("city").value;
  const zipcode = document.getElementById("zipcode").value;
  const lat = document.getElementById("lat").value;
  const lng = document.getElementById("lng").value;
  const website = document.getElementById("website").value;
  const company = document.getElementById("company").value;


  // Validate email
  if (!validateEmail(emailInput.value.trim())) {
    emailInput.classList.add("is-invalid");
    emailInput.classList.remove("is-valid")
  } else {
    emailInput.classList.add("is-valid");
    emailInput.classList.remove("is-invalid");
  }

  // Validate password
  if (!validatePassword(passwordInput.value.trim())) {
    passwordInput.classList.add("is-invalid");
    passwordInput.classList.remove("is-valid")
  } else {
    passwordInput.classList.add("is-valid");
    passwordInput.classList.remove("is-invalid")
  }

  // Validate confirm password
  if (passwordInput.value.trim() !== confirmPasswordInput.value.trim()) {
    confirmPasswordInput.classList.add("is-invalid");
    confirmPasswordInput.classList.remove("is-valid")
  } else {
    confirmPasswordInput.classList.add("is-valid");
    confirmPasswordInput.classList.remove("is-invalid")
  }

  form.classList.add('was-validated')
  // Check if all fields are valid
  if (form.checkValidity()) {
    const userData = {
      name,
      email,
      password,
      cpassword,
      birthdate,
      phone,
      gender,
      address: {
        street,
        suite,
        city,
        zipcode,
        geo: {
          lat,
          lng,
        },
      },
      website,
      company,
    };
    
    let usersData = localStorage.getItem("data");
    usersData = usersData ? JSON.parse(usersData) : [];
    usersData.push(userData);
    localStorage.setItem("data", JSON.stringify(usersData));
  }
});

function validateEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
}

function validatePassword(password) {
    console.log('pass len is ',password.length)
    return password.length >= 8;
}