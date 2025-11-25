import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AccessibilityPanel } from '../components/AccessibilityPanel';
import { StudySession } from '../components/StudySession';
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { BookOpen, Plus, Brain, GraduationCap } from 'lucide-react'; // Adicionei Plus
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Input } from "../components/ui/Input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetTrigger } from "../components/ui/sheet";

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

export default function Home() {
  const navigate = useNavigate();
  
  // 1. Estado dos Decks (Vem do Banco)
  const [decks, setDecks] = useState<Deck[]>([]);
  
  // 2. Estados para Criar Novo Deck
  const [isCreating, setIsCreating] = useState(false);
  const [newDeckTitle, setNewDeckTitle] = useState("");
  const [isSheetOpen, setIsSheetOpen] = useState(false);

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

  // 3. BUSCAR DECKS (Backend)
  useEffect(() => {
    const fetchDecks = async () => {
      let token = localStorage.getItem('token');
      if (!token) { navigate('/'); return; }
      
      // Limpeza de segurança (remove aspas se tiver)
      token = token.replace(/"/g, '');

      try {
        const response = await fetch('http://localhost:5024/api/decks', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          const formattedDecks = data.map((d: any) => ({
             ...d,
             icon: BookOpen, // Ícone padrão
          }));
          setDecks(formattedDecks);
        } else if (response.status === 401) {
            // Só redireciona se for erro de Auth
            localStorage.removeItem('token');
            navigate('/');
        }
      } catch (error) {
        console.error("Erro de conexão", error);
      }
    };

    fetchDecks();
  }, [navigate]);

  // 4. FUNÇÃO PARA CRIAR DECK
  const handleCreateDeck = async () => {
    if (!newDeckTitle.trim()) return;
    setIsCreating(true);
    let token = localStorage.getItem('token');
    if (token) token = token.replace(/"/g, '');

    try {
      const response = await fetch('http://localhost:5024/api/decks', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
            title: newDeckTitle, 
            description: "Criado no App", 
            tags: [] 
        })
      });

      if (response.ok) {
        const newDeckData = await response.json();
        // Adiciona na lista visualmente
        const newDeckObj: Deck = {
            id: newDeckData.deckId,
            name: newDeckTitle,
            description: "Criado no App",
            icon: BookOpen,
            cards: []
        };
        setDecks([...decks, newDeckObj]);
        setNewDeckTitle("");
        setIsSheetOpen(false);
      }
    } catch (error) {
      console.error("Erro ao criar deck", error);
    } finally {
      setIsCreating(false);
    }
  };

  // ... (Efeitos e handlers de settings mantidos iguais) ...
  useEffect(() => {
    if (settings.darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [settings.darkMode]);

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
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="auth-logo-home">Adapty</h1>
            <p className="text-lg text-muted-foreground">Aprenda no seu ritmo</p>
          </div>
          <AccessibilityPanel settings={settings} onSettingsChange={handleSettingsChange} />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="decks">Meus Decks</TabsTrigger>
            <TabsTrigger value="study" disabled={!selectedDeck}>Estudar</TabsTrigger>
          </TabsList>

          <TabsContent value="decks" className="space-y-6">
            
            {/* BOTÃO NOVO DECK */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Seus Decks</h2>
                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                  <SheetTrigger asChild>
                    <Button className="gap-2 btn-primary">
                      <Plus className="w-4 h-4" /> Novo Deck
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>Novo Deck</SheetTitle>
                      <SheetDescription>Crie um novo tópico de estudo.</SheetDescription>
                    </SheetHeader>
                    <div className="py-6 space-y-4">
                        <label className="text-sm font-medium">Nome</label>
                        <Input 
                          value={newDeckTitle}
                          onChange={(e) => setNewDeckTitle(e.target.value)}
                          placeholder="Ex: História"
                        />
                    </div>
                    <SheetFooter>
                      <Button onClick={handleCreateDeck} disabled={isCreating} className="w-full btn-primary">
                        Salvar
                      </Button>
                    </SheetFooter>
                  </SheetContent>
                </Sheet>
            </div>

            {/* LISTA DE DECKS (Usando a variável 'decks' correta) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {decks.length === 0 ? (
                <div className="col-span-3 text-center py-12 opacity-60 border-2 border-dashed rounded-lg">
                  <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">Nenhum deck encontrado.</p>
                  <p className="text-sm">Crie o primeiro clicando no botão acima!</p>
                </div>
              ) : (
                decks.map((deck) => (
                  <Card key={deck.id} className={`${cardBgClass} hover:shadow-lg transition-shadow`}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BookOpen className="w-5 h-5" />
                        {deck.name}
                      </CardTitle>
                      <CardDescription>{deck.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button onClick={() => handleStartStudy(deck)} className="w-full btn-primary">
                        Estudar ({deck.cards.length} cartões)
                      </Button>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

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