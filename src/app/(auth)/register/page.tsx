import RegisterForm from "@/components/forms/RegisterForm";
import Image from "next/image";

export default function RegisterPage() {
  return (
      <div className=" md:flex scroll-py-9 md:items-center md-w-full md:max-w-5xl max-h-[94vh] overflow-y-scroll mx-auto top-4 left-0 md:rounded-3xl bg-gray-100 p-2 md:p-6">
        <div className="image-box md:aspect-[6/8] sm:max-h-[60vh] md:max-h-[92vh] md:max-w-[50%] md:h-full bg-red-500  rounded-2xl overflow-hidden">
          <img
            src={
              "https://images.pexels.com/photos/17852030/pexels-photo-17852030.jpeg"
            }
            className="w-full h-full object-cover rounded-2xl"
            alt="woman-in-white-robes-and-with-candle"
          />
        </div>
        <div className="form-box md:px-2">
          <RegisterForm />
        </div>
      </div>
  );
}
