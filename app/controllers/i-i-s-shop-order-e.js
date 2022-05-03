import EditFormController from 'ember-flexberry/controllers/edit-form';
import { set } from '@ember/object';
import { SimplePredicate } from 'ember-flexberry-data/query/predicate';
import { generateNotOrPredicateByList } from '../utils/generate-predicate-by-list';
import OrderStatusEnum from '../enums/i-i-s-shop-order-status';
import { inject } from '@ember/service';
import Builder from 'ember-flexberry-data/query/builder';

export default EditFormController.extend({
  parentRoute: 'i-i-s-shop-order-l',
  store: inject(),

  lookupEventsService: inject('lookup-events'),
  groupEditEventsService: inject('objectlistview-events'),

  init() {
    this._super(...arguments);
    this.storeproduct();
    this.storeItemproduct();
    // Ограничение на лукап менеджера
    this.set('managerLimitPredicate', new SimplePredicate('position', 'eq', 'Manager'));

    // Настройки лукапа товара
    this.set('productProperties', {
      choose: 'showLookupDialog',
      remove: 'removeLookupValue',
      displayAttributeName: 'nameWCode',
      required: false,
      relationName: 'product',
      projection: 'ProductL',
      autocomplete: true,
      lookupLimitPredicate: undefined
    });
    this.get('lookupEventsService').on('lookupDialogOnHidden', this, this._setLookupPredicate);
    this.get('groupEditEventsService').on('olvRowDeleted', this, this._setLookupPredicate);
  },

  storeItemproduct() {
    let store = this.get('store');
    let builder = new Builder(store, 'i-i-s-shop-order-item');
    builder.selectByProjection('OrderItemE');
    store.query('i-i-s-shop-order-item', builder.build())
      .then(function(products) {
        products.forEach(function (product) {
          store.pushPayload('i-i-s-shop-order-item', product, builder.build())
        });
    });
  },

  storeproduct() {
    let store = this.get('store');
    let builder = new Builder(store, 'i-i-s-shop-product');
    builder.selectByProjection('ProductE');
    store.query('i-i-s-shop-product', builder.build())
      .then(function(products) {
        products.forEach(function (product) {
          store.pushPayload('i-i-s-shop-product', product, builder.build())
        });
    });
  },

  blockfield:Ember.observer('model.dirtyType', function() {
    let model_status = this.get('model.dirtyType');
    const status = this.get('model.status');
    const dirtyAttributes = this.get('model.hasDirtyAttributes');
    let bool_blocked = (status === OrderStatusEnum.Canceled || status === OrderStatusEnum.Paid) && !dirtyAttributes;
    this.set('isPaid', bool_blocked)
  }),

  summTotall:Ember.observer('model.orderItem.@each.{amount,priceWTaxes}', function() {
    if (this.get('isPaid')) {
      let summ = this.get('model.orderItem').reduce((sum, item) => {
        const id = item.get('id');
        let store = this.get('store');
        const product = store.peekRecord('i-i-s-shop-order-item', id)
        const priceWTaxes = Number(product.get('priceWTaxes') || 0);
        const amount = Number(item.get('amount') || 0);
        item.set('actualpriceWTaxes', (priceWTaxes ).toFixed(2))
        item.set('actualTotalSum', (priceWTaxes * amount).toFixed(2))
        if (Number.isNaN(priceWTaxes) || Number.isNaN(amount)) {
          throw new Error(`Invalid 'priceWTaxes' or 'amount' for order item: '${item}'.`);
        }
        return sum + priceWTaxes * amount;
      }, 0);
      this.set('actualTotalSum', parseInt(summ))
    }
    else {
    let summ = this.get('model.orderItem').reduce((sum, item) => {
      const id = item.get('product.id');
      let store = this.get('store');
      const product = store.peekRecord('i-i-s-shop-product', id)
      const priceWTaxes = Number(product.get('price') || 0) * 1.1;
      const amount = Number(item.get('amount') || 0);
      if (Number.isNaN(priceWTaxes) || Number.isNaN(amount)) {
        throw new Error(`Invalid 'priceWTaxes' or 'amount' for order item: '${item}'.`);
      }
      return sum + priceWTaxes * amount;
    }, 0);
    this.set('actualTotalSum', parseInt(summ))
    }
  }),

  

  willDestroy() {
     this._super(...arguments);
     this.get('lookupEventsService').off('lookupDialogOnHidden', this, this._setLookupPredicate);
     this.get('groupEditEventsService').off('olvRowDeleted', this, this._setLookupPredicate);
  },

  _setLookupPredicate(componentName, record) {
    switch (componentName) {
      case '(orderItemGroupEdit_flexberry-lookup_product)':
        this.setProductLookupPredicate(record);
        break;
      case 'orderItemGroupEdit':
        this.setProductLookupPredicate(record);
        break;
    }
  },

  actions: {
    configurateOrderItemRow(rowConfig) {
      let readonlyColumns = ['priceWTaxes', 'totalSum'];
      set(rowConfig, 'readonlyColumns', readonlyColumns);
    },

    removeLookupValue(lookupProperties) {
      this._super(...arguments);
      if (lookupProperties.relationName === 'product') {
        this.setProductLookupPredicate();
      }
    },    
  },

  setProductLookupPredicate(record) {
    let recordId;
    if (record) {
        recordId = record.get('product.id');
    }
    let productIds = [];
    let orderItems = this.get('model.orderItem');
    if (orderItems) {
    orderItems.forEach(item => {
      let product = item.get('product');
      if (product && product.get('id') !== recordId) {
      productIds.push(product.get('id'));
      }
    });
    }

    let predicate = generateNotOrPredicateByList('id', 'eq', productIds);
    this.set('productProperties.lookupLimitPredicate', predicate);
  },

  getCellComponent(attr, bindingPath, model) {
    let cellComponent = this._super(...arguments);
    if (attr.kind === 'belongsTo') {
      switch (`${model.modelName}+${bindingPath}`) {
        case 'i-i-s-shop-order-item+product':
          cellComponent.componentProperties = this.get('productProperties');
          break;

      }
    }

    if (bindingPath === 'totalSum') {
      cellComponent.componentName = 'order-item/total-sum';
    }

    if (bindingPath === 'priceWTaxes') {
      cellComponent.componentName = 'order-item/price-w-taxes';
    }

    return cellComponent;
  },
});
