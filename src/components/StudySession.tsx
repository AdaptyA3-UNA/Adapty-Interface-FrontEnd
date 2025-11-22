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
  const [knownCards, setKnownCards] = useState<number[]>([]);
  const [reviewCards, setReviewCards] = useState<number[]>([]);

  const currentCard = cards[currentIndex];
  const progress = ((currentIndex + 1) / cards.length) * 100;

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleMarkKnown = () => {
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
  };

  const handleShuffle = () => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setKnownCards([]);
    setReviewCards([]);
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
            Conhece: {knownCards.length}
          </Badge>
          <Badge variant="secondary" className="gap-1">
            <X className="w-3 h-3" />
            Revisar: {reviewCards.length}
          </Badge>
        </div>
      </div>

      {/* Progress bar */}
      <div className="space-y-2">
        <Progress value={progress} className="h-3" />
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
          onKeyDown={(e) => {
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
          onKeyDown={(e) => {
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
