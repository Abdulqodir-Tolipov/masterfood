import order from './index.js'
import model from './model.js'
export default {
    Query: {
        orders: async (_, {orderId, tableId, pagination = {} }) => {
                return await model.ordersPag(orderId, tableId, pagination)
        }
    },

    OrderSet: {
        orderSetId: (global) => global.order_set_id,
    },

    Mutation: {
        insertOrder: async (_, args) => {
            try {
                let order = await model.insertOrder(args)
                if(order) {
                    return {
                        status: 201,    
                        message: "The new order has been added!",
                        data: order
                    }
                } else throw new Error("The table is already busy!")
            } catch(error) {
                return {
                    status: 401,    
                    message: error,
                    data: null
                }
            }
        },

        updateOrder: async (_, args) => {
            try {
                let order = await model.updateOrder(args)
                if(order) {
                    return {
                        status: 201,    
                        message: "The order has been updated!",
                        data: order
                    }
                } else throw new Error("There is no such order!")
            } catch(error) {
                return {
                    status: 401,    
                    message: error,
                    data: null
                }
            }
        },

        deleteOrder: async (_, args) => {
            try {
                let order = await model.deleteOrder(args)
                if(order) {
                    return {
                        status: 201,    
                        message: "The order has been deleted!",
                        data: order
                    }
                } else throw new Error("There is no such table!")
            } catch(error) {
                return {
                    status: 401,    
                    message: error,
                    data: null
                }
            }
        },

        insertOrderSet: async (_, args) => {
            try {
                let orderSet = await model.insertOrderSet(args)
                if(orderSet) {
                    return {
                        status: 201,    
                        message: "The new orderset has been added!",
                        data: orderSet
                    }
                } else throw new Error("The table is already busy!")
            } catch(error) {
                return {
                    status: 401,    
                    message: error,
                    data: OrderSet
                }
            }
        },

        deleteOrderSet: async (_, args) => {
            try {
                let orderSet = await model.deleteOrderSet(args)
                if(orderSet) {
                    return {
                        status: 201,    
                        message: "The orderset has been deleted!",
                        data: orderSet
                    }
                } else throw new Error("There is no such orderset!")
            } catch(error) {
                return {
                    status: 401,    
                    message: error,
                    data: OrderSet
                }
            }
        },

        payOrder: async (_, args) => {
            try {
                let order = await model.payOrder(args)
                if(order) {
                    return {
                        status: 201,    
                        message: "The order has been payid!",
                        data: order
                    }
                } else throw new Error("There is no such order!")
            } catch(error) {
                return {
                    status: 401,    
                    message: error,
                    data: null
                }
            }
        },
      
    },



    Order: {
        orderId: global => global.order_id,
        tableNumber: global => global.table_number,
        orderSets: global => global.order_sets,
        orderCreatedAt: global => global.order_created_at,
        orderPrice: global => global.order_total_price,
        orderPaid: global => global.order_paid
    },

}