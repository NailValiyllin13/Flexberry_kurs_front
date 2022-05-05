import Mixin from '@ember/object/mixin';
import $ from 'jquery';
import DS from 'ember-data';
import { validator } from 'ember-cp-validations';
import { attr, belongsTo, hasMany } from 'ember-flexberry-data/utils/attributes';
import OrderStatusEnum from '../../../enums/i-i-s-shop-order-status';
import { computed } from '@ember/object';

export let Model = Mixin.create({
  amount: DS.attr('number'),
  priceWTaxes: DS.attr('decimal'),
  totalSum: DS.attr('decimal'),
  product: DS.belongsTo('i-i-s-shop-product', { inverse: null, async: false }),
  order: DS.belongsTo('i-i-s-shop-order', { inverse: 'orderItem', async: false })
});

export let ValidationRules = {
  amount: {
    descriptionKey: 'models.i-i-s-shop-order-item.validations.amount.__caption__',
    validators: [
      validator('ds-error'),
      validator('number', { allowString: true, allowBlank: true, integer: true }),
      validator('check-product-amount', {
        showSuggestions: false,
        presence: true,
        disabled: computed('model.order.status', function() {
          const status = this.get('model.order.status');
          const dirtyAttributes = this.get('model.hasDirtyAttributes');
          let bool_blocked = (status === OrderStatusEnum.Paid) && !dirtyAttributes;
          var i = (this.get('model.order.status') == OrderStatusEnum.Paid) || bool_blocked; 
          return (this.get('model.order.status') == OrderStatusEnum.Paid) || bool_blocked; //|| this.get('model.isPaid');
        })              
       }),
      validator('number-zero'),
    ],
  },
  priceWTaxes: {
    descriptionKey: 'models.i-i-s-shop-order-item.validations.priceWTaxes.__caption__',
    validators: [
      validator('ds-error'),
      validator('number', { allowString: true, allowBlank: true }),
    ],
  },
  totalSum: {
    descriptionKey: 'models.i-i-s-shop-order-item.validations.totalSum.__caption__',
    validators: [
      validator('ds-error'),
      validator('number', { allowString: true, allowBlank: true }),
    ],
  },
  product: {
    descriptionKey: 'models.i-i-s-shop-order-item.validations.product.__caption__',
    validators: [
      validator('ds-error'),
      validator('presence', true),
    ],
  },
  order: {
    descriptionKey: 'models.i-i-s-shop-order-item.validations.order.__caption__',
    validators: [
      validator('ds-error'),
      validator('presence', true),
    ],
  },
};

export let defineProjections = function (modelClass) {
  modelClass.defineProjection('OrderItemE', 'i-i-s-shop-order-item', {
    product: belongsTo('i-i-s-shop-product', 'Товар', {
      name: attr('~', { index: 1, hidden: true })
    }, { index: 0, displayMemberPath: 'name' }),
    amount: attr('Количество', { index: 2 }),
    priceWTaxes: attr('Цена с налогами', { index: 3 }),
    totalSum: attr('Сумма по позиции', { index: 4 })
  });

  modelClass.defineProjection('OrderItemInOrderL', 'i-i-s-shop-order-item', {
    priceWTaxes: attr('~', { index: 0, hidden: true }),
    amount: attr('~', { index: 1, hidden: true })
  });
};
