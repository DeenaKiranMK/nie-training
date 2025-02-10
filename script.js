// script.js

// Get DOM elements
const balanceElement = document.getElementById('balance');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const dateInput = document.getElementById('date');
const categorySelect = document.getElementById('category');
const subCategorySelect = document.getElementById('sub-category');
const transactionList = document.getElementById('transaction-list');
const addTransactionButton = document.getElementById('add-transaction');
const messageElement = document.getElementById('message');

// Initialize an empty array for transactions and load from localStorage
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

// Function to update the balance
function updateBalance() {
  let balance = 0;
  transactions.forEach(transaction => {
    balance += transaction.category === 'income' ? transaction.amount : -transaction.amount;
  });
  balanceElement.textContent = `$${balance.toFixed(2)}`;
  checkExpensesLimit();
}

// Function to check if expenses exceed income
function checkExpensesLimit() {
  let totalIncome = 0;
  let totalExpense = 0;

  transactions.forEach(transaction => {
    if (transaction.category === 'income') totalIncome += transaction.amount;
    if (transaction.category === 'expense') totalExpense += transaction.amount;
  });

  if (totalExpense > totalIncome) {
    messageElement.textContent = 'Warning: Expenses exceed income!';
  } else {
    messageElement.textContent = '';
  }
}

// Function to render the transaction list
function renderTransactions() {
  transactionList.innerHTML = '';
  transactions.forEach((transaction, index) => {
    const transactionItem = document.createElement('li');
    transactionItem.classList.add(transaction.category);
    transactionItem.innerHTML = `
      ${transaction.description} - $${transaction.amount} (${transaction.category})<br>
      Category: ${transaction.subCategory} | Date: ${transaction.date}
      <button onclick="deleteTransaction(${index})">Delete</button>
      <button onclick="editTransaction(${index})">Edit</button>
    `;
    transactionList.appendChild(transactionItem);
  });
}

// Function to delete a transaction
function deleteTransaction(index) {
  transactions.splice(index, 1);
  localStorage.setItem('transactions', JSON.stringify(transactions));
  renderTransactions();
  updateBalance();
}

// Function to edit a transaction
function editTransaction(index) {
  const transaction = transactions[index];
  descriptionInput.value = transaction.description;
  amountInput.value = transaction.amount;
  dateInput.value = transaction.date;
  categorySelect.value = transaction.category;
  subCategorySelect.value = transaction.subCategory;

  // Delete the original transaction after editing so we can add a new one
  deleteTransaction(index);
}

// Function to handle the form submission
addTransactionButton.addEventListener('click', () => {
  const description = descriptionInput.value.trim();
  const amount = parseFloat(amountInput.value);
  const date = dateInput.value;
  const category = categorySelect.value;
  const subCategory = subCategorySelect.value;

  if (description && !isNaN(amount) && date) {
    const transaction = {
      description,
      amount,
      category,
      subCategory,
      date
    };

    // Add transaction to the array
    transactions.push(transaction);

    // Save transactions to localStorage
    localStorage.setItem('transactions', JSON.stringify(transactions));

    // Clear inputs
    descriptionInput.value = '';
    amountInput.value = '';
    dateInput.value = '';

    // Update UI
    renderTransactions();
    updateBalance();
  } else {
    alert('Please enter valid description, amount, and date.');
  }
});

// Initial render
renderTransactions();
updateBalance();
