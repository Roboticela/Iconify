import { useState } from "react";
import AppHeader from "./components/AppHeader";
import ImageSelector from "./components/ImageSelector";
import InfoAndColorSelector from "./components/InfoAndColorSelector";
import PreviewContainer from "./components/PreviewContainer";

function App() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden overflow-y-auto custom-scrollbar">
      <AppHeader selectedImage={selectedImage} onResetImage={() => setSelectedImage(null)} />
      <div className="flex flex-col md:flex-row gap-2 sm:gap-4 p-2 sm:p-4 h-[calc(100vh-3.5rem)] max-h-[calc(100vh-3.5rem)] overflow-x-hidden overflow-y-auto md:overflow-y-hidden">
        {/* Left Side - Two Containers */}
        <div className="w-full md:flex-[0.2] flex flex-col gap-2 sm:gap-4 min-w-0 md:min-w-[250px] md:max-w-[290px] md:h-full md:overflow-y-auto custom-scrollbar md:min-h-0 md:pr-2">
          {/* Upper Left - Image Selector */}
          <div className="w-full aspect-square flex-shrink-0 max-w-full">
            <ImageSelector 
              selectedImage={selectedImage}
              onImageSelect={setSelectedImage}
            />
          </div>
          {/* Bottom Left - Information and Color Selector */}
          <div className="flex-shrink-0 min-h-0 w-full min-w-0 overflow-y-hidden">
            <InfoAndColorSelector selectedImage={selectedImage} />
          </div>
        </div>
        {/* Right Side - Preview Container */}
        <div className="w-full md:flex-[0.8] min-w-0 md:min-w-[400px] min-h-[400px] md:h-full md:max-h-full overflow-hidden">
          <PreviewContainer selectedImage={selectedImage} />
        </div>
      </div>
    </div>
  );
}

export default App;
