describe("Iterator", function() {
  var itr;

  beforeEach(function() {
    itr = MPL.Iterator();
  });

  describe('with default handler', function(){
    it('should take an array of props and assign them from ext to base', function(){
      var base = {},
          ext = { a: 1, b: "two", c: 384 };

      expect(itr({ props: ['a', 'b'], ext: ext, base: base })).toEqual({a: 1, b: "two"});
    });
  });

});
