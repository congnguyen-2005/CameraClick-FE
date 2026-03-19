import http from './http';


const CartService = {
  add: (data) => http.post("/cart/add", data),
  getCart: () => http.get("/cart"),
  updateQty: (id, qty) => http.put(`/cart/update/${id}`, { qty }),
  remove: (id) => http.delete(`/cart/remove/${id}`),
};

export default CartService;