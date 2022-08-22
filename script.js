STORAGE_KEY = 'BOOKSHELF_APPS';
RENDER_EVENT = 'render-books';

const books = [];

const isStorageExist = () => {
	if (typeof Storage === 'undefined') {
		alert('Browser not support');
		return false;
	}

	return true;
};

const makeTodoObject = (id, title, author, year, isComplete) => {
	return {
		id,
		title,
		author,
		year,
		isComplete,
	};
};

const generatedID = () => {
	return `${+new Date()}`;
};

const addTodo = () => {
	const title = document.getElementById('title');
	const author = document.getElementById('author');
	const year = document.getElementById('year');
	const isComplete = document.getElementById('isComplete');

	const id = generatedID();

	const todo = makeTodoObject(
		id,
		title.value,
		author.value,
		year.value,
		isComplete.checked
	);

	books.push(todo);
	saveBook();

	title.value = '';
	author.value = '';
	year.value = '';
	isComplete.checked = false;
	document.dispatchEvent(new Event(RENDER_EVENT));
};

const saveBook = () => {
	if (isStorageExist()) {
		const parsedData = JSON.stringify(books);
		localStorage.setItem(STORAGE_KEY, parsedData);
	}
};

document.addEventListener('DOMContentLoaded', () => {
	const submitForm = document.getElementById('form_insert');
	submitForm.addEventListener('submit', (e) => {
		e.preventDefault();
		addTodo();
	});

	if (isStorageExist()) {
		loadLocalData();
	}
});

const loadLocalData = () => {
	const serializedData = localStorage.getItem(STORAGE_KEY);
	let data = JSON.parse(serializedData);

	if (data !== null) {
		for (const book of data) {
			books.push(book);
		}
	}

	document.dispatchEvent(new Event(RENDER_EVENT));
};

const findBook = (bookId) => {
	for (const book of books) {
		if (book.id === bookId) {
			return book;
		}
	}
	return null;
};

const findBookIndex = (bookId) => {
	for (const i in books) {
		if (books[i].id === bookId) {
			return i;
		}
	}

	return -1;
};

const addBookToRead = (bookId) => {
	const bookTarget = findBook(bookId);
	if (bookTarget == null) return;

	bookTarget.isComplete = true;
	document.dispatchEvent(new Event(RENDER_EVENT));
	saveBook();
};

const removeBook = (bookId) => {
	const bookTarget = findBookIndex(bookId);
	if (bookTarget === -1) return;

	books.splice(bookTarget, 1);
	document.dispatchEvent(new Event(RENDER_EVENT));
	saveBook();
};

const undoBook = (bookId) => {
	const bookTarget = findBook(bookId);
	if (bookTarget == null) return;

	bookTarget.isComplete = false;
	document.dispatchEvent(new Event(RENDER_EVENT));
	saveBook();
};

document.addEventListener(RENDER_EVENT, () => {
	const completeReadWrapper = document.getElementById('completed_list');
	completeReadWrapper.innerHTML = '';
	const unCompleteReadWrapper = document.getElementById('uncompleted_list');
	unCompleteReadWrapper.innerHTML = '';

	for (const book of books) {
		const bookEl = makeBookList(book);
		if (book.isComplete) {
			completeReadWrapper.append(bookEl);
		} else {
			unCompleteReadWrapper.append(bookEl);
		}
	}
});

const makeBookList = (bookObject) => {
	const textTitle = document.createElement('h5');
	textTitle.classList.add('text-h5');
	textTitle.innerText = `Judul : ${bookObject.title}`;

	const textAuthor = document.createElement('p');
	textAuthor.classList.add('author');
	textAuthor.innerText = `Pengarang : ${bookObject.author}`;

	const textYear = document.createElement('p');
	textYear.classList.add('year');
	textYear.innerText = `Tahun : ${bookObject.year}`;

	const textInfoWrapper = document.createElement('div');
	textInfoWrapper.append(textTitle, textAuthor, textYear);

	const containerInner = document.createElement('div');
	containerInner.classList.add('container-inner');
	containerInner.append(textInfoWrapper);

	const container = document.createElement('div');
	container.classList.add('container-prim');
	container.setAttribute('id', `book-${bookObject.id}`);
	container.append(containerInner);

	const deleteButton = document.createElement('button');
	deleteButton.classList.add('deleteButton');

	const deleteIcon = document.createElement('p');
	deleteIcon.classList.add('text-md');
	deleteIcon.innerText = 'Delete';
	deleteButton.append(deleteIcon);

	const undoButton = document.createElement('button');
	undoButton.classList.add('undoButton');
	const undoIcon = document.createElement('p');
	undoIcon.classList.add('text-md');
	undoIcon.innerText = 'Undo';
	undoButton.append(undoIcon);

	const addBookToReadButton = document.createElement('button');
	addBookToReadButton.classList.add('undoButton');
	addBookToReadButton.classList.add('mb-5');
	const textInnerAddBookToRead = document.createElement('p');
	textInnerAddBookToRead.classList.add('text-md');
	textInnerAddBookToRead.innerText = 'Tambah Ke Sudah Dibaca ?';
	addBookToReadButton.append(textInnerAddBookToRead);

	if (bookObject.isComplete) {
		deleteButton.addEventListener('click', () => {
			if (
				confirm(`Yakin ingin menghapus buku berjudul ${bookObject.title} ?`)
			) {
				setTimeout(() => {
					removeBook(bookObject.id);
				}, [500]);
			}
		});

		undoButton.addEventListener('click', () => {
			if (
				confirm(
					`Yakin ingin memindahkan buku berjudul ${bookObject.title} ke Belum Dibaca ?`
				)
			) {
				setTimeout(() => {
					undoBook(bookObject.id);
				}, [500]);
			}
		});

		containerInner.append(undoButton, deleteButton);
	} else {
		addBookToReadButton.addEventListener('click', () => {
			if (
				confirm(
					`Yakin ingin memindahkan buku berjudul ${bookObject.title} ke Sudah Dibaca ?`
				)
			) {
				setTimeout(() => {
					addBookToRead(bookObject.id);
				}, [500]);
			}
		});

		deleteButton.addEventListener('click', () => {
			if (
				confirm(`Yakin ingin menghapus buku berjudul ${bookObject.title} ?`)
			) {
				setTimeout(() => {
					removeBook(bookObject.id);
				}, [500]);
			}
		});
		containerInner.append(addBookToReadButton, deleteButton);
	}

	return container;
};
