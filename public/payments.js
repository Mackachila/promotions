
const registrationForm = document.getElementById("todaypayments");

registrationForm.addEventListener("submit", async (event) => {
    event.preventDefault();

  const withdrawalId = document.getElementById("withdrawalId").value;
    
    // Validate email and password
  if (withdrawalId == "") {
    document.getElementById("error-messages").style.color = "red";
    document.getElementById("error-messages").textContent = "Please copy and paste a transaction ID";
    return;
  } else {
    document.getElementById("error-messages").textContent = "";
  }
             

  // If validation passes, you can submit the form
  document.getElementById("todaypayments").submit();

});


function showSection(sectionId) {
    //Hiding all seections
    document.getElementById('accountsecction').style.display = 'none';
    document.getElementById('taskssecction').style.display = 'none';
    document.getElementById('walletsecction').style.display = 'none';
    document.getElementById('depositsecction').style.display = 'none';
    document.getElementById('withdrawalsecction').style.display = 'none';
   
    // Show the selected section
    document.getElementById(sectionId).style.display = 'block';
}

document.addEventListener('DOMContentLoaded', function () {
  const yesterdayTable = document.getElementById('yesterday-table');
  const todayTable = document.getElementById('today-table');

  // Fetch yesterday's pending payments
  fetch('/get-yesterday-pending-payments')
    .then(response => response.json())
    .then(data => {
      displayPayments(data.yesterdayPayments, yesterdayTable);
      displayTotalSum(data.yesterdayPayments, yesterdayTable);
    })
    .catch(error => {
      console.error('Error fetching yesterday\'s pending payments:', error);
    });

  // Fetch today's pending payments
  fetch('/get-today-pending-payments')
    .then(response => response.json())
    .then(data => {
      displayPayments(data.todayPayments, todayTable);
      displayTotalSum(data.todayPayments, todayTable);
    })
    .catch(error => {
      console.error('Error fetching today\'s pending payments:', error);
    });

  function displayPayments(payments, table) {
    // Create a table row for each payment
    payments.forEach(payment => {
      const row = table.insertRow();
      row.insertCell(0).textContent = payment.withdrawalid;
      row.insertCell(1).textContent = payment.amount;
      row.insertCell(2).textContent = payment.contact;
      row.insertCell(3).textContent = payment.status;
      
    });
  }

  function displayTotalSum(payments, table) {
    // Calculate the total sum of the amount column
    const totalSum = payments.reduce((sum, payment) => sum + payment.amount, 0);

    // Create a new row for the total sum
    const totalRow = table.insertRow();
    totalRow.insertCell(0).textContent = 'Total:'; // Leave the first cell empty
    totalRow.insertCell(1).textContent = totalSum;
    totalRow.insertCell(2);
    totalRow.insertCell(3); // Leave other cells empty
    
    
  }
});

// Add this code to your existing client-side JavaScript file
document.addEventListener('DOMContentLoaded', function () {
  const paidButton = document.getElementById('paid-button');
  const rejectedButton = document.getElementById('rejected-button');
  const failedButton = document.getElementById('failed-button');

  paidButton.addEventListener('click', function () {
    updateWithdrawalStatus('Success');
  });

  rejectedButton.addEventListener('click', function () {
    updateWithdrawalStatus('Rejected (Refunded)');
  });

  failedButton.addEventListener('click', function () {
    updateWithdrawalStatus('Failed (Refunded)');
  });

  // Update the updateWithdrawalStatus function in your existing client-side JavaScript file
function updateWithdrawalStatus(status) {
  const withdrawalId = document.getElementById('withdrawalId').value;

  fetch('/update-withdrawal-status', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ withdrawalid: withdrawalId, status }),
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      if (data.success !== undefined && data.message !== undefined) {
        alert(data.message);
        // Optionally, you can perform additional actions on success
      } else {
        alert('That was a wrong code or the code has been used.');
      }
    })
    .catch(error => {
      console.error('Error updating withdrawal status:', error);
      alert('That is a wrong Transaction ID or it has been used. Please be sure to copy the correct ID and never use one ID more than once');
    });
}
});



// Add this code to your existing client-side JavaScript file
document.addEventListener('DOMContentLoaded', function () {
  const paidButton = document.getElementById('paid2-button');
  const rejectedButton = document.getElementById('rejected2-button');
  const failedButton = document.getElementById('failed2-button');

  paidButton.addEventListener('click', function () {
    updateWithdrawalStatus('Success');
  });

  rejectedButton.addEventListener('click', function () {
    updateWithdrawalStatus('Rejected (Refunded)');
  });

  failedButton.addEventListener('click', function () {
    updateWithdrawalStatus('Failed (Refunded)');
  });

  // Update the updateWithdrawalStatus function in your existing client-side JavaScript file
function updateWithdrawalStatus(status) {
  const withdrawalId = document.getElementById('withdrawalId').value;

  fetch('/update-withdrawal-status', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ withdrawalid: withdrawalId, status }),
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      if (data.success !== undefined && data.message !== undefined) {
        alert(data.message);
        // Optionally, you can perform additional actions on success
      } else {
        alert('That was a wrong code or the code has been used.');
      }
    })
    .catch(error => {
      console.error('Error updating withdrawal status:', error);
      alert('That is a wrong Transaction ID or it has been used. Please be sure to copy the correct ID and never use one ID more than once');
    });
}
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
        document.getElementById('username-display3').textContent = ` ${username}`;
        
      } else {
        // Redirect to the login page if the username is not available and not already on the login page
        if (window.location.pathname !== '/mlogin3') {
          window.location.href = '/mlogin3';
        }
      }
    })
    .catch(error => {
      console.error('Error fetching username:', error);
      // Handle the error and maybe redirect to the login page
    });
});

// Add this code to your existing account.js file
const logoutButton = document.getElementById('logout-button3');

logoutButton.addEventListener('click', async () => {
  // Display a confirmation dialog
  const confirmLogout = window.confirm('Are you sure you want to logout?');

  if (confirmLogout) {
    // If the user confirms, make a request to the logout route on the server
    const response = await fetch('/logout', { method: 'GET' });

    if (response.ok) {
      // If the logout was successful, redirect the user to the login page
      window.location.href = '/mlogin3';
    } else {
      // Handle any errors that occurred during logout
      console.error('Error during logout:', response.statusText);
      // You can display an error message or handle it in another way
    }
  }
  // If the user cancels, do nothing
});









  