var app = require('../init').App;

describe('User', function() {
	
	it('blah', function(next) {
		var options = {
			method: "POST",
			url: "/api/v1/user",
			payload: {
    			email: 'mniehe@gmail.com',
			    password: 'password',
			    first_name: 'Mark',
    			last_name: 'Smith',
    			addr: '123 test st',
    			city: 'Jameston',
    			state: 'California',
    			zip: '90210'				
			}
		};
		
		app.inject(options, function(response) {
			next();
		});
	});
})