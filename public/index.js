
const registrationForm = document.getElementById("registration_form");

registrationForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const loader = document.getElementById('loader');
  const registrationUsername = document.getElementById("username").value;
  const registrationEmail = document.getElementById("email").value;
  const registrationPhone = document.getElementById("phone_number").value;
  //const registrationCountrylist = document.getElementById("countryList").value;
  const invitationcode = document.getElementById("invitation_code").value;
  const registrationPassword = document.getElementById("password").value;
  const registrationConfirmpassword = document.getElementById("confirm_password").value;

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Password validation regex (at least 8 characters)
   const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
  // Validate phone number
  const phoneRegex =/^(07|01)\d{8}$/;
  // Validate Username
  const usernameRegex = /^[a-zA-Z0-9]{1,15}$/;
  //const usernameRegex = /^[a-zA-Z]+$/;

  // Validate email and password
  if (registrationUsername.trim() == "" || registrationEmail == "" || registrationPhone == "" || registrationPassword == "" || registrationConfirmpassword == "" || invitationcode == "") {
    document.getElementById("registration-emptyfield-error").style.color = "red";
    document.getElementById("registration-emptyfield-error").textContent = "Please fill all the fields";
    return;
  } else {
    document.getElementById("registration-emptyfield-error").textContent = "";
  }
    if (!usernameRegex.test(registrationUsername)) {
            document.getElementById("registration-username-error").style.color = "red";
            document.getElementById("registration-username-error").textContent = "Username can only contain letters and numbers and not be too long. No spaces allowed";
            return;
        } else {
            document.getElementById("registration-username-error").textContent = "";
        }

     if (!emailRegex.test(registrationEmail)) {
          document.getElementById("registration-email-error").style.color = "red";
          document.getElementById("registration-email-error").textContent = "Please provide a valid email address.";
          return;
      } else {
          document.getElementById("registration-email-error").textContent = "";
      } 

      if (!phoneRegex.test(registrationPhone)) {
        document.getElementById("registration-phone-error").style.color = "red";
        document.getElementById("registration-phone-error").textContent = "Please provide a valid phone number.";
        return;
    } else {
        document.getElementById("registration-phone-error").textContent = "";
    }

    if (!passwordRegex.test(registrationPassword)) {
        document.getElementById("registration-password-error").style.color = "red";
           document.getElementById("registration-password-error").textContent = "Password must be at least 6 characters and contain upercase and lowercase letters.";
            return;
        } else {
           document.getElementById("registration-password-error").textContent = "";
        }

     if (registrationPassword.trim() !== registrationConfirmpassword.trim()) {
            document.getElementById("registration-confirmpassword-error").style.color = "red";
            document.getElementById("registration-confirmpassword-error").textContent = "Your passwords do not match.";
            return;
        } else {
            document.getElementById("registration-confirmpassword-error").textContent = "";
        }

  

  // If validation passes, you can submit the form
  document.getElementById("registration_form").submit();
  loader.style.display = 'block';

});

async function passwordreset(event) {
  // Prevent the default form submission
  event.preventDefault();
  const passwordresetEmail = document.getElementById("email").value;
  const passwordresetPhone = document.getElementById("phone_number").value;
  const passwordresetPassword = document.getElementById("password").value;
  const passwordresetConfirmpassword = document.getElementById("confirm_password").value;

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Password validation regex (at least 8 characters)
  const passwordRegex =  /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;

  // Validate phone number
  const phoneRegex =/^(07|01)\d{8}$/;

  // Validate email and password
  if (passwordresetEmail == "" || passwordresetPhone == "" || passwordresetPassword == "" || passwordresetConfirmpassword == "") {
    document.getElementById("passwordreset-empty-error").style.color = "red";
    document.getElementById("passwordreset-empty-error").textContent = "Please fill all the fields";
    return;
  } else {
    document.getElementById("passwordreset-empty-error").textContent = "";
  }

  if (!emailRegex.test(passwordresetEmail)) {
    document.getElementById("passwordreset-email-error").style.color = "red";
    document.getElementById("passwordreset-email-error").textContent = "Please provide a valid email address.";
    return;
  } else {
    document.getElementById("passwordreset-email-error").textContent = "";
  }

  if (!phoneRegex.test(passwordresetPhone)) {
    document.getElementById("passwordreset-phone-error").style.color = "red";
    document.getElementById("passwordreset-phone-error").textContent = "Please provide a valid phone number.";
    return;
  } else {
    document.getElementById("passwordreset-phone-error").textContent = "";
  }

  if (!passwordRegex.test(passwordresetPassword)) {
    document.getElementById("passwordreset-password-error").style.color = "red";
    document.getElementById("passwordreset-password-error").textContent = "Password must be at least 6 characters and contain uppercase and lowercase letters.";
    return;
  } else {
    document.getElementById("passwordreset-password-error").textContent = "";
  }

  if (passwordresetPassword.trim() !== passwordresetConfirmpassword.trim()) {
    document.getElementById("passwordreset-confirmpassword-error").style.color = "red";
    document.getElementById("passwordreset-confirmpassword-error").textContent = "Your passwords do not match.";
    return;
  } else {
    document.getElementById("passwordreset-confirmpassword-error").textContent = "";
  }

  try {
    const response = await fetch('/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({passwordresetEmail, passwordresetPhone, passwordresetPassword }),
    });

    // Parse the JSON response
    const result = await response.json();

    // Display success or error message
    if (result.success) {
      //alert(result.success);
      resetsuccessful();  // You can customize how you want to display the success message
    } else {
     // alert(result.error); 
     errorlogincard();   // You can customize how you want to display the error message
    }
  } catch (error) {
    console.error('Error submitting form:', error);
    alert('An error occurred while processing your request. Please try again.');
  }
}

// Attach the event listener to your form outside the function
document.getElementById("passwordreset_form").addEventListener("submit", passwordreset);

function login(event) {
   event.preventDefault();

  const loginUsername = document.getElementById("login_username").value;
  const loginPassword = document.getElementById("login_password").value;

  if (loginUsername.trim() == "" || loginPassword.trim() == "") {
    document.getElementById("login-emptyfield-error").style.color = "red";
    document.getElementById("login-emptyfield-error").textContent = "Please fill all the fields";
    return;
  } else {
    document.getElementById("login-emptyfield-error").textContent = "";
  }

  // Now, if the fields are not blank, you can manually submit the form
  document.getElementById("login_form").submit();
}

  window.onload = function () {
  const usernameElement = document.getElementById('username');

  // Fetch the username from the server or from the session if available
  fetch('/get-username')//username misspelt intentionally
    .then(response => response.json())
    .then(data => {
      const username = data.username;

      if (username) {
        // Display the username on the profile page
        usernameElement.textContent = username;
      } 
    })
    .catch(error => {
      console.error('Error fetching username:', error);
      // Handle the error and maybe redirect to the login page
      window.location.href = '/login';
    });
};

function login3(event) {
  event.preventDefault();

 const loginUsername = document.getElementById("login_username3").value;
 const loginPassword = document.getElementById("login_password3").value;

 if (loginUsername.trim() == "" || loginPassword.trim() == "") {
   document.getElementById("login-emptyfield-error3").style.color = "red";
   document.getElementById("login-emptyfield-error3").textContent = "Please fill all the fields";
   return;
 } else {
   document.getElementById("login-emptyfield-error3").textContent = "";
 }

 // Now, if the fields are not blank, you can manually submit the form
 document.getElementById("login_form3").submit();
}

function linkfloatingCard() {
  var linkfloatingCard = document.getElementById('linkfloatingCard');
  
  linkfloatingCard.style.display = 'block';

  // Automatically hide the floating card after 3 seconds
  setTimeout(function() {
      linkfloatingCard.style.display = 'none';
  }, 2000);
}

function errorlogincard() {
  var errorlogincard = document.getElementById('errorlogincard');
  
  errorlogincard.style.display = 'block';

  // Automatically hide the floating card after 3 seconds
  setTimeout(function() {
      errorlogincard.style.display = 'none';
  }, 4000);
}

function resetsuccessful() {
  var resetsuccessful = document.getElementById('resetsuccessful');
  
  resetsuccessful.style.display = 'block';

  // Automatically hide the floating card after 3 seconds
  
  }
