# StepNavigation - Componente Reutilizable

## 📋 Descripción

Componente de navegación por pasos (stepper) reutilizable que puede ser usado en cualquier formulario o proceso multi-paso en la aplicación. Diseñado con base en el componente original de `FormCourse` pero mejorado para ser totalmente configurable.

## 📦 Ubicación

```
src/components/ui/StepNavigation.jsx
```

## 🎯 Características

- ✅ **Reutilizable** en múltiples páginas
- ✅ **Totalmente configurable** (pasos, colores, comportamiento)
- ✅ **Responsive** - Se adapta a móvil y desktop
- ✅ **Indicadores visuales** claros (activo, completado, pendiente)
- ✅ **Checkmarks** en pasos completados
- ✅ **Líneas de progreso** animadas
- ✅ **Clickeable opcional** para navegación directa
- ✅ **Colores personalizables** por acento

## 📚 Props

| Prop | Tipo | Requerido | Default | Descripción |
|------|------|-----------|---------|-------------|
| `currentStep` | `number` | ✅ | - | Paso actual (1-indexed) |
| `onStepChange` | `function` | ✅ | - | Callback al cambiar de paso |
| `steps` | `Array` | ✅ | `[]` | Array de pasos (string o objeto) |
| `accentColor` | `string` | ❌ | `'#6C1313'` | Color principal en formato hex |
| `clickable` | `boolean` | ❌ | `true` | Si los pasos son clickeables |

### Formato de `steps`

Puede ser un array de strings o array de objetos:

**Array de strings:**
```javascript
const steps = ['Paso 1', 'Paso 2', 'Paso 3'];
```

**Array de objetos (recomendado):**
```javascript
const steps = [
  { name: 'Datos Generales', description: 'Información básica' },
  { name: 'Requisitos', description: 'Conocimientos previos' },
  { name: 'Contenido', description: 'Módulos y temas' }
];
```

## 💡 Uso

### Ejemplo 1: FormCourse (Color rojo)

```jsx
import { StepNavigation } from '../../components/ui';

const FormCourse = () => {
  const [step, setStep] = useState(1);
  
  const steps = [
    { name: 'Datos Generales', description: 'Información básica del curso' },
    { name: 'Requisitos', description: 'Requisitos y conocimientos previos' },
    { name: 'Contenido', description: 'Módulos y temas del curso' },
    { name: 'Imágenes', description: 'Imágenes y recursos visuales' }
  ];

  return (
    <StepNavigation 
      currentStep={step} 
      onStepChange={setStep} 
      steps={steps}
      accentColor="#6C1313"  // Rojo para cursos
      clickable={true}
    />
  );
};
```

### Ejemplo 2: ConfiguracionHome (Color azul)

```jsx
import { StepNavigation } from '../components/ui';

const ConfiguracionHome = () => {
  const [currentStep, setCurrentStep] = useState(1);
  
  const steps = [
    { name: 'Banner Principal', description: 'Configuración del banner hero' },
    { name: 'Banner Secundario', description: 'Sección de contenido destacado' },
    { name: 'Banner Terciario', description: 'Información adicional' }
  ];

  return (
    <StepNavigation 
      currentStep={currentStep}
      onStepChange={setCurrentStep}
      steps={steps}
      accentColor="#2563eb"  // Azul para configuración
      clickable={true}
    />
  );
};
```

### Ejemplo 3: Pasos simples (sin descripción)

```jsx
const steps = ['Información', 'Revisión', 'Confirmación'];

<StepNavigation 
  currentStep={step}
  onStepChange={setStep}
  steps={steps}
/>
```

### Ejemplo 4: Sin navegación clickeable

```jsx
<StepNavigation 
  currentStep={step}
  onStepChange={setStep}
  steps={steps}
  clickable={false}  // Usuario debe usar botones Siguiente/Anterior
/>
```

## 🎨 Estados Visuales

### Paso Activo
- Fondo con `accentColor` personalizado
- Texto del paso en color del acento
- Número blanco sobre fondo de color
- Sombra para destacar

### Paso Completado
- Fondo verde (`bg-green-500`)
- Checkmark blanco (✓)
- Línea de progreso verde hasta el siguiente paso
- Texto en gris

### Paso Pendiente
- Fondo gris claro (`bg-gray-200`)
- Número en gris
- Sin línea de progreso
- Texto en gris más claro

## 📱 Responsive

- **Desktop (md+):**
  - Stepper horizontal
  - Líneas de progreso visibles entre pasos
  - Descripción visible en `lg+`
  - Círculos de 10x10 (40px)

- **Móvil:**
  - Stepper vertical
  - Sin líneas de progreso
  - Descripción oculta
  - Círculos de 8x8 (32px)

## 🎯 Comportamiento

1. **Click en paso anterior:** Permite navegar libremente
2. **Click en paso actual:** No hace nada
3. **Click en paso futuro:** Depende de la validación en `onStepChange`
4. **Hover:** Opacidad 80% si es clickeable

## 🔧 Personalización de Colores

### Colores predefinidos comunes:

```javascript
// Rojo CTT (Cursos)
accentColor="#6C1313"

// Azul (Configuración)
accentColor="#2563eb"

// Verde (Éxito)
accentColor="#10b981"

// Morado (Premium)
accentColor="#8b5cf6"

// Naranja (Alerta)
accentColor="#f59e0b"
```

## 📊 Comparación con Versión Anterior

| Característica | Versión Anterior | Nueva Versión |
|----------------|------------------|---------------|
| Ubicación | `components/courses` | `components/ui` ✅ |
| Reutilizable | ❌ Solo FormCourse | ✅ Cualquier página |
| Color | Fijo (#6C1313) | Configurable ✅ |
| Descripción | Solo texto | Opcional con objeto ✅ |
| Clickeable | Siempre | Configurable ✅ |
| Iconos | Checkmark texto | Heroicons ✅ |
| Props | 3 props | 5 props (más flexible) ✅ |

## 🚀 Implementado En

1. ✅ **FormCourse** (`src/pages/courses/FormCourse.jsx`)
   - 4 pasos
   - Color rojo (#6C1313)
   - Clickeable

2. ✅ **ConfiguracionHome** (`src/pages/ConfiguracionHome.jsx`)
   - 3 pasos
   - Color azul (#2563eb)
   - Clickeable con validación

## 🔮 Futuras Mejoras

- [ ] Animaciones de transición entre pasos
- [ ] Soporte para pasos opcionales
- [ ] Indicador de progreso porcentual
- [ ] Temas predefinidos (light/dark)
- [ ] Orientación vertical/horizontal configurable
- [ ] Tooltips en cada paso
- [ ] Iconos personalizados por paso

## 📝 Notas Importantes

1. **Numeración:** Los pasos son 1-indexed (empiezan en 1)
2. **Validación:** La validación debe manejarse en `onStepChange`
3. **Descripción:** Solo visible en pantallas grandes (lg+)
4. **Color verde:** Los pasos completados siempre son verdes (no configurable)
5. **CheckIcon:** Requiere `@heroicons/react/24/outline`

## 🐛 Troubleshooting

**Problema:** Los pasos no son clickeables
- **Solución:** Verifica que `clickable={true}` y `onStepChange` esté definido

**Problema:** El color no cambia
- **Solución:** Asegúrate de usar formato hex con # (ej: `#2563eb`)

**Problema:** La descripción no aparece
- **Solución:** Usa objetos con `{name, description}` y pantalla lg+

**Problema:** Errores de importación
- **Solución:** Importa desde `'../components/ui'` no desde `'../components/courses'`

## 📦 Dependencias

- `@heroicons/react` (v24.outline)
- `react` (hooks: ninguno necesario en el componente)
- Tailwind CSS

## 🎓 Ejemplo Completo

```jsx
import { useState } from 'react';
import { StepNavigation } from '../components/ui';

const MultiStepForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  
  const steps = [
    { name: 'Personal Info', description: 'Basic information' },
    { name: 'Address', description: 'Location details' },
    { name: 'Confirmation', description: 'Review and submit' }
  ];

  const handleStepChange = (newStep) => {
    // Aquí puedes agregar validación
    if (validateCurrentStep(currentStep)) {
      setCurrentStep(newStep);
    }
  };

  return (
    <div>
      <StepNavigation 
        currentStep={currentStep}
        onStepChange={handleStepChange}
        steps={steps}
        accentColor="#2563eb"
        clickable={true}
      />
      
      {/* Contenido de cada paso */}
      {currentStep === 1 && <PersonalInfoForm />}
      {currentStep === 2 && <AddressForm />}
      {currentStep === 3 && <ConfirmationForm />}
    </div>
  );
};
```

---

**Creado:** Noviembre 11, 2025  
**Versión:** 1.0.0  
**Mantenedor:** CTT-Admin Team
