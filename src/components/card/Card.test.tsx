import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Card from './Card';
import { CardProps } from './Card.interface';

// ============================================
// MOCK DE NEXT/IMAGE
// ============================================
// Next.js Image requiere un mock en el entorno de testing
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

// ============================================
// DATA DE PRUEBA (Test Fixtures)
// ============================================
const mockCardPropsMinimal: CardProps = {
  id: 'test-1',
  title: 'Test Card Title',
};

const mockCardPropsFull: CardProps = {
  id: 'test-2',
  title: 'Complete Test Card',
  subtitle: 'Test Subtitle',
  description: 'This is a test description for the card component',
  imageUrl: 'https://example.com/image.jpg',
  rating: 4.5,
  footer: 'Test Footer',
  onClick: jest.fn(),
};

// ============================================
// GRUPO 1: RENDERIZADO BÁSICO
// ============================================
describe('Card Component - Renderizado Básico', () => {
  test('debe renderizar correctamente con props mínimas', () => {
    render(<Card {...mockCardPropsMinimal} />);
    
    // Verificar que el título se muestra
    expect(screen.getByText('Test Card Title')).toBeInTheDocument();
  });

  test('debe renderizar correctamente con todas las props', () => {
    render(<Card {...mockCardPropsFull} />);
    
    // Verificar que todos los elementos se muestran
    expect(screen.getByText('Complete Test Card')).toBeInTheDocument();
    expect(screen.getByText('Test Subtitle')).toBeInTheDocument();
    expect(screen.getByText(/This is a test description/)).toBeInTheDocument();
    expect(screen.getByText('Test Footer')).toBeInTheDocument();
    expect(screen.getByText('4.5')).toBeInTheDocument();
  });

  test('debe renderizar la imagen cuando imageUrl está presente', () => {
    render(<Card {...mockCardPropsFull} />);
    
    const image = screen.getByAltText('Complete Test Card');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/image.jpg');
  });
});

// ============================================
// GRUPO 2: PROPS OPCIONALES
// ============================================
describe('Card Component - Props Opcionales', () => {
  test('NO debe renderizar subtitle cuando no se proporciona', () => {
    render(<Card id="test" title="Test" />);
    
    // Verificar que no hay ningún párrafo con la clase de subtitle
    const subtitleElement = screen.queryByText(/Test Subtitle/);
    expect(subtitleElement).not.toBeInTheDocument();
  });

  test('NO debe renderizar description cuando no se proporciona', () => {
    const { container } = render(<Card id="test" title="Test" />);
    
    // Verificar que no hay descripción
    const descriptions = container.querySelectorAll('.line-clamp-3');
    expect(descriptions.length).toBe(0);
  });

  test('NO debe renderizar rating cuando no se proporciona', () => {
    render(<Card id="test" title="Test" />);
    
    // Verificar que no hay estrella de rating
    expect(screen.queryByText('⭐')).not.toBeInTheDocument();
  });

  test('NO debe renderizar footer cuando no se proporciona', () => {
    render(<Card id="test" title="Test" />);
    
    // Verificar que no hay footer
    const { container } = render(<Card id="test" title="Test" />);
    const footers = container.querySelectorAll('.border-t');
    expect(footers.length).toBe(0);
  });

  test('NO debe renderizar imagen cuando imageUrl no se proporciona', () => {
    const { container } = render(<Card id="test" title="Test" />);
    
    // Verificar que no hay imagen
    const images = container.querySelectorAll('img');
    expect(images.length).toBe(0);
  });
});

// ============================================
// GRUPO 3: INTERACCIONES Y EVENTOS
// ============================================
describe('Card Component - Interacciones', () => {
  test('debe llamar a onClick cuando se hace click en la card', async () => {
    const mockOnClick = jest.fn();
    const user = userEvent.setup();
    
    render(
      <Card
        id="test"
        title="Clickable Card"
        onClick={mockOnClick}
      />
    );
    
    // Simular click
    const card = screen.getByText('Clickable Card').closest('div');
    await user.click(card!);
    
    // Verificar que se llamó al callback
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  test('debe tener cursor pointer cuando onClick está presente', () => {
    const { container } = render(
      <Card
        id="test"
        title="Clickable Card"
        onClick={() => {}}
      />
    );
    
    // Buscar el div contenedor principal
    const card = container.querySelector('div[class*="cursor-pointer"]');
    expect(card).toBeInTheDocument();
  });

  test('NO debe tener cursor pointer cuando onClick NO está presente', () => {
    render(<Card id="test" title="Non-Clickable Card" />);
    
    const card = screen.getByText('Non-Clickable Card').closest('div');
    expect(card).not.toHaveClass('cursor-pointer');
  });
});

// ============================================
// GRUPO 4: FORMATO Y VISUALIZACIÓN
// ============================================
describe('Card Component - Formato de Datos', () => {
  test('debe formatear el rating con un decimal', () => {
    render(<Card id="test" title="Test" rating={4.56789} />);
    
    // Verificar que el rating se muestra con un decimal
    expect(screen.getByText('4.6')).toBeInTheDocument();
  });

  test('debe mostrar rating de 0 correctamente', () => {
    render(<Card id="test" title="Test" rating={0} />);
    
    expect(screen.getByText('0.0')).toBeInTheDocument();
  });

  test('debe mostrar el icono de estrella con rating', () => {
    render(<Card id="test" title="Test" rating={5} />);
    
    expect(screen.getByText('⭐')).toBeInTheDocument();
  });
});

// ============================================
// GRUPO 5: ACCESIBILIDAD
// ============================================
describe('Card Component - Accesibilidad', () => {
  test('debe tener alt text correcto en la imagen', () => {
    render(
      <Card
        id="test"
        title="Accessible Card"
        imageUrl="https://example.com/image.jpg"
      />
    );
    
    const image = screen.getByAltText('Accessible Card');
    expect(image).toBeInTheDocument();
  });

  test('debe usar heading semántico para el título', () => {
    render(<Card id="test" title="Semantic Title" />);
    
    const heading = screen.getByRole('heading', { name: 'Semantic Title' });
    expect(heading).toBeInTheDocument();
    expect(heading.tagName).toBe('H3');
  });
});

// ============================================
// GRUPO 6: ESTILOS Y CLASES CSS
// ============================================
describe('Card Component - Estilos', () => {
  test('debe aplicar las clases de Tailwind básicas', () => {
    const { container } = render(<Card id="test" title="Styled Card" />);
    
    // El primer div es el contenedor principal con las clases
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('bg-white', 'rounded-lg', 'shadow-md');
  });

  test('debe aplicar transición y hover effect', () => {
    const { container } = render(<Card id="test" title="Hover Card" />);
    
    // El primer div es el contenedor principal con las clases
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('transition-transform', 'hover:scale-105');
  });
});

// ============================================
// GRUPO 7: CASOS EDGE (Límite)
// ============================================
describe('Card Component - Casos Edge', () => {
  test('debe manejar títulos muy largos', () => {
    const longTitle = 'Este es un título extremadamente largo que podría causar problemas de layout si no se maneja correctamente en el componente';
    
    render(<Card id="test" title={longTitle} />);
    
    expect(screen.getByText(longTitle)).toBeInTheDocument();
  });

  test('debe manejar descripciones vacías', () => {
    render(<Card id="test" title="Test" description="" />);
    
    // Una descripción vacía no debería renderizar el elemento
    const { container } = render(<Card id="test" title="Test" description="" />);
    const descriptions = container.querySelectorAll('.line-clamp-3');
    expect(descriptions.length).toBe(0);
  });

  test('debe manejar rating negativo', () => {
    render(<Card id="test" title="Test" rating={-1} />);
    
    // Debería mostrar el rating aunque sea negativo (edge case)
    expect(screen.getByText('-1.0')).toBeInTheDocument();
  });

  test('debe manejar rating mayor a 10', () => {
    render(<Card id="test" title="Test" rating={15.5} />);
    
    expect(screen.getByText('15.5')).toBeInTheDocument();
  });
});

// ============================================
// GRUPO 8: SNAPSHOT TESTING (Opcional)
// ============================================
describe('Card Component - Snapshot Testing', () => {
  test('debe coincidir con el snapshot para props mínimas', () => {
    const { container } = render(<Card {...mockCardPropsMinimal} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  test('debe coincidir con el snapshot para props completas', () => {
    const { container } = render(<Card {...mockCardPropsFull} />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
