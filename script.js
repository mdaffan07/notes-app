const notesGrid = document.getElementById("notes-grid");
const form = document.getElementById("note-form");
const titleInput = document.getElementById("note-title");
const textInput = document.getElementById("note-text");
const searchBar = document.getElementById("search-bar");

let selectedColor = "#fff740";

// pick color
const dots = document.querySelectorAll(".color-dot");
dots.forEach(function (dot) {
    dot.onclick = function () {
        selectedColor = dot.getAttribute("data-color");
    }
});

// load notes from localStorage
function getNotes() {
    let notes = localStorage.getItem("notes");
    if (notes) {
        return JSON.parse(notes);
    }
    return [];
}

// save notes
function saveNotes(notes) {
    localStorage.setItem("notes", JSON.stringify(notes));
}

// show notes
function showNotes() {
    let notes = getNotes();
    notesGrid.innerHTML = "";

    for (let i = 0; i < notes.length; i++) {
        let note = notes[i];

        let div = document.createElement("div");
        div.className = "note-card";
        div.style.background = note.color;

        div.innerHTML = `
                <h3>${note.title}</h3>
                <p>${note.text}</p>
                <div class="card-footer">
                    <small>${note.date}</small>
                    <div class="card-actions">
                        <button onclick="editNote(${i})">Edit</button>
                        <button onclick="deleteNote(${i})">Delete</button>
                    </div>
                </div>
            `;

        notesGrid.appendChild(div);
    }
}

showNotes();

// add note
form.onsubmit = function (e) {
    e.preventDefault();

    let title = titleInput.value;
    let text = textInput.value;

    if (title === "" || text === "") return;

    let notes = getNotes();

    notes.push({
        title: title,
        text: text,
        color: selectedColor,
        date: new Date().toDateString()
    });

    saveNotes(notes);
    showNotes();
    form.reset();
}

// delete note
function deleteNote(index) {
    let notes = getNotes();
    notes.splice(index, 1);
    saveNotes(notes);
    showNotes();
}

// edit note
function editNote(index) {
    let notes = getNotes();
    let note = notes[index];

    // put data back in form
    titleInput.value = note.title;
    textInput.value = note.text;
    selectedColor = note.color;

    // remove old note
    notes.splice(index, 1);
    saveNotes(notes);
    showNotes();
}

// search notes
searchBar.oninput = function () {
    let value = searchBar.value.toLowerCase();
    let cards = document.querySelectorAll(".note-card");

    for (let i = 0; i < cards.length; i++) {
        let title = cards[i].querySelector("h3").innerText.toLowerCase();
        let text = cards[i].querySelector("p").innerText.toLowerCase();

        if (title.includes(value) || text.includes(value)) {
            cards[i].style.display = "block";
        } else {
            cards[i].style.display = "none";
        }
    }
}