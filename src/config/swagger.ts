import swaggerJsdoc from "swagger-jsdoc";
import { env } from "./env";

const options: any = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "SOTRELY documentation",
      version: "1.0.0",
      description: "api documentation",
    },
    servers: [
      {
        url:
          env.production == "true"
            ? "https://storely-server.onrender.com/api/v1"
            : "http://localhost:5000/api/v1",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        AuthResponse: {
          type: "object",
          properties: {
            success: { type: "boolean" },
            message: { type: "string" },
            data: { type: "object", nullable: true },
          },
        },
        RegisterRequest: {
          type: "object",
          required: ["email", "password", "fullName"],
          properties: {
            email: { type: "string", example: "user@example.com" },
            password: { type: "string", example: "Password123" },
            fullName: { type: "string", example: "Hendrix Drizzy" },
          },
        },
        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", example: "user@example.com" },
            password: { type: "string", example: "Password123" },
          },
        },
        OtpRequest: {
          type: "object",
          required: ["email", "code", "purpose"],
          properties: {
            email: { type: "string" },
            code: { type: "string", example: "123456" },
            purpose: { type: "string" },
          },
        },
        ForgotPasswordRequest: {
          type: "object",
          required: ["email"],
          properties: {
            email: { type: "string" },
          },
        },
        ResetPasswordRequest: {
          type: "object",
          required: ["email", "code", "newPassword"],
          properties: {
            email: { type: "string" },
            code: { type: "string" },
            newPassword: { type: "string" },
          },
        },
        JoinWaitlistRequest: {
          type: "object",
          required: ["fullName", "email"],
          properties: {
            fullName: { type: "string", example: "John Doe" },
            email: { type: "string", example: "john@example.com" },
            phoneNumber: { type: "string", example: "+1234567890" },
          },
        },
        WaitlistEntry: {
          type: "object",
          properties: {
            id: { type: "string" },
            fullName: { type: "string" },
            email: { type: "string" },
            phoneNumber: { type: "string", nullable: true },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        WaitlistResponse: {
          type: "object",
          properties: {
            success: { type: "boolean" },
            data: {
              type: "array",
              items: { $ref: "#/components/schemas/WaitlistEntry" },
            },
          },
        },
        JoinWaitlistResponse: {
          type: "object",
          properties: {
            success: { type: "boolean" },
            message: { type: "string" },
            data: { $ref: "#/components/schemas/WaitlistEntry" },
          },
        },
      },
    },
  },

  apis: ["./src/modules/**/*.ts"], // path to your route files
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
