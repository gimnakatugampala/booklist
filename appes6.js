//Book class
class Book{
    constructor(title,author,isbn){
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }

}

//UI class
class UI{
    addBookToList(book){
        const list = document.getElementById('book-list');

        //create li
        const row = document.createElement('tr');
    
        row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href="#" class="delete">X</a></td>
        `;
    
        list.appendChild(row);
    }

    showAlert(message,className){
         //Create a div
        const div = document.createElement('div');
        //Add classes
        div.className = `alert ${className}`;
        //Add text
        div.appendChild(document.createTextNode(message));

        //Get parent
        const container = document.querySelector('.container');
        //get form
        const form = document.querySelector('#book-form');

        //Insert alert
        container.insertBefore(div,form);

        //remove the error
        setTimeout(function(){
            document.querySelector('.alert').remove();
        },2000);

    }

    clearFields(){
        document.getElementById('title').value = '';
        document.getElementById('author').value = '';
        document.getElementById('isbn').value = '';
    }

    deleteBook(target){
        if(target.className === 'delete'){
            target.parentElement.parentElement.remove()
        }

    }
}

//Store class
class Store{
    static getBooks(){
        let books;
        if(localStorage.getItem('books') === null){
            books = [];
        }else{
            books = JSON.parse(localStorage.getItem('books'));
        }

        return books;
    }

    static displayBooks(){
        const books = Store.getBooks();
        
        books.forEach(function(book){
            const ui = new UI(); //Initiate UI
            ui.addBookToList(book);
        })
    }

    static addBooks(book){
        const books = Store.getBooks();

        books.push(book);
        localStorage.setItem('books',JSON.stringify(books))
    }

    static removeBook(isbn){
        const books = Store.getBooks();
        books.forEach(function(book,index){
            if(book.isbn === isbn){
                books.splice(index,1)
            }
        })
        localStorage.setItem('books',JSON.stringify(books))
    }
}

//DOM Load Event
document.addEventListener('DOMContentLoaded',Store.displayBooks); //important

//Add submit event listeners
document.getElementById('book-form').addEventListener('submit',function(e){
    e.preventDefault();
    //Get input data
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const isbn = document.getElementById('isbn').value;

    //Intiate book object
    const book = new Book(title,author,isbn);

    //Initiate UI
    const ui = new UI();

    //Validate
    if(title === '' || author === '' || isbn === ''){

        //Show an error message
        ui.showAlert('Please fill All Fields','error')
    }else{
        
        //Add book to list
        ui.addBookToList(book);

          //Add to add Books
          Store.addBooks(book)

        //Clear fields
        ui.clearFields();
        //Show added book alert
        ui.showAlert('Book Added!','success')

        }
    })

    //Add Delete book from list
    document.getElementById('book-list').addEventListener('click',function(e){
        e.preventDefault();
        
        //init the UI constructor
        const ui = new UI;

        
        //Remove Book
        ui.deleteBook(e.target);

        Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
        ui.showAlert('Book Removed','warn')
    })