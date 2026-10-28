// import { prisma } from "../../prisma/client";
// import cloudinary from "../../config/cloudinary";

// export const createItem = async (
//   businessId: string,
//   userId: string,
//   name: string,
//   description: string,
//   price: number,
//   type: "product" | "service",
//   files?: Express.Multer.File[],
// ) => {
//   console.log(price);
//   // Upload images to Cloudinary if provided
//   let imageData: { url: string; publicId: string }[] = [];

//   if (files && files.length > 0) {
//     const uploadPromises = files.map((file, index) => {
//       return new Promise<{ url: string; publicId: string }>(
//         (resolve, reject) => {
//           cloudinary.uploader
//             .upload_stream(
//               { folder: `storely/${businessId}` },
//               (error, result) => {
//                 if (error) reject(error);
//                 else
//                   resolve({
//                     url: result!.secure_url,
//                     publicId: result!.public_id,
//                   });
//               },
//             )
//             .end(file.buffer);
//         },
//       );
//     });

//     imageData = await Promise.all(uploadPromises);
//   }

//   // Create item with images
//   const item = await prisma.item.create({
//     data: {
//       businessId,
//       name,
//       description,
//       price,
//       type,
//       images: {
//         create: imageData.map((img, index) => ({
//           url: img.url,
//           cloudinaryPublicId: img.publicId,
//           position: index,
//         })),
//       },
//     },
//     include: {
//       images: true,
//     },
//   });

//   return item;
// };

// export const getItemsByBusiness = async (businessId: string) => {
//   const items = await prisma.item.findMany({
//     where: { businessId },
//     orderBy: { createdAt: "desc" },
//     include: {
//       images: true,
//     },
//   });
//   return items;
// };

// export const getItemById = async (itemId: string) => {
//   const item = await prisma.item.findUnique({
//     where: { id: itemId },
//     include: {
//       images: true,
//     },
//   });
//   if (!item)
//     throw Object.assign(new Error("Item not found"), { statusCode: 404 });
//   return item;
// };

// export const updateItem = async (
//   itemId: string,
//   userId: string,
//   data: Partial<{
//     name: string;
//     description: string;
//     price: number;
//     type: "product" | "service";
//     imageUrl: string;
//   }>,
// ) => {
//   const item = await prisma.item.findUnique({
//     where: { id: itemId },
//     include: {
//       business: {
//         include: {
//           users: true,
//         },
//       },
//     },
//   });

//   if (!item) {
//     throw Object.assign(new Error("Item not found"), { statusCode: 404 });
//   }

//   // Check if user has access to this business
//   const hasAccess = item.business.users.some((bu) => bu.userId === userId);
//   if (!hasAccess) {
//     throw Object.assign(new Error("Unauthorized to update this item"), {
//       statusCode: 403,
//     });
//   }

//   const updated = await prisma.item.update({
//     where: { id: itemId },
//     data,
//     include: {
//       images: true,
//     },
//   });

//   return updated;
// };

// export const deleteItem = async (itemId: string, userId: string) => {
//   const item = await prisma.item.findUnique({
//     where: { id: itemId },
//     include: {
//       business: {
//         include: {
//           users: true,
//         },
//       },
//     },
//   });

//   if (!item) {
//     throw Object.assign(new Error("Item not found"), { statusCode: 404 });
//   }

//   // Check if user has access to this business
//   const hasAccess = item.business.users.some((bu) => bu.userId === userId);
//   if (!hasAccess) {
//     throw Object.assign(new Error("Unauthorized to delete this item"), {
//       statusCode: 403,
//     });
//   }

//   await prisma.item.delete({ where: { id: itemId } });
//   return true;
// };
