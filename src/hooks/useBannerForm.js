import { useState, useEffect } from 'react';
import { getBanners, updateBanners } from '../api/banners';
import { toast } from 'react-toastify';

/**
 * Hook personalizado para manejar el formulario de banners
 */
export const useBannerForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  // Estado para cada banner
  const [banner1, setBanner1] = useState({
    subtitulo: '',
    titulo: '',
    boton: {
      texto: '',
      direccion: ''
    },
    imagenes: [{ imagen: '' }]
  });

  const [banner2, setBanner2] = useState({
    imagenes: [{
      imagen: '',
      titulo: '',
      subtitulo: '',
      descripcion: '',
      boton: {
        texto: '',
        direccion: ''
      }
    }]
  });

  const [banner3, setBanner3] = useState({
    imagenes: [{
      imagen: '',
      titulo: '',
      subtitulo: '',
      descripcion: '',
      boton: {
        texto: '',
        direccion: ''
      }
    }]
  });

  // Agregar/eliminar imágenes para Banner 1
  const addBanner1Image = () => {
    setBanner1(prev => ({
      ...prev,
      imagenes: [...prev.imagenes, { imagen: '' }]
    }));
  };

  const removeBanner1Image = (index) => {
    setBanner1(prev => ({
      ...prev,
      imagenes: prev.imagenes.filter((_, i) => i !== index)
    }));
  };

  // Agregar/eliminar imágenes para Banner 2
  const addBanner2Image = () => {
    setBanner2(prev => ({
      ...prev,
      imagenes: [...prev.imagenes, {
        imagen: '',
        titulo: '',
        subtitulo: '',
        descripcion: '',
        boton: { texto: '', direccion: '' }
      }]
    }));
  };

  const removeBanner2Image = (index) => {
    setBanner2(prev => ({
      ...prev,
      imagenes: prev.imagenes.filter((_, i) => i !== index)
    }));
  };

  // Agregar/eliminar imágenes para Banner 3
  const addBanner3Image = () => {
    setBanner3(prev => ({
      ...prev,
      imagenes: [...prev.imagenes, {
        imagen: '',
        titulo: '',
        subtitulo: '',
        descripcion: '',
        boton: { texto: '', direccion: '' }
      }]
    }));
  };

  const removeBanner3Image = (index) => {
    setBanner3(prev => ({
      ...prev,
      imagenes: prev.imagenes.filter((_, i) => i !== index)
    }));
  };

  // Cargar datos existentes
  useEffect(() => {
    const loadBanners = async () => {
      try {
        const data = await getBanners();
        if (data.banner) setBanner1(data.banner);
        if (data.banner2) setBanner2(data.banner2);
        if (data.banner3) setBanner3(data.banner3);
      } catch (error) {
        toast.error('Error al cargar la configuración actual');
      } finally {
        setLoadingData(false);
      }
    };

    loadBanners();
  }, []);

  // Handlers para Banner 1
  const updateBanner1Field = (field, value) => {
    setBanner1(prev => ({ ...prev, [field]: value }));
  };

  const updateBanner1Boton = (field, value) => {
    setBanner1(prev => ({
      ...prev,
      boton: { ...prev.boton, [field]: value }
    }));
  };

  const updateBanner1Imagen = (index, value) => {
    setBanner1(prev => ({
      ...prev,
      imagenes: prev.imagenes.map((img, i) => 
        i === index ? { imagen: value } : img
      )
    }));
  };

  // Handlers para Banner 2
  const updateBanner2Field = (index, field, value) => {
    setBanner2(prev => ({
      ...prev,
      imagenes: prev.imagenes.map((img, i) => 
        i === index ? { ...img, [field]: value } : img
      )
    }));
  };

  const updateBanner2Boton = (index, field, value) => {
    setBanner2(prev => ({
      ...prev,
      imagenes: prev.imagenes.map((img, i) => 
        i === index ? { 
          ...img, 
          boton: { ...img.boton, [field]: value } 
        } : img
      )
    }));
  };

  // Handlers para Banner 3
  const updateBanner3Field = (index, field, value) => {
    setBanner3(prev => ({
      ...prev,
      imagenes: prev.imagenes.map((img, i) => 
        i === index ? { ...img, [field]: value } : img
      )
    }));
  };

  const updateBanner3Boton = (index, field, value) => {
    setBanner3(prev => ({
      ...prev,
      imagenes: prev.imagenes.map((img, i) => 
        i === index ? { 
          ...img, 
          boton: { ...img.boton, [field]: value } 
        } : img
      )
    }));
  };

  // Validaciones
  const validateStep = (step) => {
    switch (step) {
      case 1:
        if (!banner1.subtitulo || !banner1.titulo) {
          toast.warning('Por favor completa todos los campos del Banner 1');
          return false;
        }
        if (!banner1.boton.texto || !banner1.boton.direccion) {
          toast.warning('Completa la información del botón del Banner 1');
          return false;
        }
        if (banner1.imagenes.length === 0 || !banner1.imagenes[0]?.imagen) {
          toast.warning('Agrega al menos una imagen al Banner 1');
          return false;
        }
        // Validar que todas las imágenes tengan URL
        const emptyImages1 = banner1.imagenes.some(img => !img.imagen);
        if (emptyImages1) {
          toast.warning('Completa todas las URLs de imágenes del Banner 1');
          return false;
        }
        return true;

      case 2:
        if (banner2.imagenes.length === 0) {
          toast.warning('Agrega al menos una imagen al Banner 2');
          return false;
        }
        // Validar cada imagen del banner 2
        for (let i = 0; i < banner2.imagenes.length; i++) {
          const img = banner2.imagenes[i];
          if (!img.imagen || !img.titulo || !img.subtitulo || !img.descripcion) {
            toast.warning(`Completa todos los campos de la imagen ${i + 1} del Banner 2`);
            return false;
          }
          if (!img.boton?.texto || !img.boton?.direccion) {
            toast.warning(`Completa la información del botón de la imagen ${i + 1} del Banner 2`);
            return false;
          }
        }
        return true;

      case 3:
        if (banner3.imagenes.length === 0) {
          toast.warning('Agrega al menos una imagen al Banner 3');
          return false;
        }
        // Validar cada imagen del banner 3
        for (let i = 0; i < banner3.imagenes.length; i++) {
          const img = banner3.imagenes[i];
          if (!img.imagen || !img.titulo || !img.subtitulo || !img.descripcion) {
            toast.warning(`Completa todos los campos de la imagen ${i + 1} del Banner 3`);
            return false;
          }
          if (!img.boton?.texto || !img.boton?.direccion) {
            toast.warning(`Completa la información del botón de la imagen ${i + 1} del Banner 3`);
            return false;
          }
        }
        return true;

      default:
        return true;
    }
  };

  // Navegación entre pasos
  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const goToStep = (step) => {
    // Solo permitir ir a pasos anteriores o al mismo paso
    if (step <= currentStep) {
      setCurrentStep(step);
    } else {
      // Si intenta ir a un paso futuro, validar todos los pasos intermedios
      let canProceed = true;
      for (let i = currentStep; i < step; i++) {
        if (!validateStep(i)) {
          canProceed = false;
          break;
        }
      }
      if (canProceed) {
        setCurrentStep(step);
      }
    }
  };

  // Guardar configuración
  const handleSubmit = async () => {
    if (!validateStep(3)) return;

    setLoading(true);
    try {
      const bannerData = {
        banner: banner1,
        banner2: banner2,
        banner3: banner3
      };

      await updateBanners(bannerData);
      
      toast.success('✅ Configuración de banners actualizada exitosamente', {
        autoClose: 3000,
      });
    } catch (error) {
      toast.error(error.message || 'Error al guardar la configuración');
    } finally {
      setLoading(false);
    }
  };

  return {
    // Estados
    currentStep,
    loading,
    loadingData,
    banner1,
    banner2,
    banner3,
    
    // Acciones
    nextStep,
    prevStep,
    goToStep,
    handleSubmit,
    
    // Handlers Banner 1
    updateBanner1Field,
    updateBanner1Boton,
    updateBanner1Imagen,
    addBanner1Image,
    removeBanner1Image,
    
    // Handlers Banner 2
    updateBanner2Field,
    updateBanner2Boton,
    addBanner2Image,
    removeBanner2Image,
    
    // Handlers Banner 3
    updateBanner3Field,
    updateBanner3Boton,
    addBanner3Image,
    removeBanner3Image,
  };
};
