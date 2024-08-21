import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { ArrowRight, Check} from "lucide-react";
import { LightBulbIcon } from "./Icons";
import Link from "next/link";

export const HeroCards = () => {
  return (
    <div className="hidden lg:flex flex-row flex-wrap gap-8 relative w-[700px] h-[500px]">
      {/* Testimonial */}
      <Card className="absolute w-[340px] -top-[15px] drop-shadow-xl shadow-black/10 dark:shadow-white/10">
        <CardHeader className="flex flex-row items-center gap-4 pb-2">
          <Avatar>
            <AvatarImage
              alt=""
              src="https://upload.wikimedia.org/wikipedia/en/thumb/e/ed/Nyan_cat_250px_frame.PNG/220px-Nyan_cat_250px_frame.PNG"
            />
            <AvatarFallback>AM</AvatarFallback>
          </Avatar>

          <div className="flex flex-col">
            <CardTitle className="text-lg">Ansh Mishra</CardTitle>
            <CardDescription>Student</CardDescription>
          </div>
        </CardHeader>

        <CardContent>galaxi is such a w bro</CardContent>
      </Card>

      {/* Team */}
      <Card className="absolute right-[20px] top-4 w-80 flex flex-col justify-center items-center drop-shadow-xl shadow-black/10 dark:shadow-white/10">
        <CardHeader className="mt-8 flex justify-center items-center pb-2">
          <img
            src="https://cdn.britannica.com/91/239191-050-8A4AD379/publicity-still-Better-Call-Saul-Bob-Odenkirk-2022.jpg/"
            alt="user avatar"
            className="absolute grayscale-[0%] -top-12 rounded-full w-24 h-24 aspect-square object-cover"
          />
          <CardTitle className="text-center">Vedant Prakash</CardTitle>
          <CardDescription>
            Lawyer
          </CardDescription>
        </CardHeader>

        <CardContent className="text-center pb-2">
          <p>
          made my life better my children dont have to cross 50 rivers now
          </p>
        </CardContent>


      </Card>

      {/* Pricing */}
      <Card className="absolute top-[150px] left-[50px] w-72  drop-shadow-xl shadow-black/10 dark:shadow-white/10">
        <CardHeader>
          <CardTitle className="flex item-center justify-between">
            Shuttle Pass
            <Badge>
              Most popular
            </Badge>
          </CardTitle>
          <div>
            <span className="text-3xl font-bold">$100</span>
            <span className="text-muted-foreground"> /month</span>
          </div>

          <CardDescription>
            Get 20% off on your trips above 60 minutes.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Link href='/pricing' passHref><Button className="w-full gap-1.5">Pricing <ArrowRight className="w-5 h-5" /></Button></Link>
        </CardContent>

        <hr className="w-4/5 m-auto mb-4" />

        <CardFooter className="flex">
          <div className="space-y-4">
            {["Entertainment system", "4 trips a month", "1 free trip after your first 10 light years"].map(
              (benefit: string) => (
                <span
                  key={benefit}
                  className="flex"
                >
                  <Check className="text-primary" />{" "}
                  <h3 className="ml-2">{benefit}</h3>
                </span>
              )
            )}
          </div>
        </CardFooter>
      </Card>

      {/* Service */}
      <Card className="absolute w-[350px] -right-[10px] bottom-[35px]  drop-shadow-xl shadow-black/10 dark:shadow-white/10">
        <CardHeader className="space-y-1 flex md:flex-row justify-start items-start gap-4">
          <div className="mt-1 bg-primary/20 p-1 rounded-2xl">
            <LightBulbIcon />
          </div>
          <div>
            <CardTitle>A venture supported by GoF</CardTitle>
            <CardDescription className="text-md mt-2">
              We have popular support of the people and the government to ensure you get the best experience possible.
            </CardDescription>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
};