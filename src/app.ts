import cors from "cors";
import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger";
import { errorHandler } from "./middlewares/error.middleware";
import { responseSuccess } from "./utils/response";
import authRoutes from "./modules/auth/auth.routes";
import businessRoutes from "./modules/business/business.route";
// import { productRoutes } from "./modules/product/product.route";
import checkoutRoutes from "./modules/checkouot/checkout.routes";
import catalogRoutes from "./modules/catalog/catalog.routes";
import orderRoutes from "./modules/orders/order.routes";
import waitlistRoutes from "./modules/waitlist/waitlist.routes";
import StoreFrontRoutes from "./modules/storefront/store.routes";
import adminRouter from "./modules/admin/admin.routes";
import dashboardRoutes from "./modules/dashboard/dashboard.routes";
import paymentRoutes from "./modules/payments/payment.routes";

const app = express();
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://storely-server.onrender.com",
  ],
  credentials: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (req, res) => {
  res.send(`
    <div>Storely API running </div>
    <div>last change on 15/06/2026 </div>
    
    `);
});

app.get("/health", (req, res) => {
  responseSuccess(res, "OK", null, 200);
});

// routes will go here
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/business", businessRoutes);
app.use("/api/v1/catalog", catalogRoutes);
app.use("/api/v1/checout", checkoutRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/payments", paymentRoutes);
app.use("/api/v1/checkout", checkoutRoutes);
app.use("/api/v1/waitlist", waitlistRoutes);
app.use("/api/v1/store", StoreFrontRoutes);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/dashboard", dashboardRoutes);

app.use(errorHandler);

export default app;
