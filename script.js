// Get references to DOM elements
let form = document.getElementById("studentForm");
let tableBody = document.querySelector("#studentTable tbody");
let addBtn = form.querySelector("button[type='submit']");
let cancelBtn = null; // Will hold reference to cancel button if it's created
let students = JSON.parse(localStorage.getItem("students")) || []; // Load students from localStorage or initialize empty array

let editIndex = null; // Track the index of the student being edited

// Function to render all student rows in the table
function renderStudents() {
  tableBody.innerHTML = ""; // Clear existing rows

  // Loop through all students and create rows
  students.forEach((student, index) => {
    let row = document.createElement("tr");

    // Fill in student data and add Edit/Delete buttons
    row.innerHTML = `
      <td>${student.name}</td>
      <td>${student.studentId}</td>
      <td>${student.email}</td>
      <td>${student.contact}</td>
      <td>
        <div class="edit-delete-wrapper">
            <button class="editBtn" data-index="${index}">Edit</button>
            <button class="deleteBtn" onclick="deleteStudent(${index})">Delete</button>
        </div>
      </td>
    `;

    tableBody.appendChild(row); // Append row to the table body
  });

  // Attach event listeners to all Edit buttons
  let editButtons = document.querySelectorAll(".editBtn");
  editButtons.forEach((btn) => {
    btn.addEventListener("click", handleEdit);
  });
}

// Handle Edit button click
function handleEdit(e) {
  let index = e.target.getAttribute("data-index"); // Get student index
  let student = students[index]; // Get student data

  // Fill form inputs with the selected student's data
  document.getElementById("name").value = student.name;
  document.getElementById("studentId").value = student.studentId;
  document.getElementById("email").value = student.email;
  document.getElementById("contact").value = student.contact;

  editIndex = index; // Store index for updating
  addBtn.textContent = "Update Student"; // Change button text to indicate update mode

  // If Cancel button doesn't exist, create and add it
  if (!cancelBtn) {
    cancelBtn = document.createElement("button");
    cancelBtn.textContent = "Cancel";
    cancelBtn.className = "cancelBtn";
    cancelBtn.style.marginLeft = "10px";

    addBtn.parentNode.appendChild(cancelBtn); // Append next to Add/Update button

    // On Cancel click, reset the form and UI
    cancelBtn.addEventListener("click", () => {
      resetForm();
    });
  }
}

// Handle form submission for Add or Update
form.addEventListener("submit", (e) => {
  e.preventDefault(); // Prevent form from submitting normally

  // Read values from inputs and trim spaces
  let name = document.getElementById("name").value.trim();
  let studentId = document.getElementById("studentId").value.trim();
  let email = document.getElementById("email").value.trim();
  let contact = document.getElementById("contact").value.trim();

  // Input validations
  if (!name || !studentId || !email || !contact) return alert("All fields are required.");
  if (!/^[a-zA-Z\s]+$/.test(name)) return alert("Name must contain only letters.");
  if (!/^\d+$/.test(studentId)) return alert("Student ID must be numeric.");
  if (!/^\d+$/.test(contact)) return alert("Contact must be numeric.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return alert("Invalid email format.");

  let student = { name, studentId, email, contact }; // Create student object

  if (editIndex === null) {
    // If not in edit mode, add new student
    students.push(student);
  } else {
    // If in edit mode, update existing student at index
    students[editIndex] = student;
  }

  // Save updated data to localStorage and re-render table
  localStorage.setItem("students", JSON.stringify(students));
  renderStudents();
  resetForm(); // Reset form after submission
});

// Handle Delete button click
function deleteStudent(index) {
  if (confirm("Are you sure?")) {
    students.splice(index, 1); // Remove student at given index
    localStorage.setItem("students", JSON.stringify(students)); // Update storage
    renderStudents(); // Re-render table
    resetForm(); // Reset form in case user was editing
  }
}

// Reset the form to its default state
function resetForm() {
  document.getElementById("studentForm").reset(); // Clear inputs
  addBtn.textContent = "Register"; // Restore original button text
  editIndex = null; // Clear edit state

  // Remove cancel button if it exists
  if (cancelBtn) {
    cancelBtn.remove();
    cancelBtn = null;
  }
}

// Initial rendering of data on page load
renderStudents();
