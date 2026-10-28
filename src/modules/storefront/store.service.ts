import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ============================================================
// GET STOREFRONT
// Returns business details + all available products + services.
// This is the main page customers land on.
// ============================================================
const getStorefront = async (slug: string) => {
  const business = await prisma.business.findUnique({
    where: { slug },
    select: {
      id: true,
      name: true,
      slug: true,
      type: true,
      category: true,
      description: true,
      phone: true,
      email: true,
      website: true,
      location: true,
      logoUrl: true,
      isActive: true,
      products: {
        where: { isAvailable: true },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
          category: true,
          stockQuantity: true,
          imageUrls: true,
        },
      },
      services: {
        where: { isAvailable: true },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
          priceType: true,
          category: true,
          imageUrl: true,
        },
      },
    },
  });

  if (!business || !business.isActive) {
    const error: Error | any = new Error("Store not found");
    error.statusCode = 404;
    throw error;
  }

  return {
    ...business,
    storeUrl: `${process.env.APP_URL}/${business.slug}`,
  };
};

// ============================================================
// GET PRODUCT DETAIL
// Returns a single product — verifies it belongs to this store.
// ============================================================
const getProductDetail = async (slug: string, productId: string) => {
  const business = await prisma.business.findUnique({
    where: { slug },
    select: { id: true, isActive: true, name: true },
  });

  if (!business || !business.isActive) {
    const error: Error | any = new Error("Store not found");
    error.statusCode = 404;
    throw error;
  }

  const product = await prisma.product.findFirst({
    where: {
      id: productId,
      businessId: business.id,
      isAvailable: true,
    },
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      category: true,
      stockQuantity: true,
      imageUrls: true,
    },
  });

  if (!product) {
    const error: Error | any = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  return {
    ...product,
    businessName: business.name,
    storeUrl: `${process.env.APP_URL}/${slug}`,
  };
};

// ============================================================
// GET SERVICE DETAIL
// Returns a single service — verifies it belongs to this store.
// ============================================================
const getServiceDetail = async (slug: string, serviceId: string) => {
  const business = await prisma.business.findUnique({
    where: { slug },
    select: { id: true, isActive: true, name: true },
  });

  if (!business || !business.isActive) {
    const error: Error | any = new Error("Store not found");
    error.statusCode = 404;
    throw error;
  }

  const service = await prisma.service.findFirst({
    where: {
      id: serviceId,
      businessId: business.id,
      isAvailable: true,
    },
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      priceType: true,
      category: true,
      imageUrl: true,
    },
  });

  if (!service) {
    const error: Error | any = new Error("Service not found");
    error.statusCode = 404;
    throw error;
  }

  return {
    ...service,
    businessName: business.name,
    storeUrl: `${process.env.APP_URL}/${slug}`,
  };
};

const storeService = { getStorefront, getProductDetail, getServiceDetail };

export default storeService;
