import { mergeTypeDefs } from "@graphql-tools/merge";
import { mergeResolvers } from "@graphql-tools/merge";
import { SellerRegistrationSchemaTypeDefs } from "./schema/sellerTypedefs/sellerRegistration.schema";
import { UserTypeDefs } from "./schema/signup.schema";
import { sellerRegistrationResolver } from "./resolvers/sellerResolvers/selllerRegistration.resolver";
import { signupResolver } from "./resolvers/signup.resolver";
import { uploadFileTypeDef } from "./schema/fileUploads/uploadFile.schema";
import { fileUploadResolvers } from "./resolvers/fileUpload/uploadFile.resolver";
import { SellerTypedef } from "./schema/seller/seller.schema";
import { sellerResolver } from "./resolvers/seller/seller.resolver";
import { productRegistrationTypedefs } from "./schema/products/productRegistration.schema";
import { productRegsitrationResolver } from "./resolvers/product/productRegistration.resolver";
import { cartTypedefs } from "./schema/cart/cart.schema";
import { cartResolver } from "./resolvers/cart/cart.resolver";
import { userAddressTypeDef } from "./schema/address/userAddress.Schema";
import { addressResolver } from "./resolvers/address/userAddress.resolver";
import { paymentTypeDef } from "./schema/payment/payment.schema";
import { paymentResolver } from "./resolvers/payment/payment.resolver";
import { searchTypedef } from "./schema/search/search.schema";
import { searchResolver } from "./resolvers/search/search.resolver";
import { homeTypedefs } from "./schema/home/home.schema";
import { homeResolvers } from "./resolvers/home/home.resolver";
import { myProfileTypedef } from "./schema/myProfile/myProfile.schema";
import { myProfileResolver } from "./resolvers/myProfile/myProfile.resolver";
import { orderTypedefs } from "./schema/Order/order.schema";
import { orderResolvers } from "./resolvers/Order/order.resolver";
import { refreshTokenTypedefs } from "./schema/refreshToken/refreshToken.schema";
import { refreshResolver } from "./resolvers/refreshToken/refreshToken.resolver";
import { uiTypedefs } from "./schema/ui/ui.schema";
import { uiResolver } from "./resolvers/ui/ui.resolver";

export const typeDefs = mergeTypeDefs([
    SellerRegistrationSchemaTypeDefs,
    UserTypeDefs,
    uploadFileTypeDef,
    SellerTypedef,
    productRegistrationTypedefs,
    cartTypedefs,
    userAddressTypeDef,
    paymentTypeDef,
    searchTypedef,
    homeTypedefs,
    myProfileTypedef,
    orderTypedefs,
    refreshTokenTypedefs,
    uiTypedefs
])

export const resolvers = mergeResolvers([
    sellerRegistrationResolver,
    signupResolver,
    fileUploadResolvers,
    sellerResolver,
    productRegsitrationResolver,
    cartResolver,
    addressResolver,
    paymentResolver,
    searchResolver,
    homeResolvers,
    myProfileResolver,
    orderResolvers,
    refreshResolver,
    uiResolver
])