// Define the variables
let noteTitleElement;
let noteTextElement;
let saveNoteButton;
let newNoteButton;
let noteListContainer;

// Check if the current page is '/notes'
if (window.location.pathname === '/notes') {
  noteTitleElement = document.querySelector('.note-title');
  noteTextElement = document.querySelector('.note-textarea');
  saveNoteButton = document.querySelector('.save-note');
  newNoteButton = document.querySelector('.new-note');
  noteListContainer = document.querySelectorAll('.list-container .list-group');
}

// Function to show an element
const showElement = (elem) => {
  elem.style.display = 'inline';
};

// Function to hide an element
const hideElement = (elem) => {
  elem.style.display = 'none';
};

// activeNote is used to keep track of the note in the textarea
let activeNote = {};

// Function to fetch notes from the server
const getNotes = () =>
  fetch('/api/notes', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

// Function to save a note to the server
const saveNote = (note) =>
  fetch('/api/notes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(note),
  });

// Function to delete a note from the server
const deleteNote = (id) =>
  fetch(`/api/notes/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

// Function to render the active note
const renderActiveNote = () => {
  hideElement(saveNoteButton);

  if (activeNote.id) {
    noteTitleElement.setAttribute('readonly', true);
    noteTextElement.setAttribute('readonly', true);
    noteTitleElement.value = activeNote.title;
    noteTextElement.value = activeNote.text;
  } else {
    noteTitleElement.removeAttribute('readonly');
    noteTextElement.removeAttribute('readonly');
    noteTitleElement.value = '';
    noteTextElement.value = '';
  }
};

// Function to handle saving a note
const handleNoteSave = () => {
  const newNote = {
    title: noteTitleElement.value,
    text: noteTextElement.value,
  };
  saveNote(newNote).then(() => {
    getAndRenderNotes();
    renderActiveNote();
  });
};

// Function to handle deleting a note
const handleNoteDelete = (e) => {
  // Prevents the click listener for the list from being called when the button inside of it is clicked
  e.stopPropagation();

  const note = e.target;
  const noteId = JSON.parse(note.parentElement.getAttribute('data-note')).id;

  if (activeNote.id === noteId) {
    activeNote = {};
  }

  deleteNote(noteId).then(() => {
    getAndRenderNotes();
    renderActiveNote();
  });
};

// Function to handle viewing a note
const handleNoteView = (e) => {
  e.preventDefault();
  activeNote = JSON.parse(e.target.parentElement.getAttribute('data-note'));
  renderActiveNote();
};

// Function to handle viewing a new note
const handleNewNoteView = (e) => {
  activeNote = {};
  renderActiveNote();
};

// Function to handle rendering the save button
const handleRenderSaveBtn = () => {
  if (!noteTitleElement.value.trim() || !noteTextElement.value.trim()) {
    hideElement(saveNoteButton);
  } else {
    showElement(saveNoteButton);
  }
};

// Function to render the list of note titles
const renderNoteList = async (notes) => {
  let jsonNotes = await notes.json();
  if (window.location.pathname === '/notes') {
    noteListContainer.forEach((el) => (el.innerHTML = ''));
  }

  let noteListItems = [];

  // Returns HTML element with or without a delete button
  const createLi = (text, delBtn = true) => {
    const liEl = document.createElement('li');
    liEl.classList.add('list-group-item');

    const spanEl = document.createElement('span');
    spanEl.classList.add('list-item-title');
    spanEl.innerText = text;
    spanEl.addEventListener('click', handleNoteView);

    liEl.append(spanEl);

    if (delBtn) {
      const delBtnEl = document.createElement('i');
      delBtnEl.classList.add(
        'fas',
        'fa-trash-alt',
        'float-right',
        'text-danger',
        'delete-note'
      );
      delBtnEl.addEventListener('click', handleNoteDelete);

      liEl.append(delBtnEl);
    }

    return liEl;
  };

  if (jsonNotes.length === 0) {
    noteListItems.push(createLi('No saved Notes', false));
  }

  jsonNotes.forEach((note) => {
    const li = createLi(note.title);
    li.dataset.note = JSON.stringify(note);

    noteListItems.push(li);
  });

  if (window.location.pathname === '/notes') {
    noteListItems.forEach((note) => noteListContainer[0].append(note));
  }
};

// Function to fetch and render the notes
const getAndRenderNotes = () => getNotes().then(renderNoteList);

if (window.location.pathname === '/notes') {
  saveNoteButton.addEventListener('click', handleNoteSave);
  newNoteButton.addEventListener('click', handleNewNoteView);

  noteTitleElement.addEventListener('keyup', handleRenderSaveBtn);
  noteTextElement.addEventListener('keyup', handleRenderSaveBtn);
}

getAndRenderNotes();
