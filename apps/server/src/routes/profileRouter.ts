import { apiJsonRseponse } from "@/utils";
import prisma from "@movie-ticket-booking/db"; 
import express, { type Request, type Response, type Router } from "express";

const profileRouter: Router = express.Router();

profileRouter.get("/", async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json(apiJsonRseponse(false, null, "Unauthorized"));
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      isOnboarded: true,
      customer: {
        select: { id: true, name: true },
      },
      theatre: {
        select: { id: true, title: true, address: true, city: true, country: true },
      },
    },
  });

  if (!dbUser) {
    return res.status(404).json(apiJsonRseponse(false, null, "User not found"));
  }

  return res.status(200).json(apiJsonRseponse(true, { user: dbUser }, "Profile fetched"));
});

profileRouter.patch("/", async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json(apiJsonRseponse(false, null, "Unauthorized"));
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { role: true },
  });

  if (!dbUser) {
    return res.status(404).json(apiJsonRseponse(false, null, "User not found"));
  }

  try {
    const { email, name, title, address, city, country } = req.body as {
      email?: string;
      name?: string;
      title?: string;
      address?: string;
      city?: string;
      country?: string;
    };

    // Update shared user email if provided
    if (email !== undefined) {
      if (typeof email !== "string" || !email.trim() || !email.includes("@")) {
        return res.status(400).json(apiJsonRseponse(false, null, "Invalid email"));
      }
      await prisma.user.update({
        where: { id: user.id },
        data: { email: email.trim() },
      });
    }

    if (dbUser.role === "CUSTOMER") {
      if (name === undefined) {
        return res.status(400).json(apiJsonRseponse(false, null, "No fields to update"));
      }
      if (typeof name !== "string" || !name.trim()) {
        return res.status(400).json(apiJsonRseponse(false, null, "Invalid name"));
      }

      const updated = await prisma.customer.update({
        where: { userId: user.id },
        data: { name: name.trim() },
      });

      return res.status(200).json(apiJsonRseponse(true, { customer: updated }, "Profile updated"));
    }

    if (dbUser.role === "BUSINESS") {
      const updateData: Record<string, string> = {};
      if (title !== undefined) updateData.title = title.trim();
      if (address !== undefined) updateData.address = address.trim();
      if (city !== undefined) updateData.city = city.trim();
      if (country !== undefined) updateData.country = country.trim();

      if (Object.keys(updateData).length === 0) {
        return res.status(400).json(apiJsonRseponse(false, null, "No fields to update"));
      }

      const updated = await prisma.theatre.update({
        where: { userId: user.id },
        data: updateData,
      });

      return res.status(200).json(apiJsonRseponse(true, { theatre: updated }, "Profile updated"));
    }

    return res.status(400).json(apiJsonRseponse(false, null, "Unknown role"));
  } catch (err) {
    console.error("Profile update error:", err);
    return res.status(500).json(apiJsonRseponse(false, null, "Internal server error"));
  }
});

export default profileRouter;
