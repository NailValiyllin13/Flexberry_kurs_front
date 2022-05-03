import EditFormRoute from 'ember-flexberry/routes/edit-form';

export default EditFormRoute.extend({
  modelProjection: 'InvoiceE',
  modelName: 'i-i-s-shop-invoice',

  setupController(controller) {
    this._super(...arguments);
    controller.orderlookupLimitPredicate();
  }
});
