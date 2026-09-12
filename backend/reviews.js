import { z } from "zod";

export const reviewSchema = z.object({
  author: z.string().trim().min(1).max(80),
  text: z.string().trim().min(1).max(2000),
  rating: z.number().int().min(1).max(5),
  published: z.boolean(),
});

export function mountReviews(app, { transaction, admin, wrap }) {
  app.get(
    "/api/reviews",
    wrap(async (req, res) => {
      res.json(
        await transaction((s) =>
          (s.reviews || [])
            .filter((r) => r.published)
            .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
        ),
      );
    }),
  );
  app.get(
    "/api/admin/reviews",
    admin,
    wrap(async (req, res) => {
      res.json(await transaction((s) => s.reviews || []));
    }),
  );
  app.post(
    "/api/admin/reviews",
    admin,
    wrap(async (req, res) => {
      const input = reviewSchema.parse(req.body);
      const review = {
        ...input,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await transaction((s) => {
        s.reviews ??= [];
        s.reviews.push(review);
      });
      res.status(201).json(review);
    }),
  );
  app.put(
    "/api/admin/reviews/:id",
    admin,
    wrap(async (req, res) => {
      const input = reviewSchema.parse(req.body);
      const review = await transaction((s) => {
        const row = (s.reviews || []).find((r) => r.id === req.params.id);
        if (!row) return null;
        Object.assign(row, input, { updatedAt: new Date().toISOString() });
        return row;
      });
      if (!review) return res.status(404).json({ error: "Review not found." });
      res.json(review);
    }),
  );
  app.delete(
    "/api/admin/reviews/:id",
    admin,
    wrap(async (req, res) => {
      const found = await transaction((s) => {
        const index = (s.reviews || []).findIndex(
          (r) => r.id === req.params.id,
        );
        if (index < 0) return false;
        s.reviews.splice(index, 1);
        return true;
      });
      if (!found) return res.status(404).json({ error: "Review not found." });
      res.json({ ok: true });
    }),
  );
}
