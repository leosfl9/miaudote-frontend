"use client";

import { useState, useCallback } from "react";
import NextImage from "next/image";
import Cropper from "react-easy-crop";

export default function PetCard() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [croppedArea, setCroppedArea] = useState<any>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);

  // estados que estavam faltando
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  // Upload do arquivo
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setImageSrc(reader.result as string);
      };
    }
  };

  const onCropComplete = useCallback((_: any, croppedAreaPixels: any) => {
    setCroppedArea(croppedAreaPixels);
  }, []);

  // Helpers para gerar imagem cortada
  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new window.Image();
      image.addEventListener("load", () => resolve(image));
      image.addEventListener("error", (error) => reject(error));
      image.setAttribute("crossOrigin", "anonymous"); // evita problemas CORS
      image.src = url;
    });

  const getCroppedImg = async (imageSrc: string, crop: any) => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) return null;

    canvas.width = crop.width;
    canvas.height = crop.height;

    ctx.drawImage(
      image,
      crop.x,
      crop.y,
      crop.width,
      crop.height,
      0,
      0,
      crop.width,
      crop.height
    );

    return canvas.toDataURL("image/jpeg");
  };

  const handleCropConfirm = async () => {
    if (!imageSrc || !croppedArea) return;
    const cropped = await getCroppedImg(imageSrc, croppedArea);
    setCroppedImage(cropped);
    setImageSrc(null);
  };

  return (
    <div className="flex flex-col max-w-[380px]">
      <div className="relative w-full min-h-64">
        {croppedImage ? (
          <NextImage
            alt="Imagem do animal"
            src={croppedImage}
            className="rounded-t-xl object-cover object-center"
            fill
          />
        ) : (
          <div className="flex items-center justify-center h-64 border rounded-t-xl">
            Nenhuma imagem selecionada
          </div>
        )}
      </div>

      <input type="file" accept="image/*" onChange={handleFileChange} />

      {imageSrc && (
        <div className="fixed inset-0 bg-black/70 flex flex-col items-center justify-center z-50">
          <div className="relative w-[90%] h-[70%] bg-white rounded-lg overflow-hidden">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={380 / 256} // proporção do card
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>
          <div className="flex gap-2 mt-4">
            <button
              className="px-4 py-2 bg-gray-200 rounded"
              onClick={() => setImageSrc(null)}
            >
              Cancelar
            </button>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded"
              onClick={handleCropConfirm}
            >
              Confirmar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
