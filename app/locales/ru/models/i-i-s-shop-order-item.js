export default {
  projections: {
    OrderItemE: {
      product: {
        __caption__: 'Товар',
        name: {
          __caption__: '~'
        },
        productCode: {
          __caption__: '~'
        }
      },
      amount: {
        __caption__: 'Количество'
      },
      priceWTaxes: {
        __caption__: 'Цена с налогами'
      },
      totalSum: {
        __caption__: 'Сумма по позиции'
      }
    },
    OrderItemInOrderL: {
      priceWTaxes: {
        __caption__: '~'
      },
      amount: {
        __caption__: '~'
      }
    }
  },
  validations: {
    amount: {
      __caption__: 'Количество'
    },
    priceWTaxes: {
      __caption__: 'Цена с налогами'
    },
    totalSum: {
      __caption__: 'Сумма по позиции'
    },
    product: {
      __caption__: 'Товар'
    },
    order: {
      __caption__: 'order'
    }
  }
};
