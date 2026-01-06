import { Stats, CourseSection, Carousel, BannerImage } from '../components/home';

const contentHero =[
  {
    id: 1,
    image:
      "https://ctt-talleresfisei.uta.edu.ec/img/carrusel/carrusel_2.jpeg", 
    title: "CURSOS VIRTUALES Y PRESENCIALES",
    subtitle: "Compromiso con el desarrollo tecnológico.",
    buttonText: "Conoce los cursos",
    buttonLink: "#",
  },
  {
    id: 2,
    image:
      "https://www.lahora.com.ec/__export/1744656999548/sites/lahora/img/2025/04/14/20250414_125632861_Universidad_Txcnica_de_Ambato_define_fechas_de_inicio_de_matrxculas.jpg", 
    title: "CURSOS VIRTUALES Y PRESENCIALES",
    subtitle: "Compromiso con el desarrollo tecnológico.",
    buttonText: "Conoce los cursos",
    buttonLink: "#",
  }

];

const slides = [
  {
    id: 1,
    image: "src/assets/fisei.jpg",
    title: "El inicio de una nueva forma de aprendizaje.",
    subtitle: "Sobre Nosotros",
    text: "El 20 de octubre de 2002 se crea el Centro de Transferencia y Desarrollo de Tecnologías mediante resolución 1452-2002-CU-P en la áreas de Ingenierías en Sistemas, Electrónica e Industrial de la Universidad Técnica de Ambato, para proveer servicios a la comunidad mediante la realización de trabajos y proyectos específicos , asesorías, estudios, investigaciones, cursos de entrenamiento, seminarios y otras actividades de servicios a los sectores sociales y productivos en las áreas de Ingeniería en Sistemas computacionales e Informáticos, Ingeniería Electrónica y Comunicaciones e Ingeniería Industrial en Procesos de Automatización.",
    buttonText: "Más información",
    buttonLink: "#",
  },
  {
    id: 2,
    image: "https://picsum.photos/id/1025/1600/600",
    title: "El inicio de una nueva forma de aprendizaje.",
    subtitle: "Sobre Nosotros",
    text: "Desde 2002 impulsamos proyectos, investigaciones y formación en ingeniería y tecnología.",
    buttonText: "conoce más",
    buttonLink: "#",
  },
  {
    id: 3,
    image: "https://picsum.photos/id/1041/1600/600",
    title: "Compromiso con la innovación",
    subtitle: "Investigación y Desarrollo",
    text: "Promovemos el avance académico y científico en beneficio de la sociedad.",
    buttonText: "explorar proyectos",
    buttonLink: "#",
  },
];



const slidesCarrussel = [
  {
    id: 1,
    image:
      "https://picsum.photos/id/1018/1600/600", 
    title: "¡LA UTA SIGUE CRECIENDO CONTIGO!",
    subtitle: "Proyectos UTA financiados por el BDE",
    buttonText: "Conoce los proyectos",
    buttonLink: "#",
  },
  {
    id: 2,
    image:
      "https://picsum.photos/id/1025/1600/600",
    title: "Innovación y Desarrollo",
    subtitle: "Impulsando el futuro académico",
    buttonText: "Descubre más",
    buttonLink: "#",
  },
  {
    id: 3,
    image:
      "https://picsum.photos/id/1041/1600/600",
    title: "Compromiso con la educación",
    subtitle: "Construyendo juntos el conocimiento",
    buttonText: "Explorar",
    buttonLink: "#",
  },
];




export default function Home() {
  return (
    <div>
      <Carousel slides={contentHero} height='calc(100vh - 198px)' buttons colorText={'#FFFFFF'} />
      <CourseSection/>
      <BannerImage slides={slides} />
      <Stats/>
      <Carousel slides={slidesCarrussel} marginBottom={65} colorText={'#6C1313'} background={'white'}/>
    </div>
  );
}
