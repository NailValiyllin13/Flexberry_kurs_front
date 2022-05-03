export default {
  projections: {
    InvoiceE: {
      number: {
        __caption__: 'number'
      },
      status: {
        __caption__: 'status'
      },
      createDate: {
        __caption__: 'createDate'
      },
      order: {
        __caption__: 'order',
        number: {
          __caption__: 'number'
        }
      },
      customerName: {
        __caption__: 'customerName'
      },
      totalSum: {
        __caption__: 'totalSum'
      },
      totalWeight: {
        __caption__: 'totalWeight'
      },
      note: {
        __caption__: 'note'
      },
      shipmentDate: {
        __caption__: 'shipmentDate'
      },
      responsiblePerson: {
        __caption__: 'responsiblePerson',
        lastName: {
          __caption__: 'lastName'
        },
        firstName: {
          __caption__: 'firstName'
        },
        middleName: {
          __caption__: 'middleName'
        }
      },
      invoiceItem: {
        __caption__: 'invoiceItem',
        product: {
          __caption__: 'product',
          name: {
            __caption__: 'name'
          },
          productCode: {
            __caption__: 'productCode'
          }
        },
        amount: {
          __caption__: 'amount'
        },
        weight: {
          __caption__: 'weight'
        },
        price: {
          __caption__: 'price'
        },
        totalSum: {
          __caption__: 'totalSum'
        }
      }
    },
    InvoiceL: {
      number: {
        __caption__: 'number'
      },
      status: {
        __caption__: 'status'
      },
      createDate: {
        __caption__: 'createDate'
      },
      customerName: {
        __caption__: 'customerName'
      },
      totalSum: {
        __caption__: 'totalSum'
      },
      totalWeight: {
        __caption__: 'totalWeight'
      },
      note: {
        __caption__: 'note'
      },
      responsiblePerson: {
        __caption__: 'responsiblePerson',
        lastName: {
          __caption__: 'lastName'
        }
      },
      shipmentDate: {
        __caption__: 'shipmentDate'
      }
    }
  },
  validations: {
    status: {
      __caption__: 'status'
    },
    shipmentDate: {
      __caption__: 'shipmentDate'
    },
    totalSum: {
      __caption__: 'totalSum'
    },
    totalWeight: {
      __caption__: 'totalWeight'
    },
    note: {
      __caption__: 'note'
    },
    customerName: {
      __caption__: 'customerName'
    },
    responsiblePerson: {
      __caption__: 'responsiblePerson'
    },
    order: {
      __caption__: 'order'
    },
    invoiceItem: {
      __caption__: 'invoiceItem'
    }
  }
};
