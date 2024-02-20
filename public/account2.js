

 
  const registrationForm = document.getElementById("depositupdate");

registrationForm.addEventListener("submit", async (event) => {
    event.preventDefault();

  const transactionid = document.getElementById("transactionid").value;
  const transactionamount = document.getElementById("transactionammount").value;
  

  
  // Amount validation regex
  // const transactionamountRegex = /^(?:[1-9]\d{0,4}|70000)$/;
  
  const transactionidRegex = /^[A-Z0-9]{10}$/;
  //const usernameRegex = /^[a-zA-Z]+$/;

  // Validate email and password
  if (transactionid.trim() == "" || transactionamount == "" ) {
    document.getElementById("registration-emptyfield-error").style.color = "red";
    document.getElementById("registration-emptyfield-error").textContent = "You must fill all the fields";
    document.getElementById("error-messages").textContent = "";
    return;
  } else {
    document.getElementById("registration-emptyfield-error").textContent = "";
  }
    if (!transactionidRegex.test(transactionid)) {
            document.getElementById("transaction-id").style.color = "red";
            document.getElementById("transaction-id").textContent = "Please input a valid Correct Transaction id from Mpesa. Only numbers and capital letters allowed";
            document.getElementById("error-messages").textContent = "";
            return;
        } else {
            document.getElementById("transaction-id").textContent = "";
        }

  

        if (transactionamount < 500) {
          document.getElementById("transaction-amount").style.color = "red";
          document.getElementById("transaction-amount").textContent = "Minimum KES. 500";
          document.getElementById("error-messages").textContent = "";
          return;
      } else {
          document.getElementById("transaction-amount").textContent = "";
      }
      if (transactionamount > 450000) {
        document.getElementById("transaction-amount").style.color = "red";
        document.getElementById("transaction-amount").textContent = "Maximum KES. 450000";
        document.getElementById("error-messages").textContent = "";
        return;
    } else {
        document.getElementById("transaction-amount").textContent = "";
    }
         

  // If validation passes, you can submit the form
  document.getElementById("depositupdate").submit();

});




document.addEventListener('DOMContentLoaded', () => {
  console.log('Fetching username from server...');
  // Fetch the username from the session
  fetch('/get-musername')
    .then(response => response.json())
    .then(data => {
      console.log('Fetched username from server:', data.username );
      const username = data.username;
      
      if (username) {
        // Display the username on the account page
        document.getElementById('username-display').textContent = ` ${username}`;
        
      } else {
        // Redirect to the login page if the username is not available and not already on the login page
        if (window.location.pathname !== '/mlogin2') {
          window.location.href = '/mlogin2';
        }
      }
    })
    .catch(error => {
      console.error('Error fetching username:', error);
      // Handle the error and maybe redirect to the login page
    });
});


// Add this code to your account.js file
document.addEventListener('DOMContentLoaded', () => {
  const getUsernameBtn = document.getElementById('get-username-btn');
  const usernameDisplay = document.getElementById('username-display2');

  // Event listener for the button click
  getUsernameBtn.addEventListener('click', async () => {
    try {
      // Fetch the username by ID from the server
      const response = await fetch('/get-username-by-id');
      const data = await response.json();

      // Display the result on the frontend
      if (data.username) {
        usernameDisplay.textContent = `Username: ${data.username}`;
      } else {
        usernameDisplay.textContent = 'User not found.';
      }
    } catch (error) {
      console.error('Error fetching username by ID:', error);
      // Handle the error and maybe display an error message on the frontend
    }
  });
});

// Add this code to your existing account.js file
const logoutButton = document.getElementById('logout-button');

logoutButton.addEventListener('click', async () => {
  // Display a confirmation dialog
  const confirmLogout = window.confirm('Are you sure you want to logout?');

  if (confirmLogout) {
    // If the user confirms, make a request to the logout route on the server
    const response = await fetch('/logout', { method: 'GET' });

    if (response.ok) {
      // If the logout was successful, redirect the user to the login page
      window.location.href = '/mlogin2';
    } else {
      // Handle any errors that occurred during logout
      console.error('Error during logout:', response.statusText);
      // You can display an error message or handle it in another way
    }
  }
  // If the user cancels, do nothing
});


const accountupdatForm = document.getElementById("accountupdate");

accountupdatForm.addEventListener("submit", async (event) => {
    event.preventDefault();

  const phonenumber = document.getElementById("phonenumber").value;
  const fullaccountname = document.getElementById("fullaccountname").value;
  
  // Amount validation regex
  const phoneNumberRegex = /^(07|01)\d{8}$/;
  const nameRegex = /^[A-Z\s]+$/
  //const usernameRegex = /^[a-zA-Z]+$/;

  // Validate email and password
  if (phonenumber.trim() == "" || fullaccountname == "" ) {
    document.getElementById("accountupdate-emptyfield-error").style.color = "red";
    document.getElementById("accountupdate-emptyfield-error").textContent = "You must fill all the fields";
    document.getElementById('error2-messages').textContent = "";
    return;
  } else {
    document.getElementById("accountupdate-emptyfield-error").textContent = "";
  }
    if (!phoneNumberRegex.test(phonenumber)) {
            document.getElementById("phonenumber-id").style.color = "red";
            document.getElementById("phonenumber-id").textContent = "Input a valid phone number";
            document.getElementById('error2-messages').textContent = "";
            return;
        } else {
            document.getElementById("phonenumber-id").textContent = "";
        }

  if (!nameRegex.test(fullaccountname)) {
            document.getElementById("fullname-id").style.color = "red";
            document.getElementById("fullname-id").textContent = "Name can only be typed in capital letters";
            document.getElementById('error2-messages').textContent = "";
            //document.getElementById("fullaccountname").textContent = "";
            return;
        } else {
            document.getElementById("fullname-id").textContent = "";
        }
        
  // If validation passes, you can submit the form
  document.getElementById("accountupdate").submit();

});




    