document.addEventListener('DOMContentLoaded', () => {
    // Parse JSON data from the included JS files
    const stocksData = JSON.parse(stockContent);
    const userData = JSON.parse(userContent);
    
    // Initialize the dashboard by generating the user list
    generateUserList(userData, stocksData);
    
    // Register event listeners for the save and delete buttons
    const saveButton = document.querySelector('#btnSave');
    const deleteButton = document.querySelector('#btnDelete');
    
    // Register the event listener on the save button
    saveButton.addEventListener('click', (event) => {
      // Prevent form submission (to maintain form state)
      event.preventDefault();
  
      // Find the user object in our data
      const id = document.querySelector('#userID').value;
  
      for (let i = 0; i < userData.length; i++) {
        // Found relevant user, so update object at this index and redisplay
        if (userData[i].id == id) {
          userData[i].user.firstname = document.querySelector('#firstname').value;
          userData[i].user.lastname = document.querySelector('#lastname').value;
          userData[i].user.address = document.querySelector('#address').value;
          userData[i].user.city = document.querySelector('#city').value;
          userData[i].user.email = document.querySelector('#email').value;     
  
          generateUserList(userData, stocksData);
          break;
        }
      }
    });
    
    // Register the event listener on the delete button
    deleteButton.addEventListener('click', (event) => {
      // Prevent form submission (to maintain form state)
      event.preventDefault();
  
      // Find the index of the user in the data array 
      const userId = document.querySelector('#userID').value;
      const userIndex = userData.findIndex(user => user.id == userId);
      
      // Remove the user from the array
      userData.splice(userIndex, 1);
      
      // Clear the form
      clearForm();
      
      // Render the updated user list
      generateUserList(userData, stocksData);
    });
  });
  
  /**
   * Loops through the users and renders a ul with li elements for each user
   * @param {*} users - Array of user objects
   * @param {*} stocks - Array of stock objects
   */
  function generateUserList(users, stocks) {
    // Get the list element and clear out the list from previous render
    const userList = document.querySelector('.user-list');
    userList.innerHTML = '';
    
    // For each user create a list item and append it to the list
    users.forEach(({user, id}) => {
      const listItem = document.createElement('li');
      listItem.innerText = user.lastname + ', ' + user.firstname;
      listItem.setAttribute('id', id);
      userList.appendChild(listItem);
    });
  
    // Register the event listener on the list using event delegation
    userList.addEventListener('click', (event) => handleUserListClick(event, users, stocks));
  }
  
  /**
   * Handles the click event on the user list
   * @param {*} event - Click event
   * @param {*} users - Array of user objects
   * @param {*} stocks - Array of stock objects
   */
  function handleUserListClick(event, users, stocks) {
    // Get the user id from the list item
    const userId = event.target.id;
    
    // Find the user in the userData array 
    // Use a "truthy" comparison because user id is a number and event target id is a string
    const user = users.find(user => user.id == userId);
    
    // Populate the form with the user's data
    populateForm(user);
    
    // Render the portfolio items for the user
    renderPortfolio(user, stocks);
  }
  
  /**
   * Populates the form with the user's data
   * @param {*} data - User data object
   */
  function populateForm(data) {
    // Use destructuring to get the user and id from the data object
    const { user, id } = data;
    document.querySelector('#userID').value = id;
    document.querySelector('#firstname').value = user.firstname;
    document.querySelector('#lastname').value = user.lastname;
    document.querySelector('#address').value = user.address;
    document.querySelector('#city').value = user.city;
    document.querySelector('#email').value = user.email;
  }
  
  /**
   * Clears the user form
   */
  function clearForm() {
    document.querySelector('#userID').value = '';
    document.querySelector('#firstname').value = '';
    document.querySelector('#lastname').value = '';
    document.querySelector('#address').value = '';
    document.querySelector('#city').value = '';
    document.querySelector('#email').value = '';
    
    // Also clear the portfolio and stock details
    document.querySelector('.portfolio-list').innerHTML = `
      <h3>Symbol</h3>
      <h3># Shares</h3>
      <h3>Actions</h3>
    `;
    document.querySelector('#stockName').textContent = '';
    document.querySelector('#stockSector').textContent = '';
    document.querySelector('#stockIndustry').textContent = '';
    document.querySelector('#stockAddress').textContent = '';
    document.querySelector('#logo').src = '';
  }
  
  /**
   * Renders the portfolio items for the user
   * @param {*} user - User object
   * @param {*} stocks - Array of stock objects
   */
  function renderPortfolio(user, stocks) {
    // Get the user's stock data
    const { portfolio } = user;
    
    // Get the portfolio list element
    const portfolioDetails = document.querySelector('.portfolio-list');
    
    // Clear the list from previous render but keep the headers
    portfolioDetails.innerHTML = `
      <h3>Symbol</h3>
      <h3># Shares</h3>
      <h3>Actions</h3>
    `;
    
    // Map over portfolio items and render them
    portfolio.forEach(({ symbol, owned }) => {
      // Create elements and append them to the list
      const symbolEl = document.createElement('p');
      const sharesEl = document.createElement('p');
      const actionEl = document.createElement('button');
      
      symbolEl.innerText = symbol;
      sharesEl.innerText = owned;
      actionEl.innerText = 'View';
      actionEl.setAttribute('id', symbol);
      
      portfolioDetails.appendChild(symbolEl);
      portfolioDetails.appendChild(sharesEl);
      portfolioDetails.appendChild(actionEl);
    });
    
    // Register event listeners for the View buttons using event delegation
    portfolioDetails.addEventListener('click', (event) => {
      // Only handle clicks on buttons
      if (event.target.tagName === 'BUTTON') {
        viewStock(event.target.id, stocks);
      }
    });
  }
  
  /**
   * Renders the stock information for the symbol
   * @param {*} symbol - Stock symbol
   * @param {*} stocks - Array of stock objects
   */
  function viewStock(symbol, stocks) {
    // Get the stock area element
    const stockArea = document.querySelector('.stock-form');
    
    if (stockArea) {
      // Find the stock object for this symbol
      const stock = stocks.find(s => s.symbol == symbol);
      
      // Populate the stock details
      document.querySelector('#stockName').textContent = stock.name;
      document.querySelector('#stockSector').textContent = stock.sector;
      document.querySelector('#stockIndustry').textContent = stock.subIndustry;
      document.querySelector('#stockAddress').textContent = stock.address;
      
      // Update the logo
      document.querySelector('#logo').src = `logos/${symbol}.svg`;
    }
  }

