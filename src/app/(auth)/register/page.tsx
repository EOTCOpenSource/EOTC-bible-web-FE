import RegisterForm from "@/components/forms/RegisterForm";
import Image from "next/image";

export default function RegisterPage() {
  return (
      <div className=" md:flex md-w-full top-4 left-0 rounded-3xl bg-gray-100 p-2 md:p-11">
        <div className="image-box md:w-[60%] sm:max-h-[60vh] max-h-[40vh] md:max-h-[90vh] max-w-[50%] rounded-2xl overflow-hidden">
          <img
            src={
              "https://images.pexels.com/photos/17852030/pexels-photo-17852030.jpeg"
            }
            className="w-full h-full object-cover rounded-2xl"
            alt="woman-in-white-robes-and-with-candle"
          />
        </div>
        <div className="form-box md:px-4">
          <RegisterForm />
        </div>
      </div>
  );
}
