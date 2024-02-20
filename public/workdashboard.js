
document.onreadystatechange = function () {
  if (document.readyState === 'complete') {
    document.getElementById('loading-spinner').style.display = 'none';
  } else {
    document.getElementById('loading-spinner').style.display = 'block';
  }
};

function handleConnectionChange() {
  if (navigator.onLine) {
    //backonlinefloatingCard();
    // Reset any warning or notify the user that the connection is okay
  } else {
    
    internetfloatingCard();
  }
}

// Initial check on page load
handleConnectionChange();

function internetfloatingCard() {
  var internetfloatingCard = document.getElementById('internetfloatingCard');
  
  internetfloatingCard.style.display = 'block';

  // Automatically hide the floating card after 3 seconds
  setTimeout(function() {
      internetfloatingCard.style.display = 'none';
  }, 4000);
}

function backonlinefloatingCard() {
  var backonlinefloatingCard = document.getElementById('backonlinefloatingCard');
  
  backonlinefloatingCard.style.display = 'block';

  // Automatically hide the floating card after 3 seconds
  setTimeout(function() {
      backonlinefloatingCard.style.display = 'none';
  }, 4000);
}

function showSection(sectionId) {
            //Hiding all seections
            document.getElementById('accountsecction').style.display = 'none';
            document.getElementById('taskssecction').style.display = 'none';
            document.getElementById('walletsecction').style.display = 'none';
            document.getElementById('depositsecction').style.display = 'none';
            document.getElementById('withdrawalsecction').style.display = 'none';
            document.getElementById('planssection').style.display = 'none';
            document.getElementById('teamsection').style.display = 'none';
            
           
            // Show the selected section
            document.getElementById(sectionId).style.display = 'block';
        }

        document.addEventListener('DOMContentLoaded', function () {
         //*- console.log('Fetching user details');
          // Fetch the username from the session
          fetch('/get-username')
            .then(response => response.json())
            .then(data => {
         //     console.log('Fetched username from server:', data.username, data.currentAccount, data.accountBallance, data.accountPhonenumber, data.accountEmail, data.invitationLink );
      const username = data.username;
      //const accountType = data.accountType;
      const currentAccount = data.currentAccount;
      const accountBallance = data.accountBallance;
      const accountPhonenumber = data.accountPhonenumber;
      const accountEmail = data.accountEmail;
      const invitationLink = data.invitationLink;
        
              if (username) {
                // Displaying the user details on his account page
        document.getElementById('username-display').textContent = ` ${username}`;
       // document.getElementById('account-type).textContent =  ${accountType}
        document.getElementById('current_account').textContent = ` ${currentAccount}`;
        document.getElementById('account_ballance').textContent = `KES.${accountBallance}`;
        document.getElementById('account_phonenumber').textContent = `${accountPhonenumber}`;
        //document.getElementById('account_email').textContent = `${accountEmail}`;
        document.getElementById('invitelink').value = `${invitationLink}`;

         // Slicing and displaying accountEmail
         const slicedEmail = accountEmail.slice(0, 2) + '*'.repeat(accountEmail.length - 14) + accountEmail.slice(-12);
         document.getElementById('account_email').textContent = slicedEmail;
         document.getElementById('account_email').setAttribute('data-original-value', accountEmail);
        
              } else {
                // Redirect to the login page if the username is not available and not already on the login page
                if (window.location.pathname !== '/login') {
                  window.location.href = '/login';
                }
              }
            })
            .catch(error => {
              console.error('Error fetching username:', error);
              // Handle the error and maybe redirect to the login page
            });
        });

//fetching payment account
        document.addEventListener('DOMContentLoaded', function () {
        //  console.log('Fetching current account');
          // Fetch the username from the session
          fetch('/get-payment-accounts')
            .then(response => response.json())
            .then(data => {
             //console.log('Fetched username from server:', data.phonenumber, data.fullname);
      const phonenumber = data.phonenumber;
      const fullname = data.fullname;
                // Displaying the user details on his account page
        document.getElementById('accountphone').textContent = phonenumber;
        document.getElementById('accountname').textContent = fullname;
        
            })
            .catch(error => {
              console.error('Error fetching current account:', error);
              // Handle the error and maybe redirect to the login page
            });
        });


//fetching user deposit transactions on page reloade
document.addEventListener('DOMContentLoaded', function () {
  //console.log('Fetching user transactions');
  
  fetch('/get-user-transactions')
    .then(response => response.json())
    .then(data => {
     // console.log('Fetched transactions:', data.transactions);

      // Fetching an aray of data from the server
      const transactions = data.transactions;

      // Displaying data on a table and appending the rows
      const transactionsBody = document.getElementById('transactions-body');
      if (transactions && transactions.length > 0) {
        // Looping through transactions and appending rows
        transactions.forEach(transaction => {
          const row = document.createElement('tr');
        const dateCell = document.createElement('td');
        const date = new Date(transaction.depositDate);
        const options = { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit', hour12: true };
        dateCell.textContent = date.toLocaleString('en-US', options);
        row.appendChild(dateCell);

        const amountCell = document.createElement('td');
        amountCell.textContent = transaction.depositAmount;
        row.appendChild(amountCell);

        const statusCell = document.createElement('td');
        statusCell.textContent = transaction.depositStatus;
        row.appendChild(statusCell);

        transactionsBody.appendChild(row);
      });

    } else {
      // No transactions, hide the table and display a message
      document.getElementById('transactions-table').style.display = 'none';
      document.getElementById('notransactions').textContent = ` Your deposit history will show here`;
      document.getElementById('notransactions').style.display = 'block';
    }
      
    })
    .catch(error => {
      console.error('Error fetching user transactions:', error);
      //Handling the error
    });
});


document.addEventListener('DOMContentLoaded', function () {
 //*- console.log('Fetching user details');
  // Fetch the username from the session
  fetch('/get-profit-today')
    .then(response => response.json())
    .then(data => {
    //  console.log('Fetched username from server:', data.username, data.currentAccount, data.accountBallance, data.accountPhonenumber, data.accountEmail, data.invitationLink );
//const invited = data.invited;
//const accountType = data.accountType;
const todaysprofit = data.profit;
    
        // Displaying the user details on his account page
document.getElementById('todayprofit').textContent = `KES. ${todaysprofit}`;

               
      
    })
    .catch(error => {
      console.error('Error fetching username:', error);
      // Handle the error and maybe redirect to the login page
    });
});




//fetching user withdrawal transactions on page reloade
document.addEventListener('DOMContentLoaded', function () {
  //console.log('Fetching user withdrawals');
  fetch('/get-user-withdrawals')
    .then(response => response.json())
    .then(data => {
    //  console.log('Fetched transactions:', data.transactions);

      // Fetching an array of data
      const transactions = data.transactions;

      // Get the tbody element to append rows
      const transactionsBody = document.getElementById('withdrawals-body');
      if (transactions && transactions.length > 0) {
        document.getElementById('nowithdrawals').textContent = ` Withdrawal History`;
        // Loop through transactions and append rows
        transactions.forEach(transaction => {
          const row = document.createElement('tr');
        const dateCell = document.createElement('td');
        const date = new Date(transaction.withdrawalDate);
        const options = { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit', hour12: true };
        dateCell.textContent = date.toLocaleString('en-US', options);
        row.appendChild(dateCell);

        const amountCell = document.createElement('td');
        amountCell.textContent = transaction.withdrawalAmount;
        row.appendChild(amountCell);

        const statusCell = document.createElement('td');
        statusCell.textContent = transaction.withdrawalStatus;
        row.appendChild(statusCell);

        transactionsBody.appendChild(row);
      });

    } else {
      // No transactions, hide the table and display a message
      document.getElementById('withdrawals-table').style.display = 'none';
      document.getElementById('nowithdrawals').textContent = ` Your withdrawal History will show here`;
      document.getElementById('nowithdrawals').style.display = 'block';
    }
      
    })
    .catch(error => {
      console.error('Error fetching user transactions:', error);
      // Handling the error
    });
});

document.addEventListener('DOMContentLoaded', function () {
  //console.log('Fetching user teammember');
  // Fetching the username from the session
  fetch('/get-user-invites')
    .then(response => response.json())
    .then(data => {
     // console.log('Fetched team member:', data.team);

      // fetching an array of team data
      const team = data.team;
      const inviteCount = data.inviteCount;

      // Get the tbody element to append rows
      const teamBody = document.getElementById('team-body');
      if (team && team.length > 0) {
        document.getElementById('nomembers').textContent = "Your team members. Keep inviting to build a strong team";
        // Loop through team and append rows
        team.forEach(teammember => {
          const row = document.createElement('tr');
          const invitedCell = document.createElement('td');
          invitedCell.textContent = teammember.invited;
          row.appendChild(invitedCell);

          const firstrechargeCell = document.createElement('td');
          firstrechargeCell.textContent = teammember.firstrecharge;
          row.appendChild(firstrechargeCell);

          const earnedCell = document.createElement('td');
          earnedCell.textContent = teammember.earned;
          row.appendChild(earnedCell);

          const todayProfitCell = document.createElement('td');
          todayProfitCell.textContent = teammember.profit;
          row.appendChild(todayProfitCell);

          // Append a new column for 3% of todayProfit
          const profit3PercentCell = document.createElement('td');
          const todayProfitValue = parseFloat(teammember.profit);
          const profit3Percent = (todayProfitValue * 0.03).toFixed(2); // 3% of todayProfit
          profit3PercentCell.textContent = profit3Percent;
          row.appendChild(profit3PercentCell);

          teamBody.appendChild(row);
        });

        // Add a new row for totals
        const totalsRow = document.createElement('tr');
        totalsRow.style.fontWeight = 'bold'; // Make totals row bold for better visibility

        const totalLabelCell = document.createElement('td');
        totalLabelCell.textContent = 'Totals:';
        totalsRow.appendChild(totalLabelCell);

        // Calculate totals for each column
        const totals = {
          firstrecharge: 0,
          earned: 0,
          todayProfit: 0,
          profit3Percent: 0,
        };

        team.forEach(teammember => {
          totals.firstrecharge += parseFloat(teammember.firstrecharge);
          totals.earned += parseFloat(teammember.earned);
          totals.todayProfit += parseFloat(teammember.profit);
          totals.profit3Percent += parseFloat((teammember.profit * 0.03).toFixed(2));
        });

        // Append total values to the totals row
        Object.keys(totals).forEach(column => {
          const totalCell = document.createElement('td');
          totalCell.textContent = totals[column].toFixed(2);
          totalsRow.appendChild(totalCell);
        });

        teamBody.appendChild(totalsRow);

        // Set totals as text content for the "today" and "yesterday" divs
       // document.getElementById('today').textContent = totals.todayProfit.toFixed(2);
        document.getElementById('yesterday').textContent = `KES. ${totals.profit3Percent.toFixed(2)}`;
      } else {
        // No transactions, hide the table and display a message
        document.getElementById('team-table').style.display = 'none';
        document.getElementById('nomembers').textContent = ` You have not invited any member`;
        document.getElementById('nomembers').style.display = 'block';
      }
    })
    .catch(error => {
      console.error('Error fetching user transactions:', error);
      // Handling the error
    });
});



//Deposit Verification
function verifyPayment() {
      const transactionId = document.getElementById('transactionId').value;
      if (transactionId =="") {

            document.getElementById("id-error-message").style.color = "red";
            document.getElementById("id-error-message").textContent = "Please fill in the transaction ID";
            return;
        } else {
            document.getElementById("id-error-message").textContent = "";
        

      // Making a post requst to verify the deposit transaction
      fetch('/verifyPayment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ transactionId }),
      })
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          alert(data.error); // Showing error message to the user
        }
        else if (data.error1) {
          nopaymentFound()
          }
          else if (data.error2) {
            codeUsed()
            }
        else if (data.success) {
          showDepositCard()
         } 
      })
      .catch(error => {
        console.error('Error verifying payment:', error);
        alert('An error occurred. Please try again.'); // Show a generic error message
      });
    }
  }

  // Handling useer withdrawals
function withdraw() {
  const withdrawalatammount = document.getElementById("withdrawalatammount").value;
  const phonenumbertext = document.getElementById("phonenumbertext").value;

    // Fetching to the server
  fetch('/withdraw', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ withdrawalatammount, phonenumbertext }),
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        showWithdrawCard()
        
      } else {
        alert('Withdrawal request failed. Please try again.');

        // Error handling
      }
    })
    .catch(error => {
      console.error('Error during withdrawal:', error);
      // Error handling
    });
}

// Handling user logout
const logoutButton = document.getElementById('logoutsecction');

logoutButton.addEventListener('click', async () => {
  // Confirming if user realy wants to logout
  const confirmLogout = window.confirm('Are you sure you want to logout?');

  if (confirmLogout) {
    // If the user confirms, make a request to the logout route on the server
    const response = await fetch('/logout', { method: 'GET' });

    if (response.ok) {
      // If the logout was successful, redirect the user to the login page
      window.location.href = '/login';
    } else {
      // Handle any errors that occurred during logout
      console.error('Error during logout:', response.statusText);
      // Displaying any error message
    }
  }
  // Handling incase the user cancels
});

//deposit section
function dp(){
  const dpvalue = document.getElementById("depositammount").value;

  if(dpvalue < 500){
    document.getElementById("depositamount-error-message").style.color = "red";
    document.getElementById("depositamount-error-message").textContent = "Minimum deposit KES.500";
    document.getElementById('depositsteps').style.display = 'none';
    document.getElementById("payammount").value ="";
    
    return;
} else {
  document.getElementById("payammount").textContent = dpvalue;
    document.getElementById("depositamount-error-message").textContent = "";
    document.getElementById('depositsteps').style.display = 'block';
    

  }if(dpvalue > 450000){
    
    document.getElementById("depositamount-error-message").style.color = "red";
    document.getElementById("depositamount-error-message").textContent = "Maximum deposit KES.450000";
    document.getElementById('depositsteps').style.display = 'none';
    document.getElementById("payammount").value ="";
    
    return;
} else {
  document.getElementById("payammount").textContent = dpvalue;
    document.getElementById("depositamount-error-message").textContent = "";
    document.getElementById('depositsteps').style.display = 'block';
    
  }
}

//Withdrawal secction
function wd(){
  const wdvalue = document.getElementById("withdrawalatammount").value;
  const accountBallanceElement = document.getElementById("account_ballance");
  const accountBallanceText = accountBallanceElement.textContent;
  const accountBallance = parseFloat(accountBallanceText.replace('KES.', '').trim());
  const phonenumberElement = document.getElementById("account_phonenumber");
  const phonenumberText = phonenumberElement.textContent;
  

  if(wdvalue < 500){
    document.getElementById("withdrwal-error-message").style.color = "red";
    document.getElementById("withdrwal-error-message").textContent = "Minimum withdrawal KES.500";
    document.getElementById('withdrawalconfirmation').style.display = 'none';
    document.getElementById('withdrawalconfirmationbutton').style.display = 'none';
    document.getElementById("phonenumbertext").value = "";
   
    
    return;
} else {
  document.getElementById("withdrwal-error-message").textContent = "";
  document.getElementById("withdrawalconfirmationatammount").textContent = wdvalue;
  document.getElementById("withdrawalphone").textContent = phonenumberText;
  document.getElementById("phonenumbertext").value = phonenumberText;
  document.getElementById('withdrawalconfirmation').style.display = 'block';
  document.getElementById('withdrawalconfirmationbutton').style.display = 'block';
  
  }if(wdvalue > 450000){
    
    document.getElementById("withdrwal-error-message").style.color = "red";
    document.getElementById("withdrwal-error-message").textContent = "Maximum withdrawal KES.450000";
    document.getElementById('withdrawalconfirmation').style.display = 'none';
    document.getElementById('withdrawalconfirmationbutton').style.display = 'none';
    document.getElementById("phonenumbertext").value = "";
  //  document.getElementById("withdrawalatammount").value ="";
    
    return;
} else {
  document.getElementById("withdrwal-error-message").textContent = "";
  document.getElementById("withdrawalconfirmationatammount").textContent = wdvalue;
  document.getElementById("withdrawalphone").textContent = phonenumberText;
  document.getElementById("phonenumbertext").value = phonenumberText;
  document.getElementById('withdrawalconfirmation').style.display = 'block';
  document.getElementById('withdrawalconfirmationbutton').style.display = 'block';
    
  }if(wdvalue > accountBallance){
    
    document.getElementById("withdrwal-error-message").style.color = "red";
    document.getElementById("withdrwal-error-message").textContent = "Insufficient funds. Your account ballance is KES."+ accountBallance;
    document.getElementById('withdrawalconfirmation').style.display = 'none';
    document.getElementById('withdrawalconfirmationbutton').style.display = 'none';
    document.getElementById("phonenumbertext").value = "";
    //document.getElementById("withdrawalatammount").value ="";
    
    return;
} else {
  document.getElementById("withdrwal-error-message").textContent = "";
  document.getElementById("withdrawalconfirmationatammount").textContent = wdvalue;
  document.getElementById("withdrawalphone").textContent = phonenumberText;
  document.getElementById("phonenumbertext").value = phonenumberText;
  document.getElementById('withdrawalconfirmation').style.display = 'block';
  document.getElementById('withdrawalconfirmationbutton').style.display = 'block';
    
  }
}
// Reload the current page
function pr() {
  
  location.reload();
}
function hideWithdrawalhistory(){
  document.getElementById("withdrawals-table").style.display = 'none';
  document.getElementById("showwithdrawalhistory").style.display = 'block';
  document.getElementById("hidewithdrawalhistory").style.display = 'none';
}
function showWithdrawalhistory(){
  const withdrawalstable = document.getElementById("withdrawals-table");
  withdrawalstable.style.display = 'block';
  withdrawalstable.style.width = '100%';
  document.getElementById("showwithdrawalhistory").style.display = 'none';
  document.getElementById("hidewithdrawalhistory").style.display = 'block';
}

function showDepositCard(){
  const overlay = document.getElementById('overlay');
  const depositcard = document.getElementById("depositcad");
  depositcard.style.display = "block";
  overlay.style.display = "block";
}

function hideDepositCard(){
  const overlay = document.getElementById('overlay');
  const depositcard = document.getElementById("depositcad");
  depositcard.style.display = "none";
  overlay.style.display = "none";
  pr();
}

function nopaymentFound(){
  const nopayment = document.getElementById("nopayment");
  nopayment.style.display = "block";
 

  setTimeout(function() {
    nopayment.style.display = 'none';
}, 6000);

}

function codeUsed(){
  const codeUsed = document.getElementById("codeUsed");
  codeUsed.style.display = "block";
 
  setTimeout(function() {
    codeUsed.style.display = 'none';
}, 4000);
}

function SuccessPromoCard() {
  var successpromocard = document.getElementById('successpromocard');
  
  successpromocard.style.display = 'block';

  // Automatically hide the floating card after 3 seconds
  setTimeout(function() {
      successpromocard.style.display = 'none';
  }, 4000);
}


function errorPromoCard() {
  var errorpromocard = document.getElementById('errorpromocard');
  
  errorpromocard.style.display = 'block';

  // Automatically hide the floating card after 3 seconds
  setTimeout(function() {
      errorpromocard.style.display = 'none';
  }, 4000);
}

function showWithdrawCard(){
  const overlay = document.getElementById('overlay2');
  const withdraw = document.getElementById("withdraw");
  withdraw.style.display = "block";
  overlay.style.display = "block";
}

function hideWithdraw(){
  const overlay = document.getElementById('overlay2');
  const withdraw = document.getElementById("withdraw");
  withdraw.style.display = "none";
  overlay.style.display = "none";
  pr();
}

function showinvitation(){
  const overlay3 = document.getElementById('overlay3');
  const copylink = document.getElementById("copylink");
  copylink.style.display = "block";
  overlay3.style.display = "block";
  
}

function hideinvitation(){
  const overlay3 = document.getElementById('overlay3');
  const copylink = document.getElementById("copylink");
  copylink.style.display = "none";
  overlay3.style.display = "none";
  
}

document.addEventListener('DOMContentLoaded', function () {
  // Fetch the latest questions from the server
  fetch('/get-latest-questions')
    .then(response => response.json())
    .then(data => {
      const latestQuestions = data.latestQuestions;

      // Update each section with a question
      for (let i = 1; i <= 11; i++) {
        const section = document.getElementById(`section${i}`);
        if (latestQuestions && latestQuestions[i - 1]) {
          section.textContent = latestQuestions[i - 1];
        } else {
          section.textContent = 'Nothing to promote at the moment.';
        }
      }
    })
    .catch(error => {
      console.error('Error fetching latest questions:', error);
    });
});

document.addEventListener('DOMContentLoaded', function () {
  // Create an Audio object
  var audio = new Audio('path/to/your/soundfile.mp3'); // Replace with the actual path to your sound file

  // Get the button element
  var playButton = document.getElementById('playButton');

  });

//Plans view

//fetching user withdrawal transactions on page reloade
document.addEventListener('DOMContentLoaded', function () {
  ///////////console.log('Fetching plans');
  fetch('/get-level1-plans')
    .then(response => response.json())
    .then(data => {
    //  console.log('Fetched transactions:', data.transactions);

      // Fetching an array of data
      const transactions = data.transactions;

      // Get the tbody element to append rows
      const plansBody = document.getElementById('planslevel1-body');
      if (transactions && transactions.length > 0) {
       // Loop through transactions and append rows
        transactions.forEach(transaction => {
        const row = document.createElement('tr');
        const dayCell = document.createElement('td');
        dayCell.textContent = transaction.day;
        row.appendChild(dayCell);

        const capitalCell = document.createElement('td');
        capitalCell.textContent = transaction.capital;
        row.appendChild(capitalCell);

        const promotionCell = document.createElement('td');
        promotionCell.textContent = transaction.promotion;
        row.appendChild(promotionCell);

        const percentageCell = document.createElement('td');
        percentageCell.textContent = transaction.percentage;
        row.appendChild(percentageCell);

        const profitCell = document.createElement('td');
        profitCell.textContent = transaction.profit;
        row.appendChild(profitCell);

        const totalCell = document.createElement('td');
        totalCell.textContent = transaction.total;
        row.appendChild(totalCell);


        plansBody.appendChild(row);
      });

    }       
    })
    .catch(error => {
      console.error('Error fetching user transactions:', error);
      // Handling the error
    });
});

//fetching user withdrawal transactions on page reloade
document.addEventListener('DOMContentLoaded', function () {
  ///////////console.log('Fetching plans');
  fetch('/get-level2-plans')
    .then(response => response.json())
    .then(data => {
   //   console.log('Fetched transactions:', data.transactions);

      // Fetching an array of data
      const transactions = data.transactions;

      // Get the tbody element to append rows
      const plans2Body = document.getElementById('planslevel2-body');
      if (transactions && transactions.length > 0) {
       // Loop through transactions and append rows
        transactions.forEach(transaction => {
        const row = document.createElement('tr');
        const dayCell = document.createElement('td');
        dayCell.textContent = transaction.day;
        row.appendChild(dayCell);

        const capitalCell = document.createElement('td');
        capitalCell.textContent = transaction.capital;
        row.appendChild(capitalCell);

        const promotionCell = document.createElement('td');
        promotionCell.textContent = transaction.promotion;
        row.appendChild(promotionCell);

        const percentageCell = document.createElement('td');
        percentageCell.textContent = transaction.percentage;
        row.appendChild(percentageCell);

        const profitCell = document.createElement('td');
        profitCell.textContent = transaction.profit;
        row.appendChild(profitCell);

        const totalCell = document.createElement('td');
        totalCell.textContent = transaction.total;
        row.appendChild(totalCell);


        plans2Body.appendChild(row);
      });

    }       
    })
    .catch(error => {
      console.error('Error fetching user transactions:', error);
      // Handling the error
    });
});


//fetching user withdrawal transactions on page reloade
document.addEventListener('DOMContentLoaded', function () {
  ///////////console.log('Fetching plans');
  fetch('/get-level3-plans')
    .then(response => response.json())
    .then(data => {
    ///  console.log('Fetched transactions:', data.transactions);

      // Fetching an array of data
      const transactions = data.transactions;

      // Get the tbody element to append rows
      const plans3Body = document.getElementById('planslevel3-body');
      if (transactions && transactions.length > 0) {
       // Loop through transactions and append rows
        transactions.forEach(transaction => {
        const row = document.createElement('tr');
        const dayCell = document.createElement('td');
        dayCell.textContent = transaction.day;
        row.appendChild(dayCell);

        const capitalCell = document.createElement('td');
        capitalCell.textContent = transaction.capital;
        row.appendChild(capitalCell);

        const promotionCell = document.createElement('td');
        promotionCell.textContent = transaction.promotion;
        row.appendChild(promotionCell);

        const percentageCell = document.createElement('td');
        percentageCell.textContent = transaction.percentage;
        row.appendChild(percentageCell);

        const profitCell = document.createElement('td');
        profitCell.textContent = transaction.profit;
        row.appendChild(profitCell);

        const totalCell = document.createElement('td');
        totalCell.textContent = transaction.total;
        row.appendChild(totalCell);


        plans3Body.appendChild(row);
      });

    }       
    })
    .catch(error => {
      console.error('Error fetching user transactions:', error);
      // Handling the error
    });
});

//fetching user plans on page reloade
document.addEventListener('DOMContentLoaded', function () {
  //console.log('Fetching plans');
  fetch('/get-level4-plans')
    .then(response => response.json())
    .then(data => {
      //console.log('Fetched transactions:', data.transactions);

      // Fetching an array of data
      const transactions = data.transactions;

      // Get the tbody element to append rows
      const plans4Body = document.getElementById('planslevel4-body');
      if (transactions && transactions.length > 0) {
       // Loop through transactions and append rows
        transactions.forEach(transaction => {
        const row = document.createElement('tr');
        const dayCell = document.createElement('td');
        dayCell.textContent = transaction.day;
        row.appendChild(dayCell);

        const capitalCell = document.createElement('td');
        capitalCell.textContent = transaction.capital;
        row.appendChild(capitalCell);

        const promotionCell = document.createElement('td');
        promotionCell.textContent = transaction.promotion;
        row.appendChild(promotionCell);

        const percentageCell = document.createElement('td');
        percentageCell.textContent = transaction.percentage;
        row.appendChild(percentageCell);

        const profitCell = document.createElement('td');
        profitCell.textContent = transaction.profit;
        row.appendChild(profitCell);

        const totalCell = document.createElement('td');
        totalCell.textContent = transaction.total;
        row.appendChild(totalCell);


        plans4Body.appendChild(row);
      });

    }       
    })
    .catch(error => {
      console.error('Error fetching user transactions:', error);
      // Handling the error
    });
});

//fetching user plans on page reloade
document.addEventListener('DOMContentLoaded', function () {
  //console.log('Fetching plans');
  fetch('/get-level5-plans')
    .then(response => response.json())
    .then(data => {
      //console.log('Fetched transactions:', data.transactions);

      // Fetching an array of data
      const transactions = data.transactions;

      // Get the tbody element to append rows
      const plans5Body = document.getElementById('planslevel5-body');
      if (transactions && transactions.length > 0) {
       // Loop through transactions and append rows
        transactions.forEach(transaction => {
        const row = document.createElement('tr');
        const dayCell = document.createElement('td');
        dayCell.textContent = transaction.day;
        row.appendChild(dayCell);

        const capitalCell = document.createElement('td');
        capitalCell.textContent = transaction.capital;
        row.appendChild(capitalCell);

        const promotionCell = document.createElement('td');
        promotionCell.textContent = transaction.promotion;
        row.appendChild(promotionCell);

        const percentageCell = document.createElement('td');
        percentageCell.textContent = transaction.percentage;
        row.appendChild(percentageCell);

        const profitCell = document.createElement('td');
        profitCell.textContent = transaction.profit;
        row.appendChild(profitCell);

        const totalCell = document.createElement('td');
        totalCell.textContent = transaction.total;
        row.appendChild(totalCell);


        plans5Body.appendChild(row);
      });

    }       
    })
    .catch(error => {
      console.error('Error fetching user transactions:', error);
      // Handling the error
    });
});

//fetching user plans on page reloade
document.addEventListener('DOMContentLoaded', function () {
  //console.log('Fetching plans');
  fetch('/get-level6-plans')
    .then(response => response.json())
    .then(data => {
      //console.log('Fetched transactions:', data.transactions);

      // Fetching an array of data
      const transactions = data.transactions;

      // Get the tbody element to append rows
      const plans6Body = document.getElementById('planslevel6-body');
      if (transactions && transactions.length > 0) {
       // Loop through transactions and append rows
        transactions.forEach(transaction => {
        const row = document.createElement('tr');
        const dayCell = document.createElement('td');
        dayCell.textContent = transaction.day;
        row.appendChild(dayCell);

        const capitalCell = document.createElement('td');
        capitalCell.textContent = transaction.capital;
        row.appendChild(capitalCell);

        const promotionCell = document.createElement('td');
        promotionCell.textContent = transaction.promotion;
        row.appendChild(promotionCell);

        const percentageCell = document.createElement('td');
        percentageCell.textContent = transaction.percentage;
        row.appendChild(percentageCell);

        const profitCell = document.createElement('td');
        profitCell.textContent = transaction.profit;
        row.appendChild(profitCell);

        const totalCell = document.createElement('td');
        totalCell.textContent = transaction.total;
        row.appendChild(totalCell);


        plans6Body.appendChild(row);
      });

    }       
    })
    .catch(error => {
      console.error('Error fetching user transactions:', error);
      // Handling the error
    });
});

//fetching user plans on page reloade
document.addEventListener('DOMContentLoaded', function () {
  //console.log('Fetching plans');
  fetch('/get-level7-plans')
    .then(response => response.json())
    .then(data => {
      //console.log('Fetched transactions:', data.transactions);

      // Fetching an array of data
      const transactions = data.transactions;

      // Get the tbody element to append rows
      const plans7Body = document.getElementById('planslevel7-body');
      if (transactions && transactions.length > 0) {
       // Loop through transactions and append rows
        transactions.forEach(transaction => {
        const row = document.createElement('tr');
        const dayCell = document.createElement('td');
        dayCell.textContent = transaction.day;
        row.appendChild(dayCell);

        const capitalCell = document.createElement('td');
        capitalCell.textContent = transaction.capital;
        row.appendChild(capitalCell);

        const promotionCell = document.createElement('td');
        promotionCell.textContent = transaction.promotion;
        row.appendChild(promotionCell);

        const percentageCell = document.createElement('td');
        percentageCell.textContent = transaction.percentage;
        row.appendChild(percentageCell);

        const profitCell = document.createElement('td');
        profitCell.textContent = transaction.profit;
        row.appendChild(profitCell);

        const totalCell = document.createElement('td');
        totalCell.textContent = transaction.total;
        row.appendChild(totalCell);


        plans7Body.appendChild(row);
      });

    }       
    })
    .catch(error => {
      console.error('Error fetching user transactions:', error);
      // Handling the error
    });
});

//fetching user plans on page reloade
document.addEventListener('DOMContentLoaded', function () {
  //console.log('Fetching plans');
  fetch('/get-level8-plans')
    .then(response => response.json())
    .then(data => {
      //console.log('Fetched transactions:', data.transactions);

      // Fetching an array of data
      const transactions = data.transactions;

      // Get the tbody element to append rows
      const plans8Body = document.getElementById('planslevel8-body');
      if (transactions && transactions.length > 0) {
       // Loop through transactions and append rows
        transactions.forEach(transaction => {
        const row = document.createElement('tr');
        const dayCell = document.createElement('td');
        dayCell.textContent = transaction.day;
        row.appendChild(dayCell);

        const capitalCell = document.createElement('td');
        capitalCell.textContent = transaction.capital;
        row.appendChild(capitalCell);

        const promotionCell = document.createElement('td');
        promotionCell.textContent = transaction.promotion;
        row.appendChild(promotionCell);

        const percentageCell = document.createElement('td');
        percentageCell.textContent = transaction.percentage;
        row.appendChild(percentageCell);

        const profitCell = document.createElement('td');
        profitCell.textContent = transaction.profit;
        row.appendChild(profitCell);

        const totalCell = document.createElement('td');
        totalCell.textContent = transaction.total;
        row.appendChild(totalCell);


        plans8Body.appendChild(row);
      });

    }       
    })
    .catch(error => {
      console.error('Error fetching user transactions:', error);
      // Handling the error
    });
});

//fetching user plans on page reloade
document.addEventListener('DOMContentLoaded', function () {
  //console.log('Fetching plans');
  fetch('/get-level9-plans')
    .then(response => response.json())
    .then(data => {
      //console.log('Fetched transactions:', data.transactions);

      // Fetching an array of data
      const transactions = data.transactions;

      // Get the tbody element to append rows
      const plans9Body = document.getElementById('planslevel9-body');
      if (transactions && transactions.length > 0) {
       // Loop through transactions and append rows
        transactions.forEach(transaction => {
        const row = document.createElement('tr');
        const dayCell = document.createElement('td');
        dayCell.textContent = transaction.day;
        row.appendChild(dayCell);

        const capitalCell = document.createElement('td');
        capitalCell.textContent = transaction.capital;
        row.appendChild(capitalCell);

        const promotionCell = document.createElement('td');
        promotionCell.textContent = transaction.promotion;
        row.appendChild(promotionCell);

        const percentageCell = document.createElement('td');
        percentageCell.textContent = transaction.percentage;
        row.appendChild(percentageCell);

        const profitCell = document.createElement('td');
        profitCell.textContent = transaction.profit;
        row.appendChild(profitCell);

        const totalCell = document.createElement('td');
        totalCell.textContent = transaction.total;
        row.appendChild(totalCell);


        plans9Body.appendChild(row);
      });

    }       
    })
    .catch(error => {
      console.error('Error fetching user transactions:', error);
      // Handling the error
    });
});

//fetching user plans on page reloade
document.addEventListener('DOMContentLoaded', function () {
  //console.log('Fetching plans');
  fetch('/get-level10-plans')
    .then(response => response.json())
    .then(data => {
      //console.log('Fetched transactions:', data.transactions);

      // Fetching an array of data
      const transactions = data.transactions;

      // Get the tbody element to append rows
      const plans10Body = document.getElementById('planslevel10-body');
      if (transactions && transactions.length > 0) {
       // Loop through transactions and append rows
        transactions.forEach(transaction => {
        const row = document.createElement('tr');
        const dayCell = document.createElement('td');
        dayCell.textContent = transaction.day;
        row.appendChild(dayCell);

        const capitalCell = document.createElement('td');
        capitalCell.textContent = transaction.capital;
        row.appendChild(capitalCell);

        const promotionCell = document.createElement('td');
        promotionCell.textContent = transaction.promotion;
        row.appendChild(promotionCell);

        const percentageCell = document.createElement('td');
        percentageCell.textContent = transaction.percentage;
        row.appendChild(percentageCell);

        const profitCell = document.createElement('td');
        profitCell.textContent = transaction.profit;
        row.appendChild(profitCell);

        const totalCell = document.createElement('td');
        totalCell.textContent = transaction.total;
        row.appendChild(totalCell);


        plans10Body.appendChild(row);
      });

    }       
    })
    .catch(error => {
      console.error('Error fetching user transactions:', error);
      // Handling the error
    });
});

window.onload = function () {
  // Retrieve account balance
  const accountBalanceElement = document.getElementById("account_ballance");
  const accountBalanceText = accountBalanceElement.textContent;
  const accountBalance = parseFloat(accountBalanceText.replace('KES.', '').trim());

  // Array of activation balances for each level
  const activationBalances = [500, 1500, 4000, 10000, 20000, 50000, 100000, 300000, 500000, 1000000];

  // Find the current level based on the account balance
  let currentLevel = 0;
  for (let i = 0; i < activationBalances.length; i++) {
    const activationBalance = activationBalances[i];
    if (accountBalance >= activationBalance) {
      currentLevel = i + 1;
    }
  }

  // Set the text content of "current_account" div
  const currentAccountElement = document.getElementById("current_account");
  currentAccountElement.textContent = currentLevel > 0 ? `${currentLevel}` : "Free";

  // Iterate through levels
  for (let i = 0; i < activationBalances.length; i++) {
    const activationBalance = activationBalances[i];

    // Lock or unlock the level based on the account balance
    const levelStatusElement = document.getElementById(`level${i + 1}status`);
    const levelElement = document.getElementById(`level${i + 1}`);
    const levelH3Element = document.querySelector(`#level${i + 1} h3`);
    levelStatusElement.src = accountBalance < activationBalance ? "locked.png" : "";

    // Set pointer-events to "none" if the level is locked
    if (accountBalance < activationBalance) {
      levelElement.style.pointerEvents = "none";
      levelH3Element.textContent = `Unlock with KES ${activationBalance}`;
    } else {
      levelElement.style.pointerEvents = "auto"; // Set it back to "auto" if the level is unlocked
    }

    // Attach the click event listener (no need to check for locked status here)
    levelElement.addEventListener("click", function (event) {
      // Handle click event for each level
    });
  }
};


document.addEventListener('DOMContentLoaded', () => {
  // Add click event listeners to the buttons
  for (let i = 1; i <= 10; i++) {
    const levelButton = document.getElementById(`level${i}`);
    levelButton.addEventListener('click', () => updateLevel(`level${i}`));
  }
});

async function updateLevel(level) {
  try {
    const response = await fetch(`/update-level/${level}`, {
      method: 'POST',
      credentials: 'include', // Include cookies for session tracking
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (response.ok) {
      //console.log(data.message);
      
      SuccessPromoCard()
      
      //alert(data.success);
      // Handle success, e.g., display a success message to the user
    } else {
      errorPromoCard()

      //alert(data.error);
      //console.error(data.error);
      // Handle error, e.g., display an error message to the user
    }
  } catch (error) {
    console.error('Error updating level:', error);
    // Handle unexpected errors, e.g., display a generic error message to the user
  }
}



async function updatefreeLevel() {
  try {
    const response = await fetch('/update-freelevel', {
      method: 'POST',
      credentials: 'include', // Include cookies for session tracking
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (response.ok) {
      //console.log(data.message);
      const successful = document.getElementById("successpromocard");
      SuccessPromoCard()
      successful.textContent = currentLevel > 0 ? `${currentLevel}` : "Free";
      
      //alert(data.success);
      // Handle success, e.g., display a success message to the user
    } else {
     
      errorPromoCard()

      //alert(data.error);
      //console.error(data.error);
      // Handle error, e.g., display an error message to the user
    }
  } catch (error) {
    console.error('Error updating level:', error);
    // Handle unexpected errors, e.g., display a generic error message to the user
  }
}



document.addEventListener('DOMContentLoaded', function () {
  setTimeout(() => {
    // Fetch values from the elements
    const todayProfitElement = document.getElementById('todayprofit');
    const yesterdayElement = document.getElementById('yesterday');
    const totalProfitElement = document.getElementById('totalprofit');

    // Extract numeric values from the elements
    const todayProfit = parseFloat(todayProfitElement.textContent.split(' ')[1]);
    const yesterdayProfitText = yesterdayElement.textContent.split(' ')[1];
    const yesterdayProfit = parseFloat(yesterdayProfitText);

    // Logging for debugging
    
    // Check if yesterdayProfit is a valid number
    if (!isNaN(yesterdayProfit)) {
      // Calculate total profit
      const totalProfit = todayProfit + yesterdayProfit;

            // Set the total profit as text content for the "totalprofit" element
      totalProfitElement.textContent = `KES. ${totalProfit.toFixed(2)}`;
    } else {
      console.log("Error: Unable to parse yesterdayProfit");
    }
  }, 1000); // Delayed for 1000 milliseconds (1 second)
});




