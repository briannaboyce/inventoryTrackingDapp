App = {
	web3Provider: null,
	contracts: {},
	account: '0x0',

	/**
		Initialize the app 
	*/
	init: function() {
	 return App.initWeb3();
	},

	/**
		Set the web3 provider
		Then initialize the contract
	*/
	initWeb3: function() {

		if(typeof web3 !== 'undefined') {
			//Let the provider be the current one, if metamask is already running
			App.web3Provider = web3.currentProvider;
			web3 = new Web3(web3.currentProvider);
		} else {
			//If metamask isn't, use the blockchain provided
			App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
			web3 = new Web3(App.web3Provider);
		}	

		return App.initContract();
	},

	/**
		Start up the contract then start the front-end app
	*/
	initContract: function() {

		//Start the contract up with the given provider
		$.getJSON("ManageBooks.json", ((library) => {
			App.contracts.ManageBooks = TruffleContract(library);
			App.contracts.ManageBooks.setProvider(App.web3Provider);

			return App.render();
		}));

	},

	/**
		Render controls the front-end interactions
		It provides an interface for users to view books,
		loan books, return books and add books
	*/
	render: function() {
		let libraryInstance;
		let loader = $('#loader');
		let content = $('#content');

		//Show the loader and hide the rest of the content on the page until metamask connects
		loader.show();
		content.hide();

		//Set the account to pay the transactions fees
		//Show the account on the screen so users can verify it's correct
		web3.eth.getCoinbase(((err, account) => {
			if(err === null) {
				App.account = account;
				$('#accountAddress').html(`Your account ${account}`)
			}
		}));

		//Start up an instance of the smart contract
		App.contracts.ManageBooks.deployed().then((instance) => {
			libraryInstance = instance;
			return libraryInstance.bookNumber();
		}).then((bookNumber) => {

			//List out all the books in the library
			let libraryList = $("#books");
			libraryList.empty();

			//Create dropdown for loaning books
			let bookSelect = $('#bookSelection')
			bookSelect.empty();

			//Create dropdown for returning books
			let returnBook = $('#bookSelectionToReturn')
			returnBook.empty()

			//Iterate through the entire book list
			for(let i = 1; i <= bookNumber; i++) {
				libraryInstance.books(i).then((book) => {
					let title = book[0];
					let author = book[1];
					let category = book[2];
					let status = book[3];

					//Parse out the status
					if(status == 0) {
						status = 'On Loan'
					} else {
						status = 'In Library'
					}

					//Populate the list of books with data
					let books = `<tr><th> ${title} </th><td> ${author} </td><td> ${category} </td><td> ${status} </td></tr>`;

					let bookOption
					let bookOptionReturn

					//Only add books to the correct dropdown
					//i.e. if a book is 'On Loan,' don't show it as an option in the 'Loan Book' feature
					//If a book is 'In Library,' don't show it as an option in the 'Return Book' feature
					if(status == 'In Library')
						bookOption = `<option value='${i}'>${title} by ${author}</option>`
					if(status == 'On Loan')
						bookOptionReturn = `<option value='${i}'>${title} by ${author}</option>`

					//Add books to the library list
					libraryList.append(books);
					//Add books to the loaning list
					bookSelect.append(bookOption);
					//Add books to the returning list
					returnBook.append(bookOptionReturn);
				});
			}

			//Hide the loader and show the content
			loader.hide();
			content.show();

		}).catch((err) => {
			console.warn(err);
		});
	},

	/**
		Provides the feature of loaning a book to the users
	*/
	loanBook: function() {
		//Book ID is equal to the ID of the item in the list the user selected
		let bookId = $('#bookSelection').val();
		App.contracts.ManageBooks.deployed().then((instance) => {
			//Call the smart contract loan book function
			return instance.loanBook(bookId, {from: App.account});
		}).then((res) => {
			//Reload the web page automatically
			$('#content').hide();
			$('#loader').show();
			App.render()
		}).catch((err) => {
			console.error(err);
		});
	},

	/**
		Provides the feature of returning a book to the users
	*/
	returnBook: function() {
		//Book ID is equal to the ID of the item in the list the user selected
		let bookId = $('#bookSelectionToReturn').val();
		App.contracts.ManageBooks.deployed().then((instance) => {
			//Call the smart contract return book function
			return instance.returnBook(bookId, {from: App.account});
		}).then((res) => {
			//Reload the web page automatically
			$('#content').hide();
			$('#loader').show();
			App.render()
		}).catch((err) => {
			console.error(err);
		});
	},

	/**
		Provides the feature of adding a book to the users
	*/
	addBook: function() {
		//Title, author and category are the values the user inputs into the HTML form
		let title = $('#title').val()
		let author = $('#author').val()
		let category = $('#category').val()

		App.contracts.ManageBooks.deployed().then((instance) => {
			//Call the smart contract add book function, assume that the book will start in the library
			return instance.addBook(title, author, category, 1, {from: App.account})
		}).then((res) => {
			//Reload the web page automatically
			$('#content').hide();
			$('#loader').show();
			App.render()
		}).catch((err) => {
			console.error(err)
		})
	}

};

$(function() {
	$(window).load(function() {
		App.init();
	});
});
