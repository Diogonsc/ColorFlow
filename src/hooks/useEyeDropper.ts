import { useState, useEffect } from "react";

export function useEyeDropper() {
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    setIsSupported("EyeDropper" in window);
  }, []);

  const pickColor = async (): Promise<string | null> => {
    if (!isSupported || !("EyeDropper" in window)) {
      return null;
    }

    try {
      // @ts-ignore - EyeDropper não está tipado
      const eyeDropper = new EyeDropper();
      const result = await eyeDropper.open();
      return result.sRGBHex;
    } catch (err) {
      // Usuário cancelou ou ocorreu um erro
      return null;
    }
  };

  return { isSupported, pickColor };
}
