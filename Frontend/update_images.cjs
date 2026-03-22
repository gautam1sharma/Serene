const fs = require('fs');
const file = 'src/dashboards/customer/CarDetails.tsx';
let content = fs.readFileSync(file, 'utf8');
const start = content.indexOf('{/* Image Section */}');
const end = content.indexOf('{/* Details Section */}');

const newHTML = `{/* Image Section */}
        <div className="space-y-4">
          <div className="aspect-video bg-gray-100 rounded-2xl overflow-hidden relative group">
            <img
              src={car.images[selectedImageIndex] || 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800'}
              alt={car.model}
              loading="lazy"
              className="w-full h-full object-cover transition-all duration-300"
            />
            {car.images.length > 1 && (
              <>
                <button
                  onClick={() => setSelectedImageIndex((prev) => (prev > 0 ? prev - 1 : car.images.length - 1))}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white text-gray-800 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setSelectedImageIndex((prev) => (prev < car.images.length - 1 ? prev + 1 : 0))}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white text-gray-800 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
          {car.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {car.images.map((image, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImageIndex(i)}
                  className={\`relative flex-shrink-0 w-24 aspect-video rounded-lg overflow-hidden \${
                    selectedImageIndex === i ? 'ring-2 ring-[#ec5b13]' : 'opacity-70 hover:opacity-100'
                  } transition-all\`}
                >
                  <img
                    src={image}
                    alt={\`\${car.model} view \${i + 1}\`}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        `;

content = content.substring(0, start) + newHTML + content.substring(end);
fs.writeFileSync(file, content);
console.log('Successfully updated CarDetails.tsx');
