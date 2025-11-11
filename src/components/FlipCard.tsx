import { useState } from 'react';
import { motion } from 'motion/react';

interface FlipCardProps {
  front: string;
  back: string;
  isFlipped: boolean;
  onFlip: () => void;
  fontSize: number;
  fontFamily: string;
  backgroundColor: string;
  textColor: string;
  animationSpeed: number;
}

export function FlipCard({
  front,
  back,
  isFlipped,
  onFlip,
  fontSize,
  fontFamily,
  backgroundColor,
  textColor,
  animationSpeed,
}: FlipCardProps) {
  return (
    <div className="perspective-1000 w-full max-w-2xl mx-auto">
      <motion.div
        className="relative w-full h-96 cursor-pointer"
        onClick={onFlip}
        onKeyDown={(e) => {
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            onFlip();
          }
        }}
        tabIndex={0}
        role="button"
        aria-label={isFlipped ? `Verso: ${back}. Pressione espaço para virar` : `Frente: ${front}. Pressione espaço para virar`}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: animationSpeed, ease: 'easeInOut' }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 rounded-2xl shadow-2xl flex items-center justify-center p-8 backface-hidden border-4"
          style={{
            backgroundColor,
            color: textColor,
            fontFamily,
            fontSize: `${fontSize}px`,
            backfaceVisibility: 'hidden',
            borderColor: textColor + '40',
          }}
        >
          <div className="text-center max-w-full break-words">
            <div className="mb-4 opacity-60">Pergunta</div>
            <div>{front}</div>
          </div>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 rounded-2xl shadow-2xl flex items-center justify-center p-8 backface-hidden border-4"
          style={{
            backgroundColor,
            color: textColor,
            fontFamily,
            fontSize: `${fontSize}px`,
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            borderColor: textColor + '40',
          }}
        >
          <div className="text-center max-w-full break-words">
            <div className="mb-4 opacity-60">Resposta</div>
            <div>{back}</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
