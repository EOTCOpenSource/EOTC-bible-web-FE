import LoginForm from "@/components/forms/LoginForm";
import RegisterForm from "@/components/forms/RegisterForm";
import Image from "next/image";

export default function RegisterPage() {
  return (
      <div className=" md:flex md:items-center md-w-full md:max-w-5xl max-h-[94vh] overflow-y-scroll mx-auto top-4 left-0 md:rounded-3xl bg-gray-100 p-2 md:p-6">
        <div className="image-box md:aspect-[6/8] max-h-[50vh] sm:max-h-[60vh] md:max-h-[88vh] md:max-w-[50%] md:h-full bg-gray-500  rounded-2xl overflow-hidden">
          <img
            src={
              "https://images.pexels.com/photos/17852064/pexels-photo-17852064.jpeg"
            }
            className="w-full h-full object-cover rounded-2xl"
            alt="woman-in-white-robes-and-with-candle"
          />
        </div>
        <div className="form-box md:px-4 flex-1">
          <LoginForm />
        </div>
      </div>
  );
}
