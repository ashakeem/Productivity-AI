import TypewriterTitle from "@/components/TypewriterTitle";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="text-gray-300 bg-gradient-to-r  min-h-screen from-zinc-900 to-stone-900">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <h1 className="font-semibold md:text-8xl text-5xl text-center">
          AI <span className="text-purple-700 font-bold">productivity</span>{" "}
          assistant.
        </h1>
        <div className="mt-4">
          <h2 className="font-semibold md:text-3xl text-2xl text-center text-gray-400 ">
            <TypewriterTitle />
          </h2>
          <div className="mt-8"></div>
          <div className="flex justify-center">
            <Link href="/dashboard">
              <Button className="bg-purple-700">
                Get Started
                <ArrowRight className="ml-2 w-5 h-5" strokeWidth={3} />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
