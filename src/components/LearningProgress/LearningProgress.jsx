import Lottie from "lottie-react";
import studyingAnimation from "../../assets/lotties/studying.json";

function LearningProgress() {
  return (
    <div className='w-full h-full flex flex-col items-center'>
      <Lottie animationData={studyingAnimation} loop className="size-full" />
    </div>
  );
}

export default LearningProgress;
