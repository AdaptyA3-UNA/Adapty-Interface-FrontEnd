import { Settings, Type, Palette, Zap, Moon, Sun } from 'lucide-react';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';

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

interface AccessibilityPanelProps {
  settings: AccessibilitySettings;
  onSettingsChange: (settings: Partial<AccessibilitySettings>) => void;
}

const fontOptions = [
  { value: 'system-ui', label: 'Padrão' },
  { value: 'OpenDyslexic, system-ui', label: 'OpenDyslexic (Dislexia)' },
  { value: 'Comic Sans MS, cursive', label: 'Comic Sans (Legível)' },
  { value: 'Arial, sans-serif', label: 'Arial' },
  { value: 'Georgia, serif', label: 'Georgia (Serif)' },
];

const colorPresets = [
  { name: 'Azul Claro', bg: '#e3f2fd', text: '#0d47a1' },
  { name: 'Verde Suave', bg: '#e8f5e9', text: '#1b5e20' },
  { name: 'Amarelo Pastel', bg: '#fffde7', text: '#f57f17' },
  { name: 'Rosa Claro', bg: '#fce4ec', text: '#880e4f' },
  { name: 'Roxo Suave', bg: '#f3e5f5', text: '#4a148c' },
  { name: 'Laranja Claro', bg: '#fff3e0', text: '#e65100' },
];

export function AccessibilityPanel({ settings, onSettingsChange }: AccessibilityPanelProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="lg" className="gap-2">
          <Settings className="w-5 h-5" />
          Personalizar
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Configurações de Acessibilidade</SheetTitle>
          <SheetDescription>
            Personalize sua experiência de estudo para melhor aprendizado
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 py-6">
          {/* Dark Mode */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {settings.darkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                <Label>Modo Escuro</Label>
              </div>
              <Switch
                checked={settings.darkMode}
                onCheckedChange={(checked) => onSettingsChange({ darkMode: checked })}
              />
            </div>
          </div>

          <Separator />

          {/* Font Size */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Type className="w-4 h-4" />
              <Label>Tamanho da Fonte: {settings.fontSize}px</Label>
            </div>
            <Slider
              value={[settings.fontSize]}
              onValueChange={(value) => onSettingsChange({ fontSize: value[0] })}
              min={16}
              max={48}
              step={2}
              aria-label="Tamanho da fonte"
            />
            <p className="text-sm text-muted-foreground">
              Ajuste o tamanho do texto nos cartões
            </p>
          </div>

          <Separator />

          {/* Font Family */}
          <div className="space-y-3">
            <Label>Tipo de Fonte</Label>
            <Select
              value={settings.fontFamily}
              onValueChange={(value) => onSettingsChange({ fontFamily: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {fontOptions.map((font) => (
                  <SelectItem key={font.value} value={font.value}>
                    {font.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              Fontes especiais podem ajudar com dislexia
            </p>
          </div>

          <Separator />

          {/* Color Presets */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              <Label>Cores dos Cartões</Label>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {colorPresets.map((preset) => (
                <Button
                  key={preset.name}
                  variant="outline"
                  className="h-auto py-3 flex flex-col gap-1"
                  onClick={() => onSettingsChange({ cardColor: preset.bg, textColor: preset.text })}
                >
                  <div
                    className="w-full h-8 rounded border-2"
                    style={{ backgroundColor: preset.bg, borderColor: preset.text }}
                  />
                  <span className="text-xs">{preset.name}</span>
                </Button>
              ))}
            </div>
          </div>

          <Separator />

          {/* High Contrast */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Alto Contraste</Label>
              <Switch
                checked={settings.highContrast}
                onCheckedChange={(checked) => onSettingsChange({ highContrast: checked })}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Aumenta o contraste para melhor legibilidade
            </p>
          </div>

          <Separator />

          {/* Reduced Motion */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                <Label>Reduzir Animações</Label>
              </div>
              <Switch
                checked={settings.reducedMotion}
                onCheckedChange={(checked) => onSettingsChange({ reducedMotion: checked })}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Desativa ou reduz animações que podem distrair
            </p>
          </div>

          {!settings.reducedMotion && (
            <div className="space-y-3">
              <Label>Velocidade da Animação</Label>
              <Slider
                value={[settings.animationSpeed]}
                onValueChange={(value) => onSettingsChange({ animationSpeed: value[0] })}
                min={0.1}
                max={1.0}
                step={0.1}
                aria-label="Velocidade da animação"
              />
              <p className="text-sm text-muted-foreground">
                {settings.animationSpeed < 0.3 ? 'Muito rápida' : settings.animationSpeed < 0.6 ? 'Rápida' : 'Normal'}
              </p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
