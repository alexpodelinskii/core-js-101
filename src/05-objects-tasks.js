/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */

/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  return {
    width,
    height,
    getArea() {
      return this.width * this.height;
    },
  };
}

/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}

/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  const obj = JSON.parse(json);
  Object.setPrototypeOf(obj, proto);
  return obj;
}

/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */
class Myclass {
  constructor() {
    this.selector = [];
    this.prevSelector = '';
    this.order = 0;
  }

  element(value) {
    if (this.prevSelector === 'element') {
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }
    if (this.order > 1) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    this.prevSelector = 'element';
    this.selector.push(value);

    this.order = 1;
    return this;
  }

  id(value) {
    if (this.prevSelector === 'id') {
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }
    if (this.order > 2) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    this.prevSelector = 'id';
    this.selector.push(`#${value}`);
    this.order = 2;
    return this;
  }

  class(value) {
    if (this.order > 3) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    this.selector.push(`.${value}`);
    this.order = 3;
    return this;
  }

  attr(value) {
    if (this.order > 4) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    this.selector.push(`[${value}]`);
    this.order = 4;
    return this;
  }

  pseudoClass(value) {
    if (this.order > 5) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    this.selector.push(`:${value}`);
    this.order = 5;
    return this;
  }

  pseudoElement(value) {
    if (this.prevSelector === 'pseudoElement') {
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }
    this.order = 6;
    this.prevSelector = 'pseudoElement';
    this.selector.push(`::${value}`);
    return this;
  }

  combine(selector1, combinator, selector2) {
    this.selector = selector1.selector.concat([` ${combinator} `]).concat(selector2.selector);
    return this;
  }

  stringify() {
    const answer = this.selector.join('');
    this.selector = [];
    return answer;
  }
}
const cssSelectorBuilder = {

  element(value) {
    const obj = new Myclass();
    obj.element(value);
    return obj;
  },

  id(value) {
    const obj = new Myclass();
    obj.id(value);
    return obj;
  },

  class(value) {
    const obj = new Myclass();
    obj.class(value);
    return obj;
  },

  attr(value) {
    const obj = new Myclass();
    obj.attr(value);
    return obj;
  },

  pseudoClass(value) {
    const obj = new Myclass();
    obj.pseudoClass(value);
    return obj;
  },

  pseudoElement(value) {
    const obj = new Myclass();
    obj.pseudoElement(value);
    return obj;
  },

  combine(selector1, combinator, selector2) {
    const obj = new Myclass();
    obj.combine(selector1, combinator, selector2);
    return obj;
  },
};

module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
