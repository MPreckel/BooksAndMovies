# 🧪 Guía de Testing con React Testing Library

## Filosofía de Testing

**React Testing Library** sigue el principio:
> "Tus tests deben parecerse a cómo los usuarios interactúan con tu aplicación"

### ✅ Qué hacer:
- Buscar elementos por texto visible, roles, labels
- Probar comportamiento del usuario
- Verificar lo que el usuario ve

### ❌ Qué evitar:
- Buscar por clases CSS o IDs internos
- Probar detalles de implementación
- Acceder al state interno directamente

---

## Anatomía de un Test

```tsx
test('descripción clara de lo que prueba', () => {
  // 1. ARRANGE: Preparar el escenario
  const mockOnClick = jest.fn();
  
  // 2. ACT: Ejecutar la acción
  render(<Card title="Test" onClick={mockOnClick} />);
  const button = screen.getByText('Test');
  await userEvent.click(button);
  
  // 3. ASSERT: Verificar el resultado
  expect(mockOnClick).toHaveBeenCalled();
});
```

---

## Queries de React Testing Library

### 🎯 Por prioridad (usa en este orden):

1. **getByRole** - Más accesible
   ```tsx
   screen.getByRole('button', { name: /submit/i })
   screen.getByRole('heading', { name: 'Title' })
   ```

2. **getByLabelText** - Para formularios
   ```tsx
   screen.getByLabelText('Email')
   ```

3. **getByPlaceholderText** - Para inputs
   ```tsx
   screen.getByPlaceholderText('Enter email...')
   ```

4. **getByText** - Para contenido
   ```tsx
   screen.getByText('Hello World')
   screen.getByText(/hello/i) // case insensitive
   ```

5. **getByAltText** - Para imágenes
   ```tsx
   screen.getByAltText('Logo')
   ```

### 📝 Variantes de queries:

- **getBy...**: Lanza error si no encuentra (único elemento)
- **queryBy...**: Retorna null si no encuentra (para verificar ausencia)
- **findBy...**: Async, espera a que aparezca (promesas)
- **getAllBy...**: Retorna array (múltiples elementos)

---

## Estructura de Tests: Patrón AAA

### ARRANGE (Preparar)
```tsx
const mockData = { title: 'Test', rating: 5 };
const mockCallback = jest.fn();
```

### ACT (Actuar)
```tsx
render(<Card {...mockData} onClick={mockCallback} />);
const button = screen.getByText('Test');
await userEvent.click(button);
```

### ASSERT (Afirmar)
```tsx
expect(mockCallback).toHaveBeenCalledTimes(1);
expect(screen.getByText('Test')).toBeInTheDocument();
```

---

## Matchers Comunes de Jest

### Existencia
```tsx
expect(element).toBeInTheDocument()
expect(element).not.toBeInTheDocument()
expect(element).toBeVisible()
```

### Contenido
```tsx
expect(element).toHaveTextContent('Hello')
expect(element).toContainHTML('<span>Test</span>')
```

### Atributos
```tsx
expect(element).toHaveAttribute('href', '/path')
expect(element).toHaveClass('active')
```

### Formularios
```tsx
expect(input).toHaveValue('test')
expect(checkbox).toBeChecked()
expect(button).toBeDisabled()
```

### Funciones Mock
```tsx
expect(mockFn).toHaveBeenCalled()
expect(mockFn).toHaveBeenCalledTimes(2)
expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2')
expect(mockFn).toHaveBeenLastCalledWith('arg')
```

---

## Testing de Interacciones del Usuario

### User Events (Preferido)
```tsx
import userEvent from '@testing-library/user-event';

test('test con user events', async () => {
  const user = userEvent.setup();
  render(<Component />);
  
  // Click
  await user.click(screen.getByRole('button'));
  
  // Type
  await user.type(screen.getByRole('textbox'), 'Hello');
  
  // Select
  await user.selectOptions(screen.getByRole('combobox'), 'option1');
  
  // Hover
  await user.hover(screen.getByText('Hover me'));
});
```

### FireEvent (Alternativa)
```tsx
import { fireEvent } from '@testing-library/react';

fireEvent.click(button);
fireEvent.change(input, { target: { value: 'test' } });
```

---

## Organización de Tests: describe()

```tsx
describe('Card Component', () => {
  describe('Renderizado básico', () => {
    test('debe renderizar título', () => { /* ... */ });
    test('debe renderizar imagen', () => { /* ... */ });
  });
  
  describe('Interacciones', () => {
    test('debe llamar onClick', () => { /* ... */ });
  });
  
  describe('Accesibilidad', () => {
    test('debe tener alt text', () => { /* ... */ });
  });
});
```

---

## Mocking en Jest

### Mock de funciones
```tsx
const mockFn = jest.fn();
const mockFnWithReturn = jest.fn(() => 'value');
const mockFnWithResolve = jest.fn().mockResolvedValue('async value');
```

### Mock de módulos
```tsx
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));
```

### Mock de API calls
```tsx
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ data: 'test' }),
  })
) as jest.Mock;
```

---

## Testing Asíncrono

### Con findBy (Recomendado)
```tsx
test('carga datos async', async () => {
  render(<AsyncComponent />);
  
  // findBy espera automáticamente
  const element = await screen.findByText('Loaded!');
  expect(element).toBeInTheDocument();
});
```

### Con waitFor
```tsx
import { waitFor } from '@testing-library/react';

test('espera cambios', async () => {
  render(<Component />);
  
  await waitFor(() => {
    expect(screen.getByText('Updated')).toBeInTheDocument();
  });
});
```

---

## Mejores Prácticas

### ✅ DO (Hacer)

1. **Prueba comportamiento del usuario**
   ```tsx
   test('muestra error al enviar formulario vacío', async () => {
     render(<Form />);
     await userEvent.click(screen.getByRole('button', { name: /submit/i }));
     expect(screen.getByText(/required/i)).toBeInTheDocument();
   });
   ```

2. **Usa queries accesibles**
   ```tsx
   screen.getByRole('button')
   screen.getByLabelText('Email')
   ```

3. **Agrupa tests relacionados**
   ```tsx
   describe('Card Component - Props opcionales', () => {
     // tests relacionados...
   });
   ```

4. **Nombres descriptivos**
   ```tsx
   test('debe mostrar mensaje de error cuando el email es inválido', () => {})
   ```

### ❌ DON'T (No hacer)

1. **No pruebes detalles de implementación**
   ```tsx
   // ❌ MAL
   expect(wrapper.find('.card-title').length).toBe(1);
   
   // ✅ BIEN
   expect(screen.getByText('Title')).toBeInTheDocument();
   ```

2. **No uses IDs o clases para queries**
   ```tsx
   // ❌ MAL
   container.querySelector('#card-123')
   
   // ✅ BIEN
   screen.getByText('Card Title')
   ```

3. **No pruebes el state directamente**
   ```tsx
   // ❌ MAL
   expect(component.state.isOpen).toBe(true);
   
   // ✅ BIEN
   expect(screen.getByRole('dialog')).toBeVisible();
   ```

---

## Cobertura de Testing

### Ejecutar con coverage
```bash
npm test -- --coverage
```

### Qué testear (por prioridad):

1. **Crítico** (100% coverage)
   - Funcionalidad core
   - Validaciones
   - Manejo de errores

2. **Importante** (80%+ coverage)
   - Interacciones del usuario
   - Navegación
   - Formularios

3. **Nice to have**
   - Edge cases
   - Estilos dinámicos
   - Animaciones

---

## Snapshot Testing

### Cuándo usarlo:
- ✅ Componentes presentacionales estables
- ✅ Verificar que no hay cambios accidentales

### Cuándo NO usarlo:
- ❌ Como único test
- ❌ Componentes que cambian frecuentemente
- ❌ En lugar de tests específicos

```tsx
test('snapshot test', () => {
  const { container } = render(<Card title="Test" />);
  expect(container.firstChild).toMatchSnapshot();
});
```

---

## Comandos Útiles

```bash
# Ejecutar todos los tests
npm test

# Modo watch (re-ejecuta al cambiar archivos)
npm run test:watch

# Con coverage
npm test -- --coverage

# Test específico
npm test Card.test.tsx

# Actualizar snapshots
npm test -- -u
```

---

## Ejemplo Completo

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Card from './Card';

describe('Card Component', () => {
  test('renderiza y responde a clicks correctamente', async () => {
    // ARRANGE
    const user = userEvent.setup();
    const mockOnClick = jest.fn();
    
    // ACT
    render(
      <Card
        id="1"
        title="Test Card"
        rating={4.5}
        onClick={mockOnClick}
      />
    );
    
    // ASSERT - Verifica renderizado
    expect(screen.getByText('Test Card')).toBeInTheDocument();
    expect(screen.getByText('4.5')).toBeInTheDocument();
    
    // ACT - Simula interacción
    const card = screen.getByText('Test Card').closest('div');
    await user.click(card!);
    
    // ASSERT - Verifica comportamiento
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });
});
```

---

## Recursos

- [React Testing Library Docs](https://testing-library.com/react)
- [Jest Docs](https://jestjs.io/)
- [Testing Library Queries Cheatsheet](https://testing-library.com/docs/queries/about)
- [Common Mistakes](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
