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
    subItems: [
        { name: "Todos los Cursos", path: "/dashboard/cursos/" },
    ]
  },
  { 
    name: "Estudiantes", 
    path: "/dashboard/estudiantes"
  },
  { 
    name: "Configuración", 
    path: "/dashboard/configuracion",
    subItems: [
      { name: "Configuración Home", path: "/dashboard/configuracion/home" },
    ]
  },
];
