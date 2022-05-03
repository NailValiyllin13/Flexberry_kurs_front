import $ from 'jquery';
import { buildValidations } from 'ember-cp-validations';
import { computed } from '@ember/object';

import {
  defineBaseModel,
  defineProjections,
  ValidationRules,
  Model as InvoiceMixin
} from '../mixins/regenerated/models/i-i-s-shop-invoice';

import DocumentModel from './i-i-s-shop-document';
import { ValidationRules as ParentValidationRules } from '../mixins/regenerated/models/i-i-s-shop-document';

const Validations = buildValidations($.extend({}, ParentValidationRules, ValidationRules), {
  dependentKeys: ['model.i18n.locale'],
});

let Model = DocumentModel.extend(InvoiceMixin, Validations, {
  actualTotalSumInvoice: computed('order', function() {
    const price = this.get('order.totalSum');
  //const order = this.get('order.orderItem');
    return price
  }),
});

defineBaseModel(Model);
defineProjections(Model);

export default Model;
