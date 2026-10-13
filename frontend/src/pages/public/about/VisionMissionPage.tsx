import React from "react";
import PageHero from "@/components/common/PageHero";
import VisionMissionSection from "../home/VisionMissionSection";

const VisionMissionPage: React.FC = () => {
  return (
    <div className="min-h-screen">
      <PageHero
        badge="Who We Are"
        title="Our Vision & Mission"
        subtitle="Empowering innovation, igniting economic enterprise, and steering Sri Lanka toward a prosperous knowledge economy."
        breadcrumbs={[
          { label: "About Us", href: "/about-us" },
          { label: "Our Vision & Mission" },
        ]}
      />

      {/* Render Vision & Mission with no background color */}
      <VisionMissionSection showQuickLinks={false} showContactUs={false} noBackground={true} />
    </div>
  );
};

export default VisionMissionPage;
