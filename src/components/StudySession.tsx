import { useState } from 'react';
import { FlipCard } from './FlipCard';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { ChevronLeft, ChevronRight, Check, X, RotateCcw, Shuffle } from 'lucide-react';
import { Badge } from './ui/badge';

interface Card {
  id: number;
  front: string;
  back: string;
  known?: boolean;
}

interface StudySessionProps {
  cards: Card[];
  deckName: string;
  fontSize: number;
  fontFamily: string;
  darkMode: boolean;
  highContrast: boolean;
  reducedMotion: boolean;
  animationSpeed: number;
  cardColor: string;
  textColor: string;
  onComplete: () => void;
}

export function StudySession({
  cards: initialCards,
  deckName,
  fontSize,
  fontFamily,
  darkMode,
  highContrast,
  reducedMotion,
  animationSpeed,
  cardColor,
  textColor,
  onComplete,
}: StudySessionProps) {
  const [cards, setCards] = useState(initialCards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  /*
  const [knownCards, setKnownCards] = useState<number[]>([]);
  const [reviewCards, setReviewCards] = useState<number[]>([]);
  */
  const [sessionStats, setSessionStats] = useState({ known: 0, review: 0 });

  const currentCard = cards[currentIndex];

  // NOVA FUNÇÃO: Envia a nota para o Backend calcular o SM-2

  const sendReview = async (quality: number) => {
    // 1. Atualiza o contador visual (Feedback imediato para o usuário)
    if (quality >= 3) { // 3, 4, 5 = Acertou/Fácil
        setSessionStats(prev => ({ ...prev, known: prev.known + 1 }));
    } else { // 1, 2 = Errou/Difícil
        setSessionStats(prev => ({ ...prev, review: prev.review + 1 }));
    }
    const token = localStorage.getItem('token');
    try {
      await fetch(`http://localhost:5024/api/study/card/${currentCard.id}/review`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ quality, timeTakenSeconds: 10 }) // Pode implementar um timer depois
      });
      
      // Só avança depois de salvar no banco
      handleNext(); 
    } catch (error) {
      console.error("Erro ao salvar revisão", error);
    }
  };

  // ATUALIZAÇÃO: Botão "Já Sei" (Nota 5 - Fácil)
  const handleMarkKnown = () => {
    sendReview(5); 
  };

  // ATUALIZAÇÃO: Botão "Revisar" (Nota 2 - Difícil)
  const handleMarkReview = () => {
    sendReview(2);
  };

  // MANTENHA: A lógica visual de handleFlip, handleNext (apenas para navegação visual)
  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    } else {
      onComplete(); // Volta para a Home
    }
  };

  // ... O resto do JSX (HTML) permanece IGUAL, usando os componentes de UI
  // <Button onClick={handleMarkKnown}>
  const progress = ((currentIndex + 1) / cards.length) * 100;

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };
  /*const handleMarkKnown = () => {
    if (!knownCards.includes(currentCard.id)) {
      setKnownCards([...knownCards, currentCard.id]);
    }
    const filtered = reviewCards.filter((id) => id !== currentCard.id);
    setReviewCards(filtered);
    handleNext();
  };

  const handleMarkReview = () => {
    if (!reviewCards.includes(currentCard.id)) {
      setReviewCards([...reviewCards, currentCard.id]);
    }
    const filtered = knownCards.filter((id) => id !== currentCard.id);
    setKnownCards(filtered);
    handleNext();
  };*/

  const handleShuffle = () => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    //setKnownCards([]);
    //setReviewCards([]);
  };

  const backgroundColor = highContrast
    ? darkMode
      ? '#000000'
      : '#FFFFFF'
    : cardColor;

  const textColorFinal = highContrast
    ? darkMode
      ? '#FFFFFF'
      : '#000000'
    : textColor;

  const speed = reducedMotion ? 0 : animationSpeed;

  return (
    <div className="space-y-6">
      {/* Header with deck name and stats */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl">{deckName}</h2>
          <p className="text-muted-foreground">
            Cartão {currentIndex + 1} de {cards.length}
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Badge variant="secondary" className="gap-1">
            <Check className="w-3 h-3" />
            Conhece: {sessionStats.known}
          </Badge>
          <Badge variant="secondary" className="gap-1">
            <X className="w-3 h-3" />
            Revisar: {sessionStats.review}
          </Badge>
        </div>
      </div>

      {/* Progress bar */}
      <div className="space-y-2">
          <div className="h-3 rounded-full bg-gray-300"> 
        <Progress 
        value={progress}
         className="progress-gradient-fill h-full rounded-full"
        /> </div>
        <p className="text-sm text-center text-muted-foreground">
          {Math.round(progress)}% concluído
        </p>
      </div>

      {/* Flip card */}
      <FlipCard
        front={currentCard.front}
        back={currentCard.back}
        isFlipped={isFlipped}
        onFlip={handleFlip}
        fontSize={fontSize}
        fontFamily={fontFamily}
        backgroundColor={backgroundColor}
        textColor={textColorFinal}
        animationSpeed={speed}
      />

      {/* Instructions */}
      <div className="text-center text-sm text-muted-foreground space-y-1">
        <p>Clique no cartão ou pressione ESPAÇO para virar</p>
        <p>Use as setas ← → para navegar entre cartões</p>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="gap-2"
          onKeyDown={(e: { key: string; }) => {
            if (e.key === 'ArrowLeft') {
              handlePrevious();
            }
          }}
        >
          <ChevronLeft className="w-4 h-4" />
          Anterior
        </Button>

        <Button
          variant="outline"
          onClick={handleNext}
          disabled={currentIndex === cards.length - 1}
          className="gap-2"
          onKeyDown={(e: { key: string; }) => {
            if (e.key === 'ArrowRight') {
              handleNext();
            }
          }}
        >
          Próximo
          <ChevronRight className="w-4 h-4" />
        </Button>

        <Button
          variant="default"
          onClick={handleMarkKnown}
          className="gap-2 bg-green-600 hover:bg-green-700"
        >
          <Check className="w-4 h-4" />
          Já Sei
        </Button>

        <Button
          variant="default"
          onClick={handleMarkReview}
          className="gap-2 bg-orange-600 hover:bg-orange-700"
        >
          <X className="w-4 h-4" />
          Revisar
        </Button>
      </div>

      {/* Additional controls */}
      <div className="flex gap-3 justify-center flex-wrap">
        <Button variant="outline" onClick={handleShuffle} className="gap-2">
          <Shuffle className="w-4 h-4" />
          Embaralhar
        </Button>
        <Button variant="outline" onClick={handleReset} className="gap-2">
          <RotateCcw className="w-4 h-4" />
          Reiniciar
        </Button>
      </div>
    </div>
  );
}
