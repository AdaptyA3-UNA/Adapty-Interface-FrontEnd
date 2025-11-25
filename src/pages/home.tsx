import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AccessibilityPanel } from '../components/AccessibilityPanel';
import { StudySession } from '../components/StudySession';
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { BookOpen, Plus, Brain, GraduationCap, Play, Layers, FileText } from 'lucide-react'; // Adicionei Plus
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Input } from "../components/ui/Input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetTrigger } from "../components/ui/sheet";
import { Label } from "../components/ui/label";
import { Textarea } from '../components/ui/textarea';
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
  const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null);
  
  // 2. Estados para Criar Novo Deck
  const [isCreating, setIsCreatingDeck] = useState(false);
  const [newDeckTitle, setNewDeckTitle] = useState("");
  const [newDeckDesc, setNewDeckDesc] = useState("");
  const [isDeckSheetOpen, setIsDeckSheetOpen] = useState(false);

  // Estados de Criação de CARTA (Novo!)
  const [isCardSheetOpen, setIsCardSheetOpen] = useState(false);
  const [targetDeckId, setTargetDeckId] = useState<number | null>(null);
  const [newCardFront, setNewCardFront] = useState("");
  const [newCardBack, setNewCardBack] = useState("");
  const [isCreatingCard, setIsCreatingCard] = useState(false);
  
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

  // 3. BUSCAR DECKS (Backend)
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
          id: d.id,
          name: d.title || d.name || d.nome, 
          description: d.description || d.descricao,
          icon: BookOpen,
          cards: d.cards || [] 
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

  // 4. FUNÇÃO PARA CRIAR DECK
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
            description: newDeckDesc || "Sem descrição", // Agora envia a descrição certa
            tags: [] 
        })
      });

      if (response.ok) {
        setNewDeckTitle("");
        setNewDeckDesc("");
        setIsDeckSheetOpen(false);
        fetchDecks(); // Recarrega a lista para garantir sincronia
        alert("Deck criado com sucesso!");
      }
    } catch (error) {
      console.error("Erro ao criar deck", error);
    } finally {
      setIsCreatingDeck(false);
    }
  };

  // --- 3. CRIAR CARTÕES (Nova Funcionalidade!) ---
  const openAddCardSheet = (deckId: number) => {
    setTargetDeckId(deckId);
    setNewCardFront("");
    setNewCardBack("");
    setIsCardSheetOpen(true);
  }

  const handleAddCard = async () => {
    if (!newCardFront.trim() || !newCardBack.trim() || !targetDeckId) return;
    setIsCreatingCard(true);
    let token = localStorage.getItem('token')?.replace(/"/g, '');

    try {
      // Bate na rota POST /api/decks/{id}/cards
      const response = await fetch(`http://localhost:5024/api/decks/${targetDeckId}/cards`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            frontText: newCardFront, 
            backText: newCardBack 
        })
      });

      if (response.ok) {
        setIsCardSheetOpen(false);
        fetchDecks(); // Recarrega para atualizar a contagem de cartas
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
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 mb-10">
          <div>
            <h1 className="auth-logo-home">Adapty</h1>
            <p className="text-lg text-muted-foreground mt-2">Aprenda no seu ritmo</p>
          </div>
          <AccessibilityPanel settings={settings} onSettingsChange={handleSettingsChange} />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="decks">Meus Decks</TabsTrigger>
            <TabsTrigger value="study" disabled={!selectedDeck} className="gap-2">Estudar</TabsTrigger>
          </TabsList>

          <TabsContent value="decks" className="space-y-6">
            
            {/* BOTÃO NOVO DECK */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Seus Decks</h2>
                <Sheet open={isDeckSheetOpen} onOpenChange={setIsDeckSheetOpen}>
                  <SheetTrigger asChild>
                    <Button className="gap-2 btn-primary">
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
                      <Button onClick={handleCreateDeck} disabled={isCreating} className="w-full btn-primary">
                    {isCreating ? "Salvando..." : "Criar Deck"}
                  </Button>
                    </SheetFooter>
                  </SheetContent>
                </Sheet>
            </div>

            {/* LISTA DE DECKS (Usando a variável 'decks' correta) */}
            <TabsContent value="decks" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {decks.length === 0 ? (
                <div className="col-span-3 text-center py-12 opacity-60 border-2 border-dashed rounded-lg">
                  <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">Nenhum deck encontrado.</p>
                  <p className="text-sm">Crie o primeiro clicando no botão acima!</p>
                </div>
              ) : (
                decks.map((deck) => (
                  <Card key={deck.id} className={`${cardBgClass} flex flex-col hover:shadow-md transition-all group`}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">
                        <BookOpen className="w-5 h-5" />
                        {deck.name}
                      </CardTitle>
                      <CardDescription className="line-clamp-2 min-h-[40px]">{deck.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col justify-end space-y-4">
                      <Button onClick={() => handleStartStudy(deck)} className="w-full btn-primary">
                        Estudar ({deck.cards.length} cartões)
                      </Button>
                    </CardContent>
                    <CardFooter className="pt-0 gap-3 border-t border-muted/20 p-4 bg-muted/5">
                      
                      {/* BOTÃO ADICIONAR CARTÕES */}
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => openAddCardSheet(deck.id)}
                        title="Adicionar carta neste deck"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              )}
            </div>
            </TabsContent>
            
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
        {/* SHEET DE ADICIONAR CARTA (Global para todos os decks) */}
        <Sheet open={isCardSheetOpen} onOpenChange={setIsCardSheetOpen}>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Adicionar Novo Cartão</SheetTitle>
              <SheetDescription>Crie uma pergunta e resposta.</SheetDescription>
            </SheetHeader>
            <div className="py-6 space-y-6">
                <div className="space-y-2">
                    <Label className="text-primary font-semibold flex items-center gap-2">
                        <FileText className="w-4 h-4"/> Frente (Pergunta)
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
                        <Layers className="w-4 h-4"/> Verso (Resposta)
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
              <Button onClick={handleAddCard} disabled={isCreatingCard} className="w-full btn-primary">
                {isCreatingCard ? "Salvando..." : "Adicionar Carta"}
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}