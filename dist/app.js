"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_1 = __importDefault(require("./config/swagger"));
const error_middleware_1 = require("./middlewares/error.middleware");
const response_1 = require("./utils/response");
const auth_routes_1 = __importDefault(require("./modules/auth/auth.routes"));
const business_route_1 = __importDefault(require("./modules/business/business.route"));
// import { productRoutes } from "./modules/product/product.route";
const checkout_routes_1 = __importDefault(require("./modules/checkouot/checkout.routes"));
const catalog_routes_1 = __importDefault(require("./modules/catalog/catalog.routes"));
const order_routes_1 = __importDefault(require("./modules/orders/order.routes"));
const waitlist_routes_1 = __importDefault(require("./modules/waitlist/waitlist.routes"));
const store_routes_1 = __importDefault(require("./modules/storefront/store.routes"));
const admin_routes_1 = __importDefault(require("./modules/admin/admin.routes"));
const dashboard_routes_1 = __importDefault(require("./modules/dashboard/dashboard.routes"));
const payment_routes_1 = __importDefault(require("./modules/payments/payment.routes"));
const app = (0, express_1.default)();
const corsOptions = {
    origin: [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://storely-backend-production-07d7.up.railway.app",
        "https://storely-frontend.vercel.app",
        "https://www.appstorely.com",
    ],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
};
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use("/docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.default));
app.get("/", (req, res) => {
    res.send(`
    <div>Storely API running </div>
    <div>last change on 15/06/2026 </div>
    
    `);
});
app.get("/health", (req, res) => {
    (0, response_1.responseSuccess)(res, "OK", null, 200);
});
// routes will go here
app.use("/api/v1/auth", auth_routes_1.default);
app.use("/api/v1/business", business_route_1.default);
app.use("/api/v1/catalog", catalog_routes_1.default);
app.use("/api/v1/checout", checkout_routes_1.default);
app.use("/api/v1/orders", order_routes_1.default);
app.use("/api/v1/payments", payment_routes_1.default);
app.use("/api/v1/checkout", checkout_routes_1.default);
app.use("/api/v1/waitlist", waitlist_routes_1.default);
app.use("/api/v1/store", store_routes_1.default);
app.use("/api/v1/admin", admin_routes_1.default);
app.use("/api/v1/dashboard", dashboard_routes_1.default);
app.use(error_middleware_1.errorHandler);
exports.default = app;
