import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AccessibilityPanel } from '../components/AccessibilityPanel';
import { StudySession } from '../components/StudySession';
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { BookOpen, Plus, FileText, Layers, LogOut, Trash2, EarthLock } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Input } from "../components/ui/Input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetTrigger } from "../components/ui/sheet";
import { Label } from "../components/ui/label";
import { Textarea } from '../components/ui/textarea';

// Interfaces

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

// Component
export default function Home() {
  const navigate = useNavigate();

  // Estados de Decks
  const [decks, setDecks] = useState<Deck[]>([]);
  const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null);

  // Estados de Criação de Deck
  const [isCreating, setIsCreatingDeck] = useState(false);
  const [newDeckTitle, setNewDeckTitle] = useState("");
  const [newDeckDesc, setNewDeckDesc] = useState("");
  const [isDeckSheetOpen, setIsDeckSheetOpen] = useState(false);

  // Estados de Criação de Carta
  const [isCardSheetOpen, setIsCardSheetOpen] = useState(false);
  const [targetDeckId, setTargetDeckId] = useState<number | null>(null);
  const [newCardFront, setNewCardFront] = useState("");
  const [newCardBack, setNewCardBack] = useState("");
  const [isCreatingCard, setIsCreatingCard] = useState(false);

  // Configurações de Acessibilidade
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

  const [activeTab, setActiveTab] = useState('decks');

  // Funções de Manipulação

  // Buscar Decks
  const fetchDecks = async () => {
    let token = localStorage.getItem('token');
    if (!token) { navigate('/'); return; }

    token = token.replace(/"/g, '');
    try {
      const response = await fetch('http://localhost:5024/api/decks', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        const formattedDecks = data.map((d: any) => ({
          id: d.id,
          name: d.title || d.name || d.nome,
          description: d.description || d.descricao,
          icon: BookOpen,
          cards: d.cards || [],
        }));
        setDecks(formattedDecks);
      } else if (response.status === 401) {
        localStorage.removeItem('token');
        navigate('/');
      }
    } catch (error) {
      console.error("Erro de conexão", error);
    }
  };

  useEffect(() => {
    fetchDecks();
  }, [navigate]);

  // Criar Deck
  const handleCreateDeck = async () => {
    if (!newDeckTitle.trim()) return;
    setIsCreatingDeck(true);
    let token = localStorage.getItem('token')?.replace(/"/g, '');
    try {
      const response = await fetch('http://localhost:5024/api/decks', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newDeckTitle,
          description: newDeckDesc || "Sem descrição",
          tags: [],
        }),
      });
      if (response.ok) {
        setNewDeckTitle("");
        setNewDeckDesc("");
        setIsDeckSheetOpen(false);
        fetchDecks();
      }
    } catch (error) {
      console.error("Erro ao criar deck", error);
    } finally {
      setIsCreatingDeck(false);
    }
  };

  // Deletar Deck
  const handleDeleteDeck = async (deckId: number, deckName: string) => {
    if (!confirm(`Tem certeza que deseja excluir o deck: "${deckName}"? Esta ação não pode ser desfeita.`)) {
      return; 
    }

    let token = localStorage.getItem('token')?.replace(/"/g, '');
    const API_BASE_URL = 'http://localhost:5024/api/decks';

    try {
      const response = await fetch(`${API_BASE_URL}/${deckId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
      });
      
      if (!response.ok) {
        throw new Error(`Erro ao excluir o deck. Status: ${response.status}`);
      }

      alert(`Deck "${deckName}" excluído com sucesso!`);
      
      setDecks(prevDecks => prevDecks.filter(d => d.id !== deckId));
      
    } catch (error: any) {
      console.error('Erro na requisição de exclusão:', error);
      alert(`Falha ao excluir o deck. Detalhes: ${error.message}`);
    }
  }


  // Adicionar Carta
  const openAddCardSheet = (deckId: number) => {
    setTargetDeckId(deckId);
    setNewCardFront("");
    setNewCardBack("");
    setIsCardSheetOpen(true);
  };

  const handleAddCard = async () => {
    if (!newCardFront.trim() || !newCardBack.trim() || !targetDeckId) return;
    setIsCreatingCard(true);
    let token = localStorage.getItem('token')?.replace(/"/g, '');
    try {
      const response = await fetch(`http://localhost:5024/api/decks/${targetDeckId}/cards`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          frontText: newCardFront,
          backText: newCardBack,
        }),
      });
      if (response.ok) {
        setIsCardSheetOpen(false);
        fetchDecks();
        alert("Carta adicionada!");
      } else {
        alert("Erro ao adicionar carta.");
      }
    } catch (error) {
      console.error("Erro", error);
    } finally {
      setIsCreatingCard(false);
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  // Configurações de Acessibilidade
  useEffect(() => {
    if (settings.darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [settings.darkMode]);

  const handleSettingsChange = (newSettings: Partial<AccessibilitySettings>) => {
    setSettings({ ...settings, ...newSettings });
  };

  // Iniciar e Concluir Sessão de Estudo
  const handleStartStudy = (deck: Deck) => {
    setSelectedDeck(deck);
    setActiveTab('study');
  };

  const handleCompleteStudy = () => {
    setSelectedDeck(null);
    setActiveTab('decks');
  };

  const bgClass = settings.darkMode ? 'bg-gray-900 text-white' : 'bg-[#F0F2F5]';
  const cardBgClass = settings.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white';


  return (
    <div className={`min-h-screen ${bgClass} transition-colors duration-300 relative font-sans`}>
      {/* --- HEADER --- */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 mb-8 sticky top-0 z-30">
        <div className="container mx-auto max-w-5x1 flex items-center justify-between">
          <div>
            <h1 className="auth-logo">Adapty</h1>
          </div>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="gap-4 text-gray-600 hover:text-red-600 hover:bg-red-50 border-gray-300 h-9 px-4 text-sm"
          >
            <LogOut className="w-4 h-4" /> Sair
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 max-w-5xl pb-24">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="hidden">
            <TabsTrigger value="decks">Meus Decks</TabsTrigger>
            <TabsTrigger value="study">Estudar</TabsTrigger>
          </TabsList>

          <TabsContent value="decks" className="space-y-6 mt-0">
            {/* TÍTULO E BOTÃO NOVO DECK */}
            <div className="flex flex-row items-center justify-between mb-4">
              <h1 className="text-x1 md:text-2xl font-bold text-gray-900 tracking-tight">Meus Decks</h1>
              <Sheet open={isDeckSheetOpen} onOpenChange={setIsDeckSheetOpen}>
                <SheetTrigger asChild>
                  <Button
                    className="text-white font-medium px-5 shadow-md hover:shadow-lg transition-all gap-2 h-10"
                    style={{ backgroundImage: 'linear-gradient(10deg, #03A3A9, #024259)' }}
                  >
                    <Plus className="w-4 h-4" /> Novo Deck
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <div className="py-6 space-y-4">
                      <SheetTitle>Novo Deck</SheetTitle>
                    </div>
                    <SheetDescription>Crie um novo tópico de estudo.</SheetDescription>
                  </SheetHeader>
                  <div className="py-6 space-y-4">
                    <Label className="text-sm font-medium">Nome</Label>
                    <Input
                      value={newDeckTitle}
                      onChange={(e) => setNewDeckTitle(e.target.value)}
                      placeholder="Ex: História"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Descrição (Opcional)</Label>
                    <Input
                      value={newDeckDesc}
                      onChange={(e) => setNewDeckDesc(e.target.value)}
                      placeholder="Para que serve este deck?"
                    />
                  </div>
                  <SheetFooter>
                    <Button onClick={handleCreateDeck} disabled={isCreating} className="btn-primary w-full">
                      {isCreating ? "Salvando..." : "Criar Deck"}
                    </Button>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
            </div>

            {/* ÁREA DE CONTEÚDO */}
            <div>
              {decks.length === 0 ? (
                <Card className="w-full max-w-[380px] mx-auto min-h-[480px] flex flex-col items-center justify-center text-center p-8 border border-gray-100 shadow-xl bg-white rounded-xl">
                  <div className="mb-6 text-gray-400">
                    <BookOpen strokeWidth={1.5} className="w-16 h-16 opacity-40" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-3 tracking-wide">Nenhum deck ainda</h3>
                  <p className="text-sm text-gray-500 mb-8 max-w-[200px] leading-relaxed">
                    Comece criando seu primeiro deck de estudos.
                  </p>
                  <Button
                    onClick={() => setIsDeckSheetOpen(true)}
                    className="text-white px-2 py-2 h-auto text-sm font-semibold shadow-md hover:shadow-lg transition-all rounded-md"
                    style={{ backgroundImage: 'linear-gradient(10deg, #03A3A9, #024259)' }}

                  >
                    + Criar Primeiro Deck
                  </Button>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {decks.map((deck) => (
                    <Card key={deck.id} className={`${cardBgClass} flex flex-col hover:shadow-lg transition-all border-l-4`} style={{ borderLeftColor: '#03A3A9' }}>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <BookOpen className="w-5 h-5 text-[#03A3A9]" />
                          {deck.name}
                        </CardTitle>
                        <CardDescription className="line-clamp-2 min-h-[40px]">{deck.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="flex-1 flex flex-col justify-end space-y-4">
                        <Button onClick={() => handleStartStudy(deck)} className="btn-primary w-full" style={{ backgroundColor: '#03A3A9' }}>
                          Estudar ({deck.cards.length} cartões)
                        </Button>
                      </CardContent>
                      <CardFooter className="flex-1 pt-3 flex items-center justify-between">
                        <Button
                        variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteDeck(deck.id, deck.name)} 
                          className="text-muted-foreground text-red-600 hover:text-red-800 font-medium transition-colors hover:bg-red-50 rounded-md px-2 py-1 flex items-center gap-1" style={{ background: "#EF4343", color: "white" }}
                        >
                          <Trash2 className="w-4 h-4" />
                          Excluir
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground hover:text-primary text-gray-500 transition-colors hover:text-[#03A3A9] font-medium"
                          onClick={() => openAddCardSheet(deck.id)}
                        >
                          <Plus className="w-4 h-4 mr-1" /> Add Cartão
                        </Button>
                      </CardFooter>
                      
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="study">
            {selectedDeck && (
              <div className={`${cardBgClass} rounded-xl border shadow-sm p-6 md:p-8`}>
                <div className="mb-6">
                  <Button variant="ghost" onClick={handleCompleteStudy} className="pl-0 hover:pl-2 transition-all">
                    ← Voltar para Decks
                  </Button>
                </div>
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

        <Sheet open={isCardSheetOpen} onOpenChange={setIsCardSheetOpen}>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Adicionar Novo Cartão</SheetTitle>
              <SheetDescription>Crie uma pergunta e resposta.</SheetDescription>
            </SheetHeader>
            <div className="py-6 space-y-6">
              <div className="space-y-2">
                <Label className="text-primary font-semibold flex items-center gap-2">
                  <FileText className="w-4 h-4" /> Frente (Pergunta)
                </Label>
                <Textarea
                  value={newCardFront}
                  onChange={(e) => setNewCardFront(e.target.value)}
                  placeholder="Ex: O que significa 'Book'?"
                  className="min-h-[80px] resize-none"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-primary font-semibold flex items-center gap-2">
                  <Layers className="w-4 h-4" /> Verso (Resposta)
                </Label>
                <Textarea
                  value={newCardBack}
                  onChange={(e) => setNewCardBack(e.target.value)}
                  placeholder="Ex: Significa 'Livro'."
                  className="min-h-[80px] resize-none"
                />
              </div>
            </div>
            <SheetFooter>
              <Button onClick={handleAddCard} disabled={isCreatingCard} className="w-full text-white" style={{ backgroundColor: '#03A3A9' }}>
                {isCreatingCard ? "Salvando..." : "Adicionar Carta"}
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>

      
      <div className="fixed bottom-0 right-0 m-8 z-50">
        <div className="bg-[#038890] rounded-full p-1 shadow-xl hover:scale-105 transition-transform cursor-pointer">
          <AccessibilityPanel settings={settings} onSettingsChange={handleSettingsChange} />
        </div>
      </div>
    </div>
  );
}
