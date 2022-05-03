import EditFormController from 'ember-flexberry/controllers/edit-form';
import Builder from 'ember-flexberry-data/query/builder';
import generateUniqueId from 'ember-flexberry-data/utils/generate-unique-id';
import { generateNotOrPredicateByList } from '../utils/generate-predicate-by-list';
import { inject } from '@ember/service';

export default EditFormController.extend({
  parentRoute: 'i-i-s-shop-invoice-l',
  store: inject(),
  lookupEventsService: inject('lookup-events'),

  init() {
    this._super(...arguments);
    this.storeorderitem();
    this.get('lookupEventsService').on('lookupDialogOnHidden', this, this._setLookupPredicate);
  },
  storeorderitem() {
    let store = this.get('store');
    let builder = new Builder(store, 'i-i-s-shop-invoice');
    builder.selectByProjection('InvoiceE');
    store.query('i-i-s-shop-invoice', builder.build())
      .then(function(invoices) {
        invoices.forEach(function (invoice) {
          let vv = invoice
          store.pushPayload('i-i-s-shop-invoice', invoice, builder.build())
        });
    });
  },

  _setLookupPredicate(componentName) {
    switch (componentName) {
      case 'orderLookup':
        let add_item = this.get('model.order.id')
        this.orderlookupLimitPredicate(undefined, add_item);
        break;
    }
  },

  orderlookupLimitPredicate(remove_item, add_item) {
    let orderIds = [];
    let store = this.get('store');
    store.peekAll('i-i-s-shop-invoice', true).forEach(function (invoice) {
      orderIds.push(invoice.get('order.id'));
    });
    orderIds = orderIds.filter(function(item, pos) {
      return orderIds.indexOf(item) == pos;
    })

    if(remove_item){
      orderIds = orderIds.filter(function(item) {
        return item !== remove_item;
      })
    }
    if(add_item){
      orderIds.push(add_item);
    }
    orderIds = orderIds.filter(function (item) {
      return item != null;
    });

    let predicate = generateNotOrPredicateByList('id', 'eq', orderIds);
    this.set('orderLimitPredicate', predicate);
  },

  orderObserverMethod1: function () {
    const store = this.get('store');
    const order = this.get('model.order');
    const data = this.get('model.shipmentDate');
    if(order) {
      const id = order.get('id');
      const status = order.get('status');
      const paymentDate = order.get('paymentDate');
      const totalSum = order.get('totalSum');
      const manager = order.get('manager');
      const orderItem = order.get('orderItem')
      store.findRecord('i-i-s-shop-order', id).then(function(tyrion) {
        tyrion.set('shipmentDate', data);
        tyrion.save();
      });
      //item_order.save();
    }

  }.observes('model.shipmentDate'),

  orderObserverMethod2: function () {
    //alert('hello');

    //let invoice = this.get('model');
    let order = this.get('model.order');

    var i = 0;
    //this.updateLookupValue({modelToLookup: invoice, newRelationValue: order})

  }.observes('model.order'),

  orderItemsLoading: false,

  updateLookupValue({ modelToLookup: invoice, newRelationValue: order }) {
      invoice.set('order', order);
      invoice.get('invoiceItem').toArray().forEach((item) => {
        item.deleteRecord();
      });

      if (order) {
        this.set('orderItemsLoading', true);

        const store = this.get('store');
        const modelName = 'i-i-s-shop-order-item';

        const query = new Builder(store, modelName)
          .selectByProjection('OrderItemE')
          .where('order', 'eq', order.get('id'))
          .build();

        store.query(modelName, query).then((orderItems) => {
          const invoiceItems = orderItems.map((orderItem) => {
            const id = generateUniqueId();
            const price = orderItem.get('priceWTaxes');
            const totalSum = orderItem.get('totalSum');
            const product = orderItem.get('product');
            const amount = Number(orderItem.get('amount'));
            const weight = Number(product.get('weight')) * amount;

            return store.createRecord('i-i-s-shop-invoice-item', { id, amount, weight, price, totalSum, product, invoice });
          });

          invoice.get('invoiceItem').pushObjects(invoiceItems);
        }).finally(() => {
          this.set('orderItemsLoading', false);
        });
      }
    },

  actions: {
    updateLookupValue({ modelToLookup: invoice, newRelationValue: order }) {
      invoice.set('order', order);
      invoice.get('invoiceItem').toArray().forEach((item) => {
        item.deleteRecord();
      });

      if (order) {
        this.set('orderItemsLoading', true);

        const store = this.get('store');
        const modelName = 'i-i-s-shop-order-item';

        const query = new Builder(store, modelName)
          .selectByProjection('OrderItemE')
          .where('order', 'eq', order.get('id'))
          .build();

        store.query(modelName, query).then((orderItems) => {
          const invoiceItems = orderItems.map((orderItem) => {
            const id = generateUniqueId();
            const price = orderItem.get('priceWTaxes');
            const totalSum = orderItem.get('totalSum');
            const product = orderItem.get('product');
            const amount = Number(orderItem.get('amount'));
            const weight = Number(product.get('weight')) * amount;

            return store.createRecord('i-i-s-shop-invoice-item', { id, amount, weight, price, totalSum, product, invoice });
          });

          invoice.get('invoiceItem').pushObjects(invoiceItems);
        }).finally(() => {
          this.set('orderItemsLoading', false);
        });
      }
    },
    removeLookupValue(lookupProperties) {
      if (lookupProperties.relationName === 'order') {
        let itemindex_remove = lookupProperties.modelToLookup.get('order.id')
        this.set('model.order', undefined);
        this.orderlookupLimitPredicate(itemindex_remove, undefined);
      }
    }
  },

  getCellComponent(attr, bindingPath, model) {
    let cellComponent = this._super(...arguments);
    if (attr.kind === 'belongsTo') {
      switch (`${model.modelName}+${bindingPath}`) {
        case 'i-i-s-shop-invoice-item+product':
          cellComponent.componentProperties = {
            choose: 'showLookupDialog',
            remove: 'removeLookupValue',
            displayAttributeName: 'nameWCode',
            required: true,
            relationName: 'product',
            projection: 'ProductL',
            autocomplete: true,
          };
          break;

      }
    }

    return cellComponent;
  },

  willDestroy() {
   this._super(...arguments);
   this.get('lookupEventsService').off('lookupDialogOnHidden', this, this._setLookupPredicate);
  },
});
