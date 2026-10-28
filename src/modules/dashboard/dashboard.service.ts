import { PrismaClient } from "@prisma/client";
import { dashboardQuerySchema, periodEnum } from "./dashboardFilter.validation";
import { z }from "zod";


const prisma = new PrismaClient();

type DashboardQuery = z.infer<typeof dashboardQuerySchema>;
type period = z.infer<typeof periodEnum>;


const getDashboardData = async (
    userId: string,
    query:  DashboardQuery
    ) => {
    const business = await prisma.business.findFirst({
        where: { userId },
    })

    if (!business) throw new Error("Business not found for the user");

    const dateFilter = getDateFilter(query);

    const[
        totalProducts,
        totalOrders,
        totalRevenue,   
        recentOrders,
        customersCount,
        revenueChart,
        salesByCategory,
    ]= await Promise.all([
        prisma.product.count({ where: { businessId: business.id } }),
        prisma.order.count({ where: { businessId: business.id, ...dateFilter } }),
        getTotalRevenue(business.id, dateFilter),
        getRecentOrders(business.id),
        getCustomersCount(business.id),
        getRevenueChart(business.id, dateFilter, query.period),
        getSalesByCategory(business.id, dateFilter)
    ]);

 
  return {
    summary: {
      totalRevenue: totalRevenue,
      totalOrders: totalOrders,
      totalProducts: totalProducts,
      activeCustomers: customersCount,
    },
    revenueChart: revenueChart,
    salesByCategory,
    recentOrders,
    share: getShareLinks(business.slug),
  }
}

const getDateFilter = (query: DashboardQuery) => {
  const filter: any = {};

  // if range is provided, use it
  if (query.from || query.to) {
    filter.createdAt = {};

    if (query.from) {
      const start = new Date(query.from);
      start.setHours(0, 0, 0, 0);
      filter.createdAt.gte = start;
    }

    if (query.to) {
      const end = new Date(query.to);
      end.setHours(0, 0, 0, 0);
      end.setDate(end.getDate() + 1);
      filter.createdAt.lt = end;
    }

    return filter;
  }

  // if no range, use period
  const start = new Date();
  const end = new Date();

  // normalize both
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  end.setDate(end.getDate() + 1);

  if (query.period === "week") {
    start.setDate(start.getDate() - 7);
  }

  else if (query.period === "month") {
    start.setDate(1); // prevent overflow
    start.setMonth(start.getMonth() - 1);
  }

  filter.createdAt = {
    gte: start,
    lt: end,
  };

  return filter;
};


const getTotalRevenue = async (businessId: string, dateFilter: any) => {
    const result = await prisma.order.aggregate({
        where: {
            businessId,
            paymentStatus: "PAID",
            ...dateFilter
        },
        _sum: { totalAmount: true },
    })
    return result._sum.totalAmount || 0;
}

const getRecentOrders = async (businessId: string) => {
    return await prisma.order.findMany({
        where: {
             businessId,
             paymentStatus: "PAID"
        },
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
            customerName: true,
        }
    })
 }

const getCustomersCount = async (businessId: string) => {
    const result = await prisma.order.groupBy({
        by: ["customerName"],
        where: {
            businessId,
            paymentStatus: "PAID",
        },
    })
    return result.length;
}

const getRevenueChart = async (
  businessId: string,
  dateFilter: any,
  period: period
) => {
  const orders = await prisma.order.findMany({
    where: {
      businessId,
      paymentStatus: "PAID",
      ...dateFilter,
    },
    select: {
      totalAmount: true,
      createdAt: true,
    },
  });

  const result: Record<string, number> = {};

  orders.forEach((order) => {
    const date = new Date(order.createdAt);
    let key = "";

    if (period === "month") {
      key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    } else if (period === "week") {
      const week = Math.ceil(date.getDate() / 7);
      key = `${date.getFullYear()}-W${String(week).padStart(2, "0")}`;
    } else {
      key = date.toISOString().split("T")[0];
    }

    if (!result[key]) result[key] = 0;

    result[key] += Number(order.totalAmount);
  });

  return Object.entries(result).map(([date, revenue]) => ({
    date,
    revenue,
  }));
};

const getSalesByCategory = async (businessId: string, dateFilter: any) => {
  const items = await prisma.orderItem.findMany({
    where: {
      order: {
        businessId,
        paymentStatus: "PAID",
        ...dateFilter
      },
    },
    include: {
      product: {
        select: { category: true },
      },
    },
  });

  const result: Record<string, number> = {};

  items.forEach((item) => {
    const category = item.product?.category || "Other";

    if (!result[category]) result[category] = 0;
    result[category] += Number(item.subtotal);
  });

  return Object.entries(result).map(([category, total]) => ({
    category,
    total,
  }));
};

const getShareLinks = (slug: string) => {
  const baseUrl = `${process.env.APP_URL}/${slug}`;
  const text = encodeURIComponent(`Check out my store ${baseUrl}`);

  return {
    storeUrl: baseUrl,
    whatsapp: `https://wa.me/?text=${text}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${baseUrl}`,
    twitter: `https://twitter.com/intent/tweet?text=${text}`,
  };
};

const dashboardService = {
  getDashboardData,
};

export default dashboardService;