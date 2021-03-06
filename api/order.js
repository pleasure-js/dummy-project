const { Types: { ObjectId }, Schema } = require('mongoose')
const omit = require('lodash/omit')
const { model: { schema: ProductSchema } } = require('./product.js')
const moment = require('moment')

const ProductOrderSchema = Object.assign({}, omit(ProductSchema, ['stock']), {
  quantity: {
    type: Number,
    default: 1
  }
})

module.exports = {
  // provided by api-plugin-stateful
  model: {
    schema: {
      products: {
        type: [new Schema(ProductOrderSchema)]
      },
      user: {
        type: ObjectId,
        ref: 'user',
        index: true
      },
      created: {
        type: Date,
        default: Date.now,
        index: true
      }
    },
    schemaCreated (schema) {
      schema.virtual('total').get(function () {
        return this.products.reduce((total, { price, quantity }) => {
          return total + (price * quantity)
        }, 0)
      })
    }
  },
  // provided out of the box
  controller: {
    // [POST] > http://myproject/api/order/retrieve-new
    async retrieveNew (payload) {
      // all logic is in your control
      // { params, post, user, ctx } = payload
      return this.find({ created: { $gte: moment().add(-1, 'hours') } })
    },
    async justAnArray () {
      // all logic is in your control
      // { params, post, user, ctx } = payload
      return ['array']
    },
    justAString: {
      schema: {
        name: {
          type: String,
          required: true
        }
      },
      async handler (what) {
        console.log({ what })
        return 'string'
      }
    }
  },
  // provided by api-plugin-stateful
  access: {
    create ({ user, appendEntry }) {
      if (!user) {
        return false
      }

      // assign the order to the current user
      appendEntry.user = user._id
      return true
    },
    list ({ user, queryFilter }) {
      // un-authenticated users can not list orders
      if (!user) {
        return false
      }

      // if is an admin, list all orders
      if (user.level === 'admin') {
        return true
      }

      // list only current user's orders
      queryFilter.push(doc => {
        // use mongoose query object
        return doc.find({ user: user._id })
      })

      return true
    },
    schema ({ user }) {
      return user && user.level === 'admin'
    }
  }
}
