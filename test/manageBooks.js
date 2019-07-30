let ManageBooks = artifacts.require("./ManageBooks.sol")

contract("ManageBooks", function(accounts) {
	let libraryInstance

	//Test that the contract initializes with exactly 1 book
	it("initializes with one book", () => {
		return ManageBooks.deployed().then((instance) => {
			return instance.bookNumber()
		}).then((count) => {
			assert.equal(count, 1)
		})
	})

	//Test that the book is set correctly
	it('initializes the book correctly', () => {
		return ManageBooks.deployed().then((instance) => {
			libraryInstance = instance
			return libraryInstance.books(1)
		}).then((book) => {
			assert.equal(book[0], 'First Book Test', 'has the correct title')
			assert.equal(book[1], 'Test Author', 'has the correct author')
			assert.equal(book[2], 'Fiction', 'has the correct category')
			assert.equal(book[3], 0, 'On Loan, has the correct status')
		})
	})

	//Test that users can add a book
	it('allows a user to add a book', () => {
		return ManageBooks.deployed().then((instance) => {
			libraryInstance = instance
			title = 'Test'
			author = 'Author'
			category = 'Non-fiction'
			status = 1
			return libraryInstance.addBook(title, author, category, status, {from: accounts[0]})
		}).then((receipt) => {
			assert.equal(receipt.logs.length, 1, 'event was triggered')
			assert.equal(receipt.logs[0].event, 'BookAdded', 'event type is correct')
			return libraryInstance.books(accounts[0])
		}).then((added) => {
			assert(added, 'book was added')
			return libraryInstance.books(2)
		}).then((book) => {
			assert.equal(book[0], 'Test', 'has the correct title')
			assert.equal(book[1], 'Author', 'has the correct author')
			assert.equal(book[2], 'Non-fiction', 'has the correct category')
			assert.equal(book[3], 1, 'In Library, has the correct status')
		})
	})

	//Test that a book can be loaned
	it('allows a user to loan a book', () => {
		return ManageBooks.deployed().then((instance) => {
			libraryInstance = instance
			bookId = 2
			return libraryInstance.loanBook(2, {from: accounts[0]})
		}).then((receipt) => {
			assert.equal(receipt.logs.length, 1, 'event was triggered')
			assert.equal(receipt.logs[0].event, 'Loaned', 'event type is correct')
			return libraryInstance.books(2)
		}).then((book) => {
			assert.equal(book[3], 0, 'On loan, has the correct status')
		})
	})

	//Ensure trying to loan a book already on loan throws an error
	it('throws an exception for invalid loans', () => {
		return ManageBooks.deployed().then((instance) => {
			libraryInstance = instance
			return libraryInstance.loanBook(1, {from: accounts[1]})
		}).then(assert.fail).catch((err) => {
			assert(err.message.indexOf('revert') >= 0, 'error message contains revert')
			return libraryInstance.books(1)
		}).then((book) => {
			assert.equal(book[3], 0, 'status did not change')
		})
	})

	//Ensure invalid input to the loan book function with an invalid ID throws an error
	it('throws an exception for loan with invalid book id', () => {
		return ManageBooks.deployed().then((instance) => {
			libraryInstance = instance
			return libraryInstance.loanBook(-1, {from: accounts[1]})
		}).then(assert.fail).catch((err) => {
			assert(err.message.indexOf('revert') >= 0, 'error message contains revert')
			return libraryInstance.books(1)
		}).then((book) => {
			assert.equal(book[3], 0, 'status did not change')
		})
	})

	//Test that a book can be returned
	it('allows a user to return a book', () => {
		return ManageBooks.deployed().then((instnace) => {
			libraryInstance = instnace
			bookId = 1
			return libraryInstance.returnBook(1, {from: accounts[0]})
		}).then((receipt) => {
			assert.equal(receipt.logs.length, 1, 'event was triggered')
			assert.equal(receipt.logs[0].event, 'InLibrary', 'event type is correct')
			return libraryInstance.books(1)
		}).then((book) => {
			assert.equal(book[3], 1, 'In library, has the correct status')
		})
	})

	//Ensure trying to return a book already in the library throws an error
	it('throws an exception for invalid returns', () => {
		return ManageBooks.deployed().then((instance) => {
			libraryInstance = instance
			return libraryInstance.returnBook(1, {from: accounts[1]})
		}).then(assert.fail).catch((err) => {
			assert(err.message.indexOf('revert') >= 0, 'error message contains revert')
			return libraryInstance.books(1)
		}).then((book) => {
			assert.equal(book[3], 1, 'status did not change')
		})
	})

	//Ensure invalid input to the return book function with an invalid ID throws an error
	it('throws an exception for return with invalid book id', () => {
		return ManageBooks.deployed().then((instance) => {
			libraryInstance = instance
			return libraryInstance.returnBook(99, {from: accounts[1]})
		}).then(assert.fail).catch((err) => {
			assert(err.message.indexOf('revert') >= 0, 'error message contains revert')
			return libraryInstance.books(1)
		}).then((book) => {
			assert.equal(book[3], 1, 'status did not change')
		})
	})
})