const Validator = require('../Validator');
const expect = require('chai').expect;

describe('testing-configuration-logging/unit-tests', () => {
  describe('Validator', () => {

    it('валидатор проверяет строковые поля', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 10,
          max: 20,
        },
      });

      const errorsShort = validator.validate({ name: 'Lalala' });

      expect(errorsShort).to.have.length(1);
      expect(errorsShort[0]).to.have.property('field').and.to.be.equal('name');
      expect(errorsShort[0]).to.have.property('error').and.to.be.equal('too short, expect 10, got 6');


      const errorsType = validator.validate({ name: errorsShort });

      expect(errorsType).to.have.length(1);
      expect(errorsType[0]).to.have.property('field').and.to.be.equal('name');
      expect(errorsType[0]).to.have.property('error').and.to.be.equal('expect string, got object');

      const errorsLong = validator.validate({ name: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." });

      expect(errorsLong).to.have.length(1);
      expect(errorsLong[0]).to.have.property('field').and.to.be.equal('name');
      expect(errorsLong[0]).to.have.property('error').and.to.be.equal('too long, expect 20, got 56');

    });

    it('валидатор проверяет числовые поля', () => {
      const validator = new Validator({
        year: {
          type: 'number',
          min: 1980,
          max: 2020,
        },
      });

      const errorsType = validator.validate({ year: '1990' });

      expect(errorsType).to.have.length(1);
      expect(errorsType[0]).to.have.property('field').and.to.be.equal('year');
      expect(errorsType[0]).to.have.property('error').and.to.be.equal('expect number, got string');

      const errorsLittle = validator.validate({ year: 1970 });

      expect(errorsLittle).to.have.length(1);
      expect(errorsLittle[0]).to.have.property('field').and.to.be.equal('year');
      expect(errorsLittle[0]).to.have.property('error').and.to.be.equal('too little, expect 1980, got 1970');


      const errorsBig = validator.validate({ year: 2022 });

      expect(errorsBig).to.have.length(1);
      expect(errorsBig[0]).to.have.property('field').and.to.be.equal('year');
      expect(errorsBig[0]).to.have.property('error').and.to.be.equal('too big, expect 2020, got 2022');

    });

    it('валидатор проверяет оба поля', () => {
      const validator = new Validator({
        year: {
          type: 'number',
          min: 1980,
          max: 2020,
        },
        name: {
          type: 'string',
          min: 10,
          max: 20,
        }
      });

      const errorsBoth = validator.validate({ year: 2022, name: "Lorem ipsum dolor sit amet, consectetur adipiscing elit."  });

      expect(errorsBoth).to.have.length(2);
      expect(errorsBoth[0]).to.have.property('field').and.to.be.equal('year');
      expect(errorsBoth[0]).to.have.property('error').and.to.be.equal('too big, expect 2020, got 2022');

      expect(errorsBoth[1]).to.have.property('field').and.to.be.equal('name');
      expect(errorsBoth[1]).to.have.property('error').and.to.be.equal('too long, expect 20, got 56');


    });
  });
});