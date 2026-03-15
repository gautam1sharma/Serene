const fs = require('fs');
const file = 'src/dashboards/customer/CarDetails.tsx';
let txt = fs.readFileSync(file, 'utf8');

// 1. Add X icon
txt = txt.replace('ChevronRight\n}', 'ChevronRight,\n  X\n}');

// 2. State setup
const stateFind = "const [selectedImageIndex, setSelectedImageIndex] = useState(0);";
const stateReplace = `const [selectedImageIndex, setSelectedImageIndex] = useState(0);\n  const [showImageModal, setShowImageModal] = useState(false);`;
txt = txt.replace(stateFind, stateReplace);

// 3. Make main image clickable
const imgSectionFind = `<img
              src={car.images[selectedImageIndex] || 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800'}
              alt={car.model}
              loading="lazy"
              className="w-full h-full object-cover transition-all duration-300"
            />`;

const imgSectionReplace = `<img
              src={car.images[selectedImageIndex] || 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800'}
              alt={car.model}
              loading="lazy"
              onClick={() => setShowImageModal(true)}
              className="w-full h-full object-cover transition-all duration-300 cursor-pointer hover:scale-105"
            />`;
txt = txt.replace(imgSectionFind, imgSectionReplace);

// 4. Modal JSX at the end
const endFind = `      </Dialog>\n    </div>\n  );\n};`;
const endReplace = `      </Dialog>

      {/* Fullscreen Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
          <button
            onClick={() => setShowImageModal(false)}
            className="absolute top-6 right-6 p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors z-50"
          >
            <X className="w-8 h-8" />
          </button>

          <div className="relative w-full h-full flex items-center justify-center p-4 md:p-12">
            <img
              src={car.images[selectedImageIndex] || 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800'}
              alt={car.model}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            />

            {car.images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImageIndex((prev) => (prev > 0 ? prev - 1 : car.images.length - 1));
                  }}
                  className="absolute left-4 md:left-12 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/80 text-white rounded-full transition-colors"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImageIndex((prev) => (prev < car.images.length - 1 ? prev + 1 : 0));
                  }}
                  className="absolute right-4 md:right-12 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/80 text-white rounded-full transition-colors"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};`;
txt = txt.replace(endFind, endReplace);

fs.writeFileSync(file, txt);
console.log('Done!');
