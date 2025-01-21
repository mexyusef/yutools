import { useState } from 'react';
import { X, TestTube2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

type LLMSettingsProps = {
  open: boolean;
  onClose: () => void;
};

// Rest of the file remains exactly the same
const providers = [
  { id: 'openai', name: 'OpenAI', models: ['gpt-3.5-turbo', 'gpt-4', 'gpt-4-turbo'] },
  { id: 'anthropic', name: 'Anthropic', models: ['claude-2', 'claude-instant'] },
  { id: 'google', name: 'Google', models: ['gemini-pro', 'gemini-pro-vision'] },
  { id: 'huggingface', name: 'Hugging Face', models: ['mistral-7b', 'llama-2'] },
];

const promptTemplates = [
  { id: 'default', name: 'Default', content: 'You are a helpful assistant.' },
  { id: 'professional', name: 'Professional', content: 'You are a professional business consultant.' },
  { id: 'creative', name: 'Creative', content: 'You are a creative writing assistant.' },
  { id: 'custom', name: 'Custom', content: '' },
];

export default function LLMSettings({ open, onClose }: LLMSettingsProps) {
  const { toast } = useToast();
  const [provider, setProvider] = useState('openai');
  const [model, setModel] = useState('gpt-3.5-turbo');
  const [apiKey, setApiKey] = useState('');
  const [baseUrl, setBaseUrl] = useState('');
  const [temperature, setTemperature] = useState([0.7]);
  const [maxTokens, setMaxTokens] = useState([2048]);
  const [promptTemplate, setPromptTemplate] = useState('default');
  const [customPrompt, setCustomPrompt] = useState('');
  const [responseFormat, setResponseFormat] = useState('text');

  const handleTestConnection = () => {
    // Simulate API test
    toast({
      title: 'Testing Connection',
      description: 'API connection successful!',
    });
  };

  return (
    <div
      className={cn(
        'absolute inset-x-0 top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b transform transition-all duration-200 ease-in-out z-10',
        {
          'translate-y-0 opacity-100': open,
          '-translate-y-full opacity-0 pointer-events-none': !open,
        }
      )}
    >
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">LLM Settings</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <Tabs defaultValue="provider" className="w-full">
        <TabsList className="w-full justify-start px-4 pt-4">
          <TabsTrigger value="provider">Provider & Model</TabsTrigger>
          <TabsTrigger value="api">API Settings</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="usage">Usage</TabsTrigger>
        </TabsList>

        <TabsContent value="provider" className="p-4 space-y-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label>LLM Provider</Label>
              <Select value={provider} onValueChange={setProvider}>
                <SelectTrigger>
                  <SelectValue placeholder="Select provider" />
                </SelectTrigger>
                <SelectContent>
                  {providers.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Model</Label>
              <Select value={model} onValueChange={setModel}>
                <SelectTrigger>
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  {providers
                    .find((p) => p.id === provider)
                    ?.models.map((m) => (
                      <SelectItem key={m} value={m}>
                        {m}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="api" className="p-4 space-y-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label>API Key</Label>
              <Input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your API key"
              />
            </div>

            <div className="space-y-2">
              <Label>API Base URL (Optional)</Label>
              <Input
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
                placeholder="https://api.example.com"
              />
            </div>

            <Button onClick={handleTestConnection} className="w-full">
              <TestTube2 className="w-4 h-4 mr-2" />
              Test Connection
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="advanced" className="p-4 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Temperature</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <AlertCircle className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Controls randomness in responses. Higher values make the output more creative.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Slider
                value={temperature}
                onValueChange={setTemperature}
                max={1}
                step={0.1}
                className="w-full"
              />
              <p className="text-sm text-muted-foreground text-right">{temperature}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Max Tokens</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <AlertCircle className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Maximum length of the response in tokens.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Slider
                value={maxTokens}
                onValueChange={setMaxTokens}
                max={4096}
                step={64}
                className="w-full"
              />
              <p className="text-sm text-muted-foreground text-right">{maxTokens}</p>
            </div>

            <div className="space-y-2">
              <Label>Response Format</Label>
              <Select value={responseFormat} onValueChange={setResponseFormat}>
                <SelectTrigger>
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Plain Text</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                  <SelectItem value="markdown">Markdown</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="templates" className="p-4 space-y-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label>Prompt Template</Label>
              <Select value={promptTemplate} onValueChange={setPromptTemplate}>
                <SelectTrigger>
                  <SelectValue placeholder="Select template" />
                </SelectTrigger>
                <SelectContent>
                  {promptTemplates.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {promptTemplate === 'custom' && (
              <div className="space-y-2">
                <Label>Custom Prompt</Label>
                <Input
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="Enter your custom prompt template"
                />
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="usage" className="p-4">
          <div className="space-y-4">
            <div className="rounded-lg border bg-card p-4">
              <h3 className="font-medium mb-2">Current Session</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Tokens Used</p>
                  <p className="text-2xl font-bold">1,234</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Estimated Cost</p>
                  <p className="text-2xl font-bold">$0.02</p>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-medium mb-2">Usage Limits</h3>
              <div className="space-y-2">
                <Label>Max Monthly Tokens</Label>
                <Input type="number" placeholder="Enter token limit" />
                <p className="text-sm text-muted-foreground">
                  You'll be notified when reaching 80% of this limit
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}