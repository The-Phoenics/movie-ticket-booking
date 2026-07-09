import { apiJsonRseponse } from "@/utils";
import prisma from "@movie-ticket-booking/db";
import { auth } from "@movie-ticket-booking/auth";
import { fromNodeHeaders } from "better-auth/node";
import express, { type Request, type Response, type Router } from "express";

const onboardingRouter: Router = express.Router();

onboardingRouter.post("/", async (req: Request, res: Response) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });

  const user = session?.user;
  if (!session || !user) {
    return res.status(401).json(apiJsonRseponse(false, null, "Unauthorized user session"));
  }

  const { role } = req.body as { role?: string };

  if (!role || (role !== "CUSTOMER" && role !== "BUSINESS")) {
    return res
      .status(400)
      .json(apiJsonRseponse(false, null, "Invalid role. Must be CUSTOMER or BUSINESS"));
  }

  try {
    if (role === "CUSTOMER") {
      const { name } = req.body as { name?: string };

      if (!name || typeof name !== "string" || !name.trim()) {
        return res.status(400).json(apiJsonRseponse(false, null, "Name is required"));
      }

      // Upsert customer record (default one may already exist from sign-up hook)
      // and mark user as onboarded in a single transaction
      const [customer] = await prisma.$transaction([
        prisma.customer.upsert({
          where: { userId: user.id },
          update: { name: name.trim() },
          create: { name: name.trim(), userId: user.id },
        }),
        prisma.user.update({
          where: { id: user.id },
          data: { role: "CUSTOMER", isOnboarded: true },
        }),
      ]);

      return res.status(200).json(apiJsonRseponse(true, { customer }, "Onboarding complete"));
    }

    if (role === "OWNER") {
      const { title, address, city, country } = req.body as {
        title?: string;
        address?: string;
        city?: string;
        country?: string;
      };

      if (!title || !address || !city || !country) {
        return res
          .status(400)
          .json(apiJsonRseponse(false, null, "title, address, city and country are all required"));
      }

      // Check if already onboarded as business
      const existing = await prisma.theatre.findUnique({ where: { userId: user.id } });
      if (existing) {
        return res
          .status(409)
          .json(apiJsonRseponse(false, null, "User has already been onboarded as a business"));
      }

      const [theatre] = await prisma.$transaction([
        prisma.theatre.create({
          data: {
            userId: user.id,
            title: title.trim(),
            address: address.trim(),
            city: city.trim(),
            country: country.trim(),
          },
        }),
        prisma.user.update({
          where: { id: user.id },
          data: { role: "BUSINESS", isOnboarded: true },
        }),
      ]);

      // Remove the default customer record created at sign-up
      await prisma.customer.deleteMany({ where: { userId: user.id } }).catch(() => {});

      return res.status(201).json(apiJsonRseponse(true, { theatre }, "Onboarding complete"));
    }
  } catch (err) {
    console.error("Onboarding error:", err);
    return res.status(500).json(apiJsonRseponse(false, null, "Internal server error"));
  }
});

export default onboardingRouter;
