import { useState } from 'react';
import { AccessibilityPanel } from './components/AccessibilityPanel';
import { StudySession } from './components/StudySession';
import { Button } from './components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { BookOpen, Brain, GraduationCap } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';

interface AccessibilitySettings {
  fontSize: number;
  fontFamily: string;
  darkMode: boolean;
  highContrast: boolean;
  reducedMotion: boolean;
  animationSpeed: number;
  cardColor: string;
  textColor: string;
}

interface Deck {
  id: number;
  name: string;
  description: string;
  icon: typeof BookOpen;
  cards: Array<{ id: number; front: string; back: string }>;
}

const sampleDecks: Deck[] = [
  {
    id: 1,
    name: 'Matemática Básica',
    description: '20 cartões de conceitos fundamentais',
    icon: Brain,
    cards: [
      { id: 1, front: 'O que é uma fração?', back: 'Uma fração representa uma parte de um todo. Ex: 1/2 significa uma parte de duas partes iguais.' },
      { id: 2, front: 'O que é uma equação?', back: 'Uma equação é uma igualdade matemática que contém uma ou mais variáveis. Ex: 2x + 3 = 7' },
      { id: 3, front: 'O que é perímetro?', back: 'Perímetro é a soma de todos os lados de uma figura geométrica.' },
      { id: 4, front: 'O que é área?', back: 'Área é a medida da superfície de uma figura geométrica, expressa em unidades quadradas.' },
      { id: 5, front: 'O que são números primos?', back: 'Números primos são números maiores que 1 que só podem ser divididos por 1 e por eles mesmos. Ex: 2, 3, 5, 7, 11' },
    ],
  },
  {
    id: 2,
    name: 'Ciências - Corpo Humano',
    description: '15 cartões sobre anatomia básica',
    icon: BookOpen,
    cards: [
      { id: 6, front: 'Quantos ossos tem o corpo humano adulto?', back: 'O corpo humano adulto tem aproximadamente 206 ossos.' },
      { id: 7, front: 'Qual é a função do coração?', back: 'O coração bombeia sangue para todo o corpo, levando oxigênio e nutrientes às células.' },
      { id: 8, front: 'O que são os pulmões?', back: 'Os pulmões são órgãos responsáveis pela respiração, realizando a troca de oxigênio e gás carbônico.' },
      { id: 9, front: 'Qual é o maior órgão do corpo?', back: 'A pele é o maior órgão do corpo humano.' },
      { id: 10, front: 'Quantos litros de sangue circulam no corpo?', back: 'Um adulto tem aproximadamente 5 litros de sangue circulando no corpo.' },
    ],
  },
  {
    id: 3,
    name: 'História do Brasil',
    description: '18 cartões de eventos importantes',
    icon: GraduationCap,
    cards: [
      { id: 11, front: 'Quando o Brasil foi descoberto?', back: 'O Brasil foi descoberto em 22 de abril de 1500 por Pedro Álvares Cabral.' },
      { id: 12, front: 'Quando foi proclamada a Independência?', back: 'A Independência do Brasil foi proclamada em 7 de setembro de 1822 por Dom Pedro I.' },
      { id: 13, front: 'Quando foi abolida a escravidão?', back: 'A escravidão foi abolida em 13 de maio de 1888 com a Lei Áurea, assinada pela Princesa Isabel.' },
      { id: 14, front: 'Quando foi proclamada a República?', back: 'A República foi proclamada em 15 de novembro de 1889 pelo Marechal Deodoro da Fonseca.' },
      { id: 15, front: 'Quem foi Tiradentes?', back: 'Tiradentes foi um dentista e militar que liderou a Inconfidência Mineira, movimento pela independência do Brasil.' },
    ],
  },
];

export default function Home() {
  const [settings, setSettings] = useState<AccessibilitySettings>({
    fontSize: 24,
    fontFamily: 'system-ui',
    darkMode: false,
    highContrast: false,
    reducedMotion: false,
    animationSpeed: 0.6,
    cardColor: '#e3f2fd',
    textColor: '#0d47a1',
  });

  const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null);
  const [activeTab, setActiveTab] = useState('decks');

  const handleSettingsChange = (newSettings: Partial<AccessibilitySettings>) => {
    setSettings({ ...settings, ...newSettings });
  };

  const handleStartStudy = (deck: Deck) => {
    setSelectedDeck(deck);
    setActiveTab('study');
  };

  const handleCompleteStudy = () => {
    setSelectedDeck(null);
    setActiveTab('decks');
  };

  const bgClass = settings.darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-blue-50 to-indigo-50';
  const cardBgClass = settings.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white';

  return (
    <div className={`min-h-screen ${bgClass} transition-colors duration-300`}>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl mb-2">Adapty</h1>
            <p className="text-lg text-muted-foreground">
              Aprenda no seu ritmo, do seu jeito
            </p>
          </div>
          <AccessibilityPanel settings={settings} onSettingsChange={handleSettingsChange} />
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="decks">Meus Decks</TabsTrigger>
            <TabsTrigger value="study" disabled={!selectedDeck}>Estudar</TabsTrigger>
          </TabsList>

          {/* Decks Tab */}
          <TabsContent value="decks" className="space-y-6">
            <div className="text-center space-y-2 mb-8">
              <h2 className="text-2xl">Escolha um deck para começar</h2>
              <p className="text-muted-foreground">
                Selecione um conjunto de cartões para estudar
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sampleDecks.map((deck) => {
                const Icon = deck.icon;
                return (
                  <Card key={deck.id} className={`${cardBgClass} hover:shadow-lg transition-shadow`}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="flex items-center gap-2 mb-2">
                            <Icon className="w-5 h-5" />
                            {deck.name}
                          </CardTitle>
                          <CardDescription>{deck.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Button
                        onClick={() => handleStartStudy(deck)}
                        className="w-full"
                        size="lg"
                      >
                        Começar a Estudar
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Accessibility Features Info */}
            <Card className={`${cardBgClass} mt-8`}>
              <CardHeader>
                <CardTitle>Recursos de Acessibilidade</CardTitle>
                <CardDescription>
                  Esta aplicação foi projetada para estudantes neurodivergentes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Tamanho de fonte ajustável</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Fontes amigáveis para dislexia</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Modo escuro e alto contraste</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Controle de velocidade de animação</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Cores personalizáveis</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Navegação por teclado completa</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Sistema de progresso visual</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Redução de distrações</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Study Tab */}
          <TabsContent value="study">
            {selectedDeck && (
              <div className={`${cardBgClass} rounded-lg p-6 md:p-8`}>
                <StudySession
                  cards={selectedDeck.cards}
                  deckName={selectedDeck.name}
                  fontSize={settings.fontSize}
                  fontFamily={settings.fontFamily}
                  darkMode={settings.darkMode}
                  highContrast={settings.highContrast}
                  reducedMotion={settings.reducedMotion}
                  animationSpeed={settings.animationSpeed}
                  cardColor={settings.cardColor}
                  textColor={settings.textColor}
                  onComplete={handleCompleteStudy}
                />
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
