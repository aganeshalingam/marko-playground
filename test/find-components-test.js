var find = require('../src/find-components');

describe('find-components', () => {
	it('should work', () => {
		find(__dirname + '/find-components-fixture');
	});
});