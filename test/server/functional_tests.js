var expect = require('chai').expect;

var helper = require(__dirname + '/../../app/js/helper');

describe('the helper functions ... specifically', function() {

  describe('the "removeSpaces" function', function() {

    it('should remove spaces in a string', function() {
      expect(helper.removeSpaces('a b')).to.eql('ab');
    });

    it('should convert to lowercase', function() {
      expect(helper.removeSpaces('AB')).to.eql('ab');
    });
  });

  describe('the "changeName" function', function() {
    it('should replace a hash symbol with words', function() {
      expect(helper.changeName('a#')).to.eql('ashrp');
    });

    it('should convert to lowercase', function() {
      expect(helper.changeName('A#')).to.eql('ashrp');
    });
  });

  describe('the "isArrayContained" function', function() {
    it('should check for containing arrays', function() {
      expect(helper.isArrayContained(['A', 'B', 'C'], ['B', 'C', 'D'])).to.eql(false);
      expect(helper.isArrayContained(['A'], ['A', 'B'])).to.eql(true);
    });
  });


});

