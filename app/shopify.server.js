import "@shopify/shopify-app-react-router/adapters/node";
import {
  ApiVersion,
  AppDistribution,
  shopifyApp,
} from "@shopify/shopify-app-react-router/server";
import { PrismaSessionStorage } from "@shopify/shopify-app-session-storage-prisma";
import prisma from "./db.server";

function normalizeAppUrl(rawUrl) {
  if (!rawUrl) return "";
  const trimmed = rawUrl.trim();
  try {
    return new URL(trimmed).origin;
  } catch {
    // Allow plain domains in env by upgrading them to https.
    return `https://${trimmed.replace(/^\/+|\/+$/g, "")}`;
  }
}

function normalizeDomain(rawDomain) {
  if (!rawDomain) return undefined;
  const trimmed = rawDomain.trim();
  try {
    return new URL(trimmed).hostname;
  } catch {
    return trimmed.replace(/^https?:\/\//, "").replace(/\/+$/, "");
  }
}

const appUrl = normalizeAppUrl(process.env.SHOPIFY_APP_URL);
const customShopDomain = normalizeDomain(process.env.SHOP_CUSTOM_DOMAIN);

const shopify = shopifyApp({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET || "",
  apiVersion: ApiVersion.October25,
  scopes: process.env.SCOPES?.split(","),
  appUrl,
  authPathPrefix: "/auth",
  sessionStorage: new PrismaSessionStorage(prisma),
  distribution: AppDistribution.AppStore,
  future: {
    expiringOfflineAccessTokens: true,
  },
  ...(customShopDomain
    ? { customShopDomains: [customShopDomain] }
    : {}),
});

export default shopify;
export const apiVersion = ApiVersion.October25;
export const addDocumentResponseHeaders = shopify.addDocumentResponseHeaders;
export const authenticate = shopify.authenticate;
export const unauthenticated = shopify.unauthenticated;
export const login = shopify.login;
export const registerWebhooks = shopify.registerWebhooks;
export const sessionStorage = shopify.sessionStorage;
