import { Upload, Image as ImageIcon, Video } from 'lucide-react';
import { EventDraft, EventDraftUpdate } from '../../types/event';

interface MediaGalleryProps {
  data: EventDraft;
  onUpdate: (data: EventDraftUpdate) => void;
}

export function MediaGallery({ data, onUpdate }: MediaGalleryProps) {
  const additionalImages = data.additionalImages || [];

  const handleMainImageUpload = (file: File | undefined) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    onUpdate({ mainImage: url });
  };

  const handleAdditionalImagesUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const nextImages = Array.from(files).map((file) => URL.createObjectURL(file));
    const mergedImages = [...additionalImages, ...nextImages].slice(0, 10);
    onUpdate({ additionalImages: mergedImages });
  };

  const handleRemoveAdditionalImage = (index: number) => {
    onUpdate({
      additionalImages: additionalImages.filter((_, imageIndex) => imageIndex !== index)
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Media Gallery</h2>
        <p className="text-gray-600">Add visual appeal to your event page</p>
      </div>

      {/* Main Event Image */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Main Event Image <span className="text-red-500">*</span>
        </label>
        <p className="text-sm text-gray-500 mb-3">
          This is the first image attendees will see. Recommended size: 2160x1080px
        </p>

        {data.mainImage ? (
          <div className="relative group">
            <img
              src={data.mainImage}
              alt="Event preview"
              className="w-full h-64 object-cover rounded-lg"
            />
            <button
              type="button"
              onClick={() => onUpdate({ mainImage: '' })}
              className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
            >
              Remove
            </button>
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-[#7626c6] transition-colors cursor-pointer">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              id="main-image-upload"
              onChange={(e) => {
                handleMainImageUpload(e.target.files?.[0]);
                e.currentTarget.value = '';
              }}
            />
            <label htmlFor="main-image-upload" className="cursor-pointer">
              <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-gray-600" />
              </div>
              <p className="text-gray-900 font-medium mb-1">Drop image here or click to upload</p>
              <p className="text-sm text-gray-500">PNG, JPG, GIF up to 10MB</p>
            </label>
          </div>
        )}
      </div>

      {/* Additional Images */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Additional Images (Optional)
        </label>
        <p className="text-sm text-gray-500 mb-3">
          Add more images to showcase your event (up to 10)
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {additionalImages.map((image, index) => (
            <div key={`${image}-${index}`} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group">
              <img src={image} alt={`Event gallery ${index + 1}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => handleRemoveAdditionalImage(index)}
                className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
              >
                Remove
              </button>
            </div>
          ))}

          {additionalImages.length < 10 && (
            <div className="aspect-square border-2 border-dashed border-gray-300 rounded-lg hover:border-[#7626c6] transition-colors">
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                id="additional-images-upload"
                onChange={(event) => {
                  handleAdditionalImagesUpload(event.target.files);
                  event.currentTarget.value = '';
                }}
              />
              <label htmlFor="additional-images-upload" className="w-full h-full flex flex-col items-center justify-center cursor-pointer p-3 text-center">
                <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                <p className="text-xs text-gray-600">Add images</p>
              </label>
            </div>
          )}
        </div>
      </div>

      {/* Video Link */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Event Video (Optional)
        </label>
        <p className="text-sm text-gray-500 mb-3">
          Add a YouTube or Vimeo video to your event header
        </p>

        <div className="relative">
          <Video className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="url"
            value={data.videoUrl}
            onChange={(e) => onUpdate({ videoUrl: e.target.value })}
            placeholder="https://youtube.com/watch?v=..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7626c6] focus:border-transparent"
          />
        </div>

        {data.videoUrl && (
          <div className="mt-4 bg-gray-100 rounded-lg p-8 text-center">
            <Video className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-sm text-gray-600">Video preview</p>
            <p className="text-xs text-gray-500 mt-1">{data.videoUrl}</p>
          </div>
        )}
      </div>

      {/* Tips */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">📸 Image Best Practices</h4>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• Use high-quality, eye-catching images that represent your event</li>
          <li>• Ensure images are well-lit and properly framed</li>
          <li>• Avoid images with too much text overlay</li>
          <li>• Consider using professional event photography</li>
        </ul>
      </div>
    </div>
  );
}
