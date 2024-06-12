export const baseURLS = {
  basePublicServer: `${process.env.NODE_ENV === "production" ? "https://thearkive.app" : "http://localhost:5173"}/public`,
  baseThumbnailServer: "https://arkive-v4-thumbnail-service.up.railway.app",
};
