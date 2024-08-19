import { Button } from "./ui/button";
import { buttonVariants } from "./ui/button";
import { HeroCards } from "./HeroCards";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const Hero = () => {
  return (
    <section className="container grid lg:grid-cols-2 place-items-center py-20 md:py-32 gap-10">
      <div className="text-center lg:text-start space-y-6">
        <main className="text-5xl md:text-6xl font-bold">
          <h1 className="inline">
          <span className="text-primary">Intergalactic</span> Transport Using <span className="text-primary">Wormhole</span> Technology
          </h1>
        </main>

        <p className="text-xl text-muted-foreground md:w-10/12 mx-auto lg:mx-0">
            A new way of transportation that allows you to travel between planets
            in seconds. Say goodbye to long hours of space travel and say hello to faster, more efficient travel.
        </p>

        <div className="space-y-4 md:space-y-0 md:space-x-4">
          <Link className={buttonVariants({
            className: 'gap-1.5'
          })} href='/transits'>Get Started <ArrowRight className="w-5 h-5" /></Link>
        </div>
      </div>

      {/* Hero cards sections */}
      <div className="z-10">
        <HeroCards />
      </div>

      {/* Shadow effect */}
      <div className="shadow"></div>
    </section>
  );
};