import { Star, Quote } from "lucide-react";
import { FadeIn } from "@/components/ui/fade-in";
import { getReviews } from "@/lib/data";
import { Avatar } from "@/components/ui/avatar";

export async function Testimonials() {
  const reviews = await getReviews();
  const list = (reviews.length > 0 ? reviews : [
    { id: "1", customer_name: "Henok A.", rating: 5, content: "Best barber experience in Addis.", avatar_url: null, is_featured: true, created_at: "", shop_id: null },
    { id: "2", customer_name: "Meron T.", rating: 5, content: "Booking was effortless.", avatar_url: null, is_featured: true, created_at: "", shop_id: null },
    { id: "3", customer_name: "Yared K.", rating: 5, content: "VIP package is worth every birr.", avatar_url: null, is_featured: true, created_at: "", shop_id: null },
  ]) as any[];

  return (
    <section className="section-padding">
      <div className="container-tight">
        <FadeIn>
          <div className="mx-auto max-w-2xl text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-gold-600">
              Testimonials
            </p>
            <h2 className="heading-2 text-balance">Loved by our customers</h2>
            <p className="mt-4 text-muted-foreground">
              4.9 average rating from thousands of happy clients.
            </p>
          </div>
        </FadeIn>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {list.slice(0, 3).map((review, i) => (
            <FadeIn key={review.id} delay={i * 100}>
              <div className="luxury-card relative h-full p-7">
                <Quote className="absolute right-6 top-6 h-7 w-7 text-gold-500/20" />
                <div className="mb-3 flex">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`h-4 w-4 ${
                        s <= review.rating
                          ? "fill-gold-500 text-gold-500"
                          : "text-muted"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-foreground/90">
                  &ldquo;{review.content}&rdquo;
                </p>
                <div className="mt-6 flex items-center gap-3">
                  <Avatar src={review.avatar_url} alt={review.customer_name} size="md" />
                  <div>
                    <div className="font-medium">{review.customer_name}</div>
                    <div className="text-xs text-muted-foreground">Verified customer</div>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}