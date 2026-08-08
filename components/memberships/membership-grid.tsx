import { getMembershipPlans } from "@/lib/data/content";
import { PlanCard } from "@/components/memberships/plan-card";
import { Stagger, StaggerItem } from "@/components/animations/reveal";

export async function MembershipGrid() {
  const plans = await getMembershipPlans();
  if (plans.length === 0) return null;

  return (
    <Stagger
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      staggerDelay={0.1}
    >
      {plans.map((plan) => (
        <StaggerItem key={plan.id}>
          <PlanCard plan={{ ...plan, price: plan.price.toString() }} />
        </StaggerItem>
      ))}
    </Stagger>
  );
}
