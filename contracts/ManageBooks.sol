pragma solidity ^0.5.1;

contract ManageBooks {

//TODO keep track of who's loaning books

	/* Struct has all the information for a book */
	/* Title, Author, Category(Genre), Status (0 is On Loan, 1 is In Library) */
	struct Book {
		string title;
		string author;
		string category;
		uint256 status;
	}

	//Map the Book struct to an array of books accessible by ID number
	mapping(uint256 => Book) public books;

	//Events to log
	event Loaned();
	event InLibrary();
	event BookAdded();

	//Kepp track of how many books we have in the library
	uint public bookNumber;

	//Initialize the contract with one book
	constructor() public {
		addBook("First Book Test", "Test Author", "Fiction", 0);
	}

	/**
		Allows the user to add a book
		_title is the book title
		_author is the book author
		_category is the book genre
		_status is the book status, 0 for on loan and 1 for in library
	*/
	function addBook(string memory _title, string memory _author, string memory _category, uint256 _status) public {
		//Increment the number of books in the library
		bookNumber++;

		//Add book by ID
		books[bookNumber] = Book(_title, _author, _category, _status);
		emit BookAdded();
	}

	/**
		Allows the user to loan a book from the library
		bookId is the ID number of the book to be loaned
	*/
	function loanBook(uint256 bookId) public {
		//Require that there be at least one book in the library
		//AND that the book ID selected exists
		require(bookId > 0 && bookId <= bookNumber);

		//Require that the book not already be on loan
		require(books[bookId].status != 0);

		//Loan book by ID and change the status to "On Loan," or, 0
		books[bookId].status = 0;
		emit Loaned();
	}

	/**
		Allows the user to return a book to the library
		bookId is the ID number of the book to be returned
	*/
	function returnBook(uint256 bookId) public {
		//Should check that book ID exists
		require(bookId > 0 && bookId <= bookNumber);

		//Should check if book is on loan before returning
		require(books[bookId].status != 1);

		//Loan book by ID and change the status to "In Library," or, 1
		books[bookId].status = 1;
		emit InLibrary();
	}
}