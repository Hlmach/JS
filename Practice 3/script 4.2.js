class Book {
    #title; 
    #author;
    #year;

    constructor(title, author, year) {
        this.#title = title;
        this.#author = author;
        this.#year = year;
    }

    getTitle() {
        return this.#title;
    }

    getAuthor() {
        return this.#author;
    }

    getYear() {
        return this.#year;
    }

    display() {
        const info = `Книга: ${this.#title}, Автор: ${this.#author}, Рік: ${this.#year}`;
        console.log(info);
        alert(info);
    }
}

class EBook extends Book {
    constructor(title, author, year, format) {
        super(title, author, year); 
        this.format = format;
    }

    display() {
        const info = `Електронна книга: ${this.getTitle()}, Автор: ${this.getAuthor()}, Рік: ${this.getYear()}, Формат: ${this.format}`;
        console.log(info);
        alert(info);
    }
}

function getUserInput(promptMessage) {
    let input;
    do {
        input = prompt(promptMessage)?.trim();
    } while (!input);
    return input;
}

function getValidYear() {
    let year;
    do {
        year = prompt("Введіть рік видання:")?.trim();
    } while (!year || isNaN(year) || year <= 0);
    return Number(year);
}

const bookType = getUserInput("Введіть тип книги (book або ebook):").toLowerCase();
const title = getUserInput("Введіть назву книги:");
const author = getUserInput("Введіть автора:");
const year = getValidYear();

if (bookType === "ebook") {
    const format = getUserInput("Введіть формат електронної книги (PDF, EPUB тощо):");
    const ebook = new EBook(title, author, year, format);
    ebook.display();
} else {
    const book = new Book(title, author, year);
    book.display();
}
