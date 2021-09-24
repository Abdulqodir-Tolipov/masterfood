import {fetch, fetchAll} from '../../lib/postgres.js'


const ORDERS_PAG = `
    select
        o.order_id,
        o.order_created_at,
        t.table_number,
        o.order_paid,
        sum(os.price) as order_total_price,
        json_agg(os) as order_sets
    from orders o
    natural join tables t
    inner join (
    select 
        os.order_set_id,
        os.order_id,
        os.count,
        os.order_set_price * os.count as price,
        row_to_json(s) as steak
    from order_sets os
    natural join steaks s
    group by s.*, os.order_set_id
    ) os on os.order_id = o.order_id
    where
    case
        when $1 > 0 then o.order_id = $1
        else true
    end and
    case
    when $2 > 0 then t.table_id = $2
    else true
    end
    group by o.order_id, t.table_number
    offset $3 limit $4
`


const ORDERS = `
select
	o.order_id,
	o.order_created_at,
	t.table_number,
	o.order_paid,
	sum(os.price) as order_total_price,
	json_agg(os) as order_sets
from orders o
natural join tables t
inner join (
select 
	os.order_set_id,
	os.order_id,
	os.count,
	os.order_set_price * os.count as price,
	row_to_json(s) as steak
from order_sets os
natural join steaks s
group by s.*, os.order_set_id
) os on os.order_id = o.order_id
where
case
	when $1 > 0 then o.order_id = $1
	else true
end and
case
when $2 > 0 then t.table_id = $2
else true
end
group by o.order_id, t.table_number
`

const INSERT_ORDER = `
	INSERT INTO orders (
		table_id
	) VALUES ($1)
	RETURNING order_id
`

const INSERT_ORDER_SET = `
	INSERT INTO order_sets (
		order_id,
		steak_id,
		count,
		order_set_price
	) select $1, $2, $3, s.steak_price from steaks s
	where s.steak_id = $2
	RETURNING *
`

const CHECK_TABLE = `
	select 
		o.order_id,
		case
			when o.table_id is not null and o.order_paid = true then false
			when o.table_id is null then false
			else true
		end as table_busy
	from orders o
	right join tables t on t.table_id = o.table_id
	where t.table_id = $1
	order by o.order_created_at desc
	limit 1
`

const PAY_ORDER = `
	UPDATE orders SET 
		order_paid = true
	WHERE table_id = $1
	RETURNING *
`

const DELETE_ORDER_SET = `
	DELETE FROM order_sets
	WHERE order_set_id = $1
	RETURNING *
`

const DELETE_ORDER = `
	DELETE FROM orders
	WHERE order_id = $1
	RETURNING *
`

const PUT_ORDER = `
	WITH old_data as (
		SELECT
			count
		FROM order_sets
		WHERE order_set_id = $1
	) UPDATE order_sets os SET
		count = old_data.count + $2
	FROM old_data
	WHERE order_set_id = $1
	RETURNING os.*
`

const insertOrder = async ({ steakId, tableId, count }) => {
	let [{table_busy}] = await fetchAll(CHECK_TABLE, tableId)
	if(!table_busy) {
		let [newOrder] = await fetchAll(INSERT_ORDER, tableId)
		let [newOrderSet] = await fetchAll(INSERT_ORDER_SET, newOrder.order_id, steakId, count )
		return newOrderSet
	} else {
		return null
	}
}

const ordersPag = (orderId=0, tableId=0, { page = 0, limit = 0 }) => {
    try {
		if(!page || !limit) return fetchAll(ORDERS,orderId,tableId)
      return fetchAll(ORDERS_PAG, orderId, tableId, (page-1) * limit, limit)
    } catch(error) {
        throw error
    }
}

const orders = () => {
    try {
     return  fetchAll(ORDERS)
    } catch(error) {  
        throw error
    }
}

// const insertOrder = async ({ tableId }) => {
// 	try {
// 		return await fetch(INSERT_ORDER, tableId)
// 	} catch (error) {
// 		throw error
// 	}
// }

const updateOrder = async ({ orderSetId, count }) => {
	try {
		return await fetchAll(PUT_ORDER, orderSetId, count)
	} catch (error) {
		throw error
	}
}

const deleteOrder = async ({ orderId }) => {
	try {
		return fetch(DELETE_ORDER, orderId)
	} catch (error) {
		throw error
	}
}


const insertOrderSet = async ({orderId, steakId, count}) => {	
	try {
		return await fetchAll(INSERT_ORDER_SET, orderId, steakId, count)
	} catch (error) {
		throw error
	}
}

const deleteOrderSet = async ({ orderSetId }) => {
	try {
		return await fetch(DELETE_ORDER_SET, orderSetId)
	} catch (error) {
		throw error
	}
}

const payOrder = async ({ tableId }) => {
	try {
		return await fetch(PAY_ORDER, tableId)
	} catch (error) {
		throw error
	}
}



					



export default {
    orders,
	ordersPag,
    insertOrder,
	insertOrderSet,
    payOrder,
    deleteOrderSet,
    deleteOrder,
    updateOrder
}