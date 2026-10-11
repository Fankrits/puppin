import { describe, expect, it } from "bun:test";
import { GET as getFavicon } from "../../api/favicon.ico/route";
import { GET as getStoreCustom } from "../../api/store/custom/route";
import { GET as getAdminCustom } from "../../api/admin/custom/route";
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";

describe("Medusa API Routes Unit Tests", () => {
  it("GET /favicon.ico returns 204 No Content to prevent CSP violation", async () => {
    let ended = false;
    let statusCode = 0;

    const mockRes = {
      status: (code: number) => {
        statusCode = code;
        return {
          end: () => {
            ended = true;
          },
        };
      },
    } as unknown as MedusaResponse;

    await getFavicon({} as MedusaRequest, mockRes);

    expect(statusCode).toBe(204);
    expect(ended).toBe(true);
  });

  it("GET /store/custom returns 200 OK", async () => {
    let sentStatus = 0;
    const mockRes = {
      sendStatus: (code: number) => {
        sentStatus = code;
      },
    } as unknown as MedusaResponse;

    await getStoreCustom({} as MedusaRequest, mockRes);
    expect(sentStatus).toBe(200);
  });

  it("GET /admin/custom returns 200 OK", async () => {
    let sentStatus = 0;
    const mockRes = {
      sendStatus: (code: number) => {
        sentStatus = code;
      },
    } as unknown as MedusaResponse;

    await getAdminCustom({} as MedusaRequest, mockRes);
    expect(sentStatus).toBe(200);
  });
});
