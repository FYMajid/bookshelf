let books = [];

function addBook(event) {
  event.preventDefault();

  const titleInput = document.querySelector("#bookFormTitle");
  const authorInput = document.querySelector("#bookFormAuthor");
  const yearInput = document.querySelector("#bookFormYear");
  const isCompleteInput = document.querySelector("#bookFormIsComplete");

  if (!titleInput || !authorInput || !yearInput || !isCompleteInput) {
    console.error("Input elements not found");
    return;
  }

  const newBook = {
    id: +new Date(),
    title: titleInput.value.trim(),
    author: authorInput.value.trim(),
    year: yearInput.value.trim(),
    isComplete: isCompleteInput.checked,
  };

  if (!newBook.title || !newBook.author || !newBook.year) {
    alert("Pastikan semua data sudah terisi!");
    return;
  }

  books.push(newBook);
  document.dispatchEvent(new Event("bookChanged"));

  titleInput.value = "";
  authorInput.value = "";
  yearInput.value = "";
  isCompleteInput.checked = false;
}

function searchBook(event) {
  event.preventDefault();

  const searchInput = document.querySelector("#searchBookTitle");

  if (!searchInput) {
    console.error("Search input element not found");
    return;
  }

  const query = searchInput.value.trim().toLowerCase();
  const filteredBooks = query
    ? books.filter((book) => book.title.toLowerCase().includes(query))
    : books;

  renderBooks(filteredBooks);
}

function markAsComplete(event) {
  const bookId = Number(event.target.dataset.bookid);
  const bookIndex = books.findIndex((book) => book.id === bookId);

  if (bookIndex !== -1) {
    books[bookIndex].isComplete = true;
    document.dispatchEvent(new Event("bookChanged"));
  }
}

function markAsIncomplete(event) {
  const bookId = Number(event.target.dataset.bookid);
  const bookIndex = books.findIndex((book) => book.id === bookId);

  if (bookIndex !== -1) {
    books[bookIndex].isComplete = false;
    document.dispatchEvent(new Event("bookChanged"));
  }
}

function deleteBook(event) {
  const bookId = Number(event.target.dataset.bookid);
  const bookIndex = books.findIndex((book) => book.id === bookId);

  if (bookIndex !== -1) {
    books.splice(bookIndex, 1);
    document.dispatchEvent(new Event("bookChanged"));
  }
}

function renderBooks(bookList) {
  const incompleteBookList = document.querySelector("#incompleteBookList");
  const completeBookList = document.querySelector("#completeBookList");

  if (!incompleteBookList || !completeBookList) {
    console.error("Bookshelf elements not found");
    return;
  }

  incompleteBookList.innerHTML = "";
  completeBookList.innerHTML = "";

  bookList.forEach((book) => {
    const bookItem = document.createElement("div");
    bookItem.dataset.bookid = book.id;
    bookItem.classList.add("book-item");
    bookItem.setAttribute("data-testid", "bookItem");

    const bookTitle = document.createElement("h3");
    bookTitle.innerText = book.title;
    bookTitle.setAttribute("data-testid", "bookItemTitle");

    const bookAuthor = document.createElement("p");
    bookAuthor.innerText = `Penulis: ${book.author}`;
    bookAuthor.setAttribute("data-testid", "bookItemAuthor");

    const bookYear = document.createElement("p");
    bookYear.innerText = `Tahun: ${book.year}`;
    bookYear.setAttribute("data-testid", "bookItemYear");

    const actionContainer = document.createElement("div");

    if (book.isComplete) {
      const markIncompleteButton = document.createElement("button");
      markIncompleteButton.dataset.bookid = book.id;
      markIncompleteButton.innerText = "Belum Selesai Dibaca";
      markIncompleteButton.classList.add("toggle");
      markIncompleteButton.setAttribute(
        "data-testid",
        "bookItemIsCompleteButton"
      );
      markIncompleteButton.addEventListener("click", markAsIncomplete);

      const deleteButton = document.createElement("button");
      deleteButton.dataset.bookid = book.id;
      deleteButton.innerText = "Hapus Buku";
      deleteButton.classList.add("delete");
      deleteButton.setAttribute("data-testid", "bookItemDeleteButton");
      deleteButton.addEventListener("click", deleteBook);

      actionContainer.appendChild(markIncompleteButton);
      actionContainer.appendChild(deleteButton);
      bookItem.appendChild(bookTitle);
      bookItem.appendChild(bookAuthor);
      bookItem.appendChild(bookYear);
      bookItem.appendChild(actionContainer);
      completeBookList.appendChild(bookItem);
    } else {
      const markCompleteButton = document.createElement("button");
      markCompleteButton.dataset.bookid = book.id;
      markCompleteButton.innerText = "Selesai Dibaca";
      markCompleteButton.classList.add("toggle");
      markCompleteButton.setAttribute(
        "data-testid",
        "bookItemIsCompleteButton"
      );
      markCompleteButton.addEventListener("click", markAsComplete);

      const deleteButton = document.createElement("button");
      deleteButton.dataset.bookid = book.id;
      deleteButton.innerText = "Hapus Buku";
      deleteButton.classList.add("delete");
      deleteButton.setAttribute("data-testid", "bookItemDeleteButton");
      deleteButton.addEventListener("click", deleteBook);

      actionContainer.appendChild(markCompleteButton);
      actionContainer.appendChild(deleteButton);
      bookItem.appendChild(bookTitle);
      bookItem.appendChild(bookAuthor);
      bookItem.appendChild(bookYear);
      bookItem.appendChild(actionContainer);
      incompleteBookList.appendChild(bookItem);
    }
  });
}

function saveBooksToLocalStorage() {
  localStorage.setItem("books", JSON.stringify(books));
  renderBooks(books);
}

window.addEventListener("load", () => {
  books = JSON.parse(localStorage.getItem("books")) || [];
  renderBooks(books);

  const bookForm = document.querySelector("#bookForm");
  const searchForm = document.querySelector("#searchBook");

  if (bookForm) bookForm.addEventListener("submit", addBook);
  if (searchForm) searchForm.addEventListener("submit", searchBook);

  document.addEventListener("bookChanged", saveBooksToLocalStorage);
});
