// in from the right along the road as `cart` grows (its horse's legs left to the distance)
const k = e.anim.clamp(e.state.cart ?? 0, 0, 1), L = e.layer('cart');
L.x = 30 * (1 - k);
L.alpha = k > 0.02 ? 1 : 0;
