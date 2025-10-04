import { Input } from "../ui/input";
import { ArrowUpRight } from "lucide-react";

const Subscription = () => {
  return (
    <div className="bg-white pt-10 md:py-20 flex justify-center">
      <div className="w-full md:w-[1344px] h-auto md:h-[123px] bg-[#FFFBF5] rounded-lg flex flex-col md:flex-row justify-center md:justify-center gap-8 md:gap-20 px-6 md:px-12 py-8 md:py-0">
        <h3 className="font-bold text-2xl text-left md:text-left">
          Subscribe to our newsletter for <br className="hidden md:block" />{" "}
          updates and news about <br className="hidden md:block" /> EOTCBible!
        </h3>
        <div>
          <p className="pb-2 text-left md:text-left">
            Enter your email to subscribe
          </p>

          <form className="flex md:flex-row items-center gap-2">
            <Input
              type="email"
              placeholder="example@email.com"
              className="bg-gray-100 border-gray-300 rounded-md h-10 w-full sm:w-80"
            />
            <button className="bg-red-900 text-white pl-6 pr-2 py-2 rounded-md flex items-center justify-center space-x-2 sm:w-auto">
              <span>Subscribe</span>
              <div className="bg-white text-red-900 rounded-md p-1 flex items-center justify-center w-7 h-7">
                <ArrowUpRight size={20} />
              </div>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Subscription;
