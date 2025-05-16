import { collection, addDoc, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js";

const journalForm = document.getElementById("journalForm");
const confirmationMessage = document.getElementById("confirmationMessage");
const entriesContainer = document.getElementById("entries");

// Reference to Firestore collection
const entriesCollection = collection(window.db, "journalEntries");

// Load and render saved entries on page load
window.addEventListener("DOMContentLoaded", loadEntries);

journalForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  // Collect form values
  const entry = {
    date: new Date().toISOString(),  // ISO string for sorting
    answers: {
      q1: document.getElementById("q1").value,
      q2: document.getElementById("q2").value,
      q3: document.getElementById("q3").value,
      q4: document.getElementById("q4").value,
    },
  };

  try {
    // Save entry to Firestore
    await addDoc(entriesCollection, entry);

    // Show confirmation
    confirmationMessage.textContent = "Your entry has been saved!";
    confirmationMessage.style.display = "block";

    // Clear form
    journalForm.reset();

    // Re-render entries
    await loadEntries();

    // Hide confirmation after 3 seconds
    setTimeout(() => {
      confirmationMessage.style.display = "none";
    }, 3000);
  } catch (error) {
    confirmationMessage.textContent = "Error saving entry. Please try again.";
    confirmationMessage.style.display = "block";
    console.error("Error adding document: ", error);
  }
});

async function loadEntries() {
  entriesContainer.innerHTML = "";

  try {
    // Query entries ordered by date descending (newest first)
    const q = query(entriesCollection, orderBy("date", "desc"));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      entriesContainer.innerHTML = "<p>No entries yet—write something to see it here!</p>";
      return;
    }

    // Render each entry
    querySnapshot.forEach((doc) => {
      const entry = doc.data();

      const div = document.createElement("div");
      div.classList.add("entry");

      const formattedDate = new Date(entry.date).toLocaleString();

      div.innerHTML = `
        <p class="entry-date"><strong>Date:</strong> ${formattedDate}</p>
        <p><strong>Goals Progress:</strong> ${entry.answers.q1}</p>
        <p><strong>Tomorrow’s Improvement:</strong> ${entry.answers.q2}</p>
        <p><strong>Lessons Learned:</strong> ${entry.answers.q3}</p>
        <p><strong>Gratitude:</strong> ${entry.answers.q4}</p>
        <hr>
      `;
      entriesContainer.appendChild(div);
    });
  } catch (error) {
    entriesContainer.innerHTML = "<p>Error loading entries. Please refresh the page.</p>";
    console.error("Error getting documents: ", error);
  }
}
