// Navegación principal del sitio web
export const mainNavigation = [
  { id: 0, title: 'Home', href: '/' },
  { id: 1, title: 'Cursos', href: 'courses' },
  { id: 2, title: 'Nosotros', href: 'nosotros' },
  { id: 3, title: 'Contáctanos', href: 'contact' },
];

// Items del header (plataforma educativa, certificados)
export const headerNavigation = [
  { id: 1, title: 'Verificar Certificado', href: 'https://ctt-talleresfisei.uta.edu.ec/edu/mod/customcert/verify_certificate.php' },
  { id: 2, title: 'Plataforma Educativa', href: 'https://ctt-talleresfisei.uta.edu.ec/edu/login/index.php' },
];

// Menú del dashboard administrativo
export const dashboardMenuItems = [
  {
    name: "Cursos",
    path: "/dashboard/cursos",
    icon: "AcademicCapIcon",
    subItems: [
      { name: "Administrar Cursos", path: "/dashboard/cursos/", icon: "BookOpenIcon" },
      { name: "Administrar Categorías", path: "/dashboard/categoriasCursos", icon: "TagIcon" },
    ]
  },
  {
    name: "Congresos",
    path: "/dashboard/congresos",
    icon: "AcademicCapIcon",
    subItems: [
      { name: "Administrar Congresos", path: "/dashboard/congresos/", icon: "BookOpenIcon" },
      { name: "Administrar Categorías", path: "/dashboard/categoriasCongresos", icon: "TagIcon" },
    ]
  },
  {
    name: "Estudiantes",
    path: "/dashboard/estudiantes",
    icon: "AcademicCapIcon",
    subItems: [
      { name: "Administrar Estudiantes", path: "/dashboard/estudiantes/", icon: "UserGroupIcon" },
    ]
  },
  {
    name: "Configuración",
    path: "/dashboard/configuracion",
    icon: "Cog6ToothIcon",
    subItems: [
      { name: "Configuración Home", path: "/dashboard/configuracion/home", icon: "HomeIcon" },
    ]
  },
];
