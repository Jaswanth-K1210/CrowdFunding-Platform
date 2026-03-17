import HeroSection from "../components/HeroSection/HeroSection";
import TopFundraisers from "../components/TopFundraisers/TopFundraisers";
import CategoriesSection from "../components/CategoriesSection/CategoriesSection";
import ExploreCampaigns from "../components/ExploreCampaigns/ExploreCampaigns";
import Testimonials from "../components/Testimonials/Testimonials";
import RaiseFundCTA from "../components/RaiseFundCTA/RaiseFundCTA";

function HomePage() {
  return (
    <div className="space-y-0">
      <HeroSection />
      <TopFundraisers />
      <CategoriesSection />
      <ExploreCampaigns />
      <Testimonials />
      <RaiseFundCTA />
    </div>
  );
}

export default HomePage;
