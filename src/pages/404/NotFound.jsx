import { Link } from "react-router-dom";
import planetSvg from "../../assets/404/planet.svg";
import astronautSvg from "../../assets/404/astronaut.svg";
import { HomeIcon } from "@heroicons/react/24/solid";
export default function NotFound() {
  return (
    <div className="w-screen h-screen bg-[#25344C] text-white flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/src/assets/404/particles.png')] bg-cover bg-repeat-x animate-[var(--animate-stars)]"></div>

      <h1 className="text-[100px] font-extrabold relative z-10">404</h1>
      <p className="text-lg text-center max-w-[350px] relative z-10">
        LOST IN{" "}
        <span className="relative after:absolute after:border-b-4 after:border-[#fdba26] after:left-0 after:top-1/2 after:w-full">
          SPACE
        </span>
        &nbsp;
        <span className="text-[#fdba26] font-medium">Fuel your Fluency</span>?
        <br />
        Hmm, looks like that page doesn&apos;t exist.
      </p>

      <div className="w-[390px] h-[390px] relative z-10">
        <img
          src={astronautSvg}
          alt="Astronaut"
          className="w-12 h-12 animate-spin"
        />

        <img src={planetSvg} alt="Planet" />
      </div>

      <Link to="/" className="relative z-10">
        <button className="mt-4 flex items-center px-4 py-2 border border-white text-white hover:text-[#fdba26] hover:border-[#fdba26] rounded transition-all">
          <HomeIcon className="mr-2" /> Go Home
        </button>
      </Link>
    </div>
  );
}
