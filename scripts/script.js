

function Book(title, author, numPages, beenRead) {
	this.title = title;
	this.author = author;
	this.numPages = numPages;
	this.beenRead = beenRead;
}

//Setters?

Book.prototype.info = function() {
	let read = this.beenRead ? "has been read" : "has not been read";
	return this.title + " by " + this.author + ", " + this.numPages + " pages, " + read;
}

//BUTTONS
const addButton = document.getElementById("display-add-form");
addButton.addEventListener("click", displayForm);
const cancelAdd = document.getElementById("cancel-add");
cancelAdd.addEventListener("click", hideForm);
const confirmAddButton = document.getElementById("confirm-add");
confirmAddButton.addEventListener("click", addBook);

//LIBRARY STUFF
const libraryDisplay = document.querySelector(".library-display");
let library = [];
if (localStorage.getItem("library")) {
	initLibrary();
}

function initLibrary() {
	let libraryStorage = JSON.parse(localStorage.getItem("library"));
	for (let i = 0; i < libraryStorage.length; i++) {
		addBookToLibrary(libraryStorage[i].title, libraryStorage[i].author, libraryStorage[i].numPages, libraryStorage[i].beenRead);
	}
}



function addBookToLibrary(title, author, numPages, beenRead) {
	let b = new Book(title, author, numPages, beenRead);
	library.push(b);
	saveLibraryToLocalStorage();
}
// addBookToLibrary("Slaughterhouse Five", "Kurt Vonnegut", 213, true);
// addBookToLibrary("Ubik", "Philip K. Dick", 198, true);
// addBookToLibrary("Harry Potter", "JK Rowling", 444, false);

function changeReadStatus() {
	let index = this.getAttribute("data-index");
	let textP = document.querySelectorAll(".book-display")[index];
	library[index].beenRead = !library[index].beenRead;
	textP.childNodes[0].nodeValue = library[index].info();
	saveLibraryToLocalStorage();
}

function deleteBook(e) {
	let index = this.getAttribute('data-index');
	if (!confirm(`Delete ${library[index].title}?`)) {
		return;
	}
	
	let firstHalf = library.slice(0, index);
	index++;
	let secondHalf = library.slice(index);
	library=firstHalf;
	library = library.concat(secondHalf);
	clearLibraryDisplay();
	displayBooks(library);
	saveLibraryToLocalStorage();
}

function displayBooks(books) {
	// let libraryDisplay = document.querySelector(".library-display");
	for (let i = 0; i < books.length; i++) {
		let newElement = document.createElement('p');
		newElement.classList.add("book-display");
		newElement.innerText = books[i].info();
		newElement.setAttribute("data-index", i);
		newElement.appendChild(createDeleteButton(i));
		newElement.appendChild(createReadButton(i));
		libraryDisplay.appendChild(newElement);
	}
}

function clearLibraryDisplay() {
	while (libraryDisplay.firstChild) {
    	libraryDisplay.removeChild(libraryDisplay.firstChild);
	}
}

//BUTTON CREATING
function createDeleteButton(dataIndex) {
	let button = document.createElement('button');
	button.setAttribute("data-index", dataIndex);
	button.classList.add("delete");
	button.innerText = "Delete";
	button.addEventListener("click", deleteBook);
	return button;
}
function createReadButton(dataIndex) {
	let button = document.createElement('button');
	button.setAttribute("data-index", dataIndex);
	button.innerText = "Read";
	button.classList.add("read");
	button.addEventListener("click", changeReadStatus);
	return button;
}




//FORM STUFF

const form = document.querySelector(".add-form");
const titleTextArea = document.getElementById("book-title");
const authorTextArea = document.getElementById("book-author");
const pagesArea = document.getElementById("book-pages");
const readRadio = document.getElementById("book-read");
const notReadRadio = document.getElementById("book-not-read");

function displayForm() {
	form.style.display = "block";
}
function hideForm() {
	clearForm();
	form.style.display = "none";
}
function clearForm() {
	titleTextArea.value = "";
	authorTextArea.value = "";
	pagesArea.value = "";
	readRadio.checked = false;
	notReadRadio.checked = false;
}


function addBook() {
	let title = titleTextArea.value;
	if (title === "") {
		alert("Enter a title!");
		return;
	}

	let author = authorTextArea.value;
	if (author === "") {
		alert("Enter an author!");
		return;
	}

	let pages = Number(pagesArea.value);
	if (pages < 1) {
		alert("Enter a valid number of pages!");
		return;
	}

	let read;
	if (readRadio.checked) {
		read = true;
	}
	else if (notReadRadio.checked) {
		read = false;
	}
	else {
		alert("Check Read or Not Read!");
		return;
	}
	addBookToLibrary(title, author, pages, read);
	clearLibraryDisplay();
	displayBooks(library);
	hideForm();
}



function saveLibraryToLocalStorage() {
	let libraryString = JSON.stringify(library);
	localStorage.setItem("library", libraryString);
}

displayBooks(library);