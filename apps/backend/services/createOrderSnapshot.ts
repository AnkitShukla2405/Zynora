import { getUserCartItem } from "@/utils/cart/loggedInUserCart";
import { Product } from "@/model/productRegistration.model";
import { User } from "@/model/user.model";
import { Order } from "@/model/orders.model";
import { fail } from "@/helper/cartItem";
import { Address } from "@/model/userAddress.model";
import { GraphQLError } from "graphql/error/GraphQLError";

export default async function createOrderSnapshot(userId: string, selectedAddressId: string, idemkey: string) {

if (!selectedAddressId) {
  throw new GraphQLError("Shipping address is required", {
    extensions: { code: "BAD_USER_INPUT" }
  });
}
  
  const items = await getUserCartItem(userId);

  if (!items.length) {
  throw new GraphQLError("Cart is empty", {
    extensions: { code: "BAD_USER_INPUT" }
  });
}

  const user = await User.findById(userId);

  if (!user) {
    throw new Error("Only authorised user can perform payments");
  }

  const productIds = items.map((i) => i.productId);

  const products = await Product.find({
    _id: { $in: productIds },
  });

  const orderItems = items.map((item) => {
    const product = products.find((p) => p._id.toString() === item.productId);

    if (!product) {
  throw new Error("Product not found");
}


    const variant = product.variants.find(
      (v) => v._id.toString() === item.variantId,
    );

if (!variant) {
  throw new Error("Variant not found");
}

    if (variant.stock < item.quantity) {
      throw new Error("Insufficient_Stock");
    }



    return {
      productId: product._id,
      sellerId: product.sellerId,
      productSnapshot: {
        name: product.name,
        brand: product.brand,
        image: variant.variantImages?.[0]?.key || ""
      },


        variantSnapshot: {
          variantId: variant._id,
          attributes: variant.attributes?.map((attr: any) => ({
  key: attr.key,
  value: attr.value,
})) || [],
    },

    quantity: item.quantity,
        price: product.sellingPrice,
  }
  }).filter(Boolean);

  const subTotal = orderItems.reduce(
    (sum, item) => sum + item?.price * item?.quantity,
    0
  )

  const discount = 0;

  const shipping = subTotal < 500 ? 100 : 0

  const cgst = Math.round(subTotal * 0.09)
  const sgst = Math.round(subTotal * 0.09)

  const tax = cgst + sgst

  const totalAmount = subTotal + shipping + tax;

  const pricing = {
  subtotal: subTotal,
  discount,
  shipping,
  tax,
  total: totalAmount
};

  const address = await Address.findOne({
    _id: selectedAddressId,
    userId: userId
  })

  if(!address) {
    throw new Error("Address is not selected");
  }

  const shippingAddress = {
    fullName: address.name,
    phone: address.mobile,
    addressLine1: address.addressLine1,
    addressLine2: address.addressLine2,
    city: address.city,
    state: address.state,
    postalCode: address.pincode,
    country: address.country,
  }

  const orderNumber = `ZYN-${Date.now()}-${Math.floor(Math.random()*1000)}`

  const estimatedDelivery = new Date()
estimatedDelivery.setDate(estimatedDelivery.getDate() + 10)

  const order = await Order.create({
    userId: user._id,
    items: orderItems,
    pricing,
    paymentStatus: "pending",
    orderStatus: "placed",
    shippingAddress,
    orderNumber,
    currency: "INR",
    estimatedDelivery,
    paymentProvider: "stripe",
    idempotencyKey: idemkey
  })

  return order
}
