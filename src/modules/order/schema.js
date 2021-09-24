import { gql } from "apollo-server";

export default gql`
    extend type Query {
        orders(orderId: ID tableId: ID pagination: Pagination ): [Order!]!
    }

    extend type Mutation {
        insertOrder(tableId: ID! ): MutationResponse!
        updateOrder(orderSetId: ID! count: Int!): MutationResponse!
        deleteOrder(orderId: ID! ): MutationResponse!
        insertOrderSet(orderId: ID! steakId: ID! count: Int!): MutationResponse!
        deleteOrderSet(orderSetId: ID!): MutationResponse!
        payOrder(tableId: ID!): MutationResponse!

    }

    type Order {
        orderId: ID!
        tableNumber: Int!
        orderSets: [OrderSet!]!
        orderCreatedAt: Date!
        orderPrice: Int!
        orderPaid: Boolean!
    }

    type OrderSet {
        orderSetId: ID!
        steak: Steak!
        count: Int!
        price: Int!
    }

`   