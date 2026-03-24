import { useWatch } from "react-hook-form";
import { Image as ImageIcon, Trash2 } from "lucide-react";
import { useEffect, useMemo } from "react";

type Props = {
  variantIndex: number;
  control: any;
  setValue: any;
};

export const VariantImages = ({ variantIndex, control, setValue }: Props) => {
  const variantImages = useWatch({
    control,
    name: `variants.${variantIndex}.variantImages`,
  });

  const previewUrls = useMemo(() => {
    return variantImages?.map((img: any) => img.preview) || [];
  }, [variantImages]);

  useEffect(() => {
  return () => {
    previewUrls.forEach((url: string) => {
      URL.revokeObjectURL(url);
    });
  };
}, [previewUrls]);

  if (!variantImages || variantImages.length === 0) {
    return (
      <div className="aspect-square bg-gray-50 rounded-lg flex items-center justify-center border border-gray-100 opacity-50">
        <ImageIcon className="w-4 h-4 text-gray-300" />
      </div>
    );
  }

  return (
    <>
      {previewUrls.map((imgUrl: string, imgIdx: number) => (
        <div
          key={imgIdx}
          className="aspect-square relative group rounded-lg overflow-hidden border border-gray-200 bg-white shadow-sm"
        >
          <img src={imgUrl} className="w-full h-full object-cover" />

          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center">
            <button
              type="button"
              onClick={() => {
                const updated = variantImages.filter((_: any, i: number) => i !== imgIdx);
                setValue(`variants.${variantIndex}.variantImages`, updated, {
                  shouldDirty: true,
                });
              }}
              className="p-2 bg-red-500 rounded-full text-white"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </>
  );
};