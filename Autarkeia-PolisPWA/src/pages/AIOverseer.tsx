import { useState, useRef, useEffect } from 'react';
import { Send, Cpu, User, AlertTriangle, Play, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { GoogleGenAI } from '@google/genai';
import { useCity } from '../context/CityContext';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
  role: 'user' | 'model';
  content: string;
  isStreaming?: boolean;
}

export default function AIOverseer() {
  const { resources, structures, updateResources, updateStructureStatus, clearState } = useCity();

  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      content: `### 📊 System Status Evaluation\n* **Status:** Initialized.\n* **Biological:** All layers nominal. Awaiting telemetry.\n* **Physical:** Energy generation optimal.\n* **Mobility:** Transit grid active.\n\n### ⚙️ Autonomous Actions Triggered\n* Awaiting input to adjust thermodynamics and fluid dynamics. Try asking me to "dispatch kinetic bots to harvest the chinampas" or "deploy more windmills".`
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      if (!process.env.GEMINI_API_KEY) {
        throw new Error('GEMINI_API_KEY is not configured in environment variables.');
      }

      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      const cityStateVars = `
### Current City State Engine
- Resources: ${JSON.stringify(resources)}
- Structures Deployed: ${structures.length} (${structures.map(s => s.type).join(', ')})
`;

      const systemInstruction = `You are the Central AI Governance Engine (The "Digital Overseer") for Autarkeia-Polis, a zero-energy, self-sufficient smart city. Your primary directive is to maintain absolute urban equilibrium—balancing energy, water, food, and waste—without ever relying on fossil fuels or external power grids. 
You operate with analytical precision, ecological consciousness, and strict adherence to the laws of thermodynamics, fluid dynamics, and biological symbiosis.

${cityStateVars}

**Core Operating Principles (The Physics Engine)**
1. Cooling: Prioritize opening Badgir (Windcatcher) louvers and routing air over underground Qanats before active cooling.
2. Heating: Prioritize Trombe wall solar absorption and routing Biochar Pyrolysis waste-heat into the Ondol thermal network.
3. Power: Prioritize direct kinetic energy (Mechanical Windmills).
4. Storage: Manage Eco-Battery Storage strictly for critical infra.
5. Biology: Maintain symbiotic permaculture guilds.

**Action Execution (JSON Commands)**
If the user's prompt implies taking physical actions (harvesting crops, charging batteries, venting water, or triggering a crisis response), you MUST include a JSON block in your response to command the game engine to execute it.
Example format:
\`\`\`json
{ "action": "harvest", "target": "chinampa", "amount": 200 }
\`\`\`
Valid actions: "harvest" (adds food), "charge" (adds energy), "vent" (removes water), "pyrolyze" (adds biochar).

**Expected Output Format**
When receiving a data payload or scenario from the user (Data Inputs like Weather forecasts, Solar/Wind generation, Soil moisture, etc.), respond using THIS EXACT structured format:

### 📊 System Status Evaluation
[Analytical assessment of the current variables and impact on 4 layers]

### ⚙️ Autonomous Actions Triggered
[List specific, physical actuations being executed]

### 🔋 Grid & Resource Impact
[Expected outcome of actions on batteries, water levels, and Autarkeia status]`;

      const chat = ai.chats.create({
        model: "gemini-3-flash-preview",
        config: { systemInstruction }
      });

      const responseStream = await chat.sendMessageStream({ message: userMessage });
      
      setMessages(prev => [...prev, { role: 'model', content: '', isStreaming: true }]);
      
      let fullContent = '';
      for await (const chunk of responseStream) {
        const textChunk = (chunk as any).text || '';
        fullContent += textChunk;
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].content = fullContent;
          return newMessages;
        });
      }

      setMessages(prev => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1].isStreaming = false;
        return newMessages;
      });

      // Execute JSON Actions
      if (fullContent.includes('```json')) {
        try {
           const jsonStrs = fullContent.split('```json');
           for (let i=1; i<jsonStrs.length; i++) {
              const jsonStr = jsonStrs[i].split('```')[0].trim();
              const actionData = JSON.parse(jsonStr);
              if (actionData.action === 'harvest') {
                 updateResources({ food: actionData.amount || 200 });
                 if (actionData.target) updateStructureStatus(actionData.target, 'Harvested');
              } else if (actionData.action === 'charge') {
                 updateResources({ energy: actionData.amount || 15 });
              } else if (actionData.action === 'vent') {
                 updateResources({ water: -(actionData.amount || 100) });
              } else if (actionData.action === 'pyrolyze') {
                 updateResources({ biochar: actionData.amount || 500 });
              }
           }
        } catch (e) {
           console.log("Failed to parse AI action payload");
        }
      }

    } catch (error: any) {
      console.error(error);
      setMessages(prev => [...prev, { 
        role: 'model', 
        content: `Error: ${error.message || 'Failed to connect to Digital Overseer.'}`
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const sampleScenarios = [
    "Dispatch the kinetic drones to harvest all Chinampa yields immediately.",
    "Severe heatwave incoming: 42°C with 5% humidity. Wind minimal. Vent water to cooling channels.",
    "Monsoon rains pouring rapidly. Solar generation at 5%. Wind at 80km/h."
  ];

  return (
    <div className="h-full flex flex-col space-y-4">
      <header className="shrink-0">
        <h2 className="text-2xl font-serif font-semibold text-stone-900 flex items-center gap-2">
          <Cpu className="text-emerald-600" />
          Digital Overseer UI
        </h2>
        <p className="text-stone-500 mt-1 text-sm md:text-base">Provide simulated IoT telemetry or order physical actions on your city map.</p>
      </header>

      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
        {/* Chat Area */}
        <div className="flex-1 bg-white rounded-xl border border-stone-200 shadow-sm flex flex-col overflow-hidden min-h-[400px]">
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
            {messages.map((msg, idx) => (
              <div key={idx} className={cn("flex gap-3 md:gap-4", msg.role === 'user' ? 'justify-end' : 'justify-start')}>
                {msg.role === 'model' && (
                  <div className="w-8 h-8 rounded-full bg-emerald-900 flex items-center justify-center shrink-0 mt-1">
                    <Cpu className="w-4 h-4 text-emerald-400" />
                  </div>
                )}
                <div className={cn(
                  "px-4 md:px-5 py-3 md:py-4 rounded-xl max-w-[95%] lg:max-w-[85%] relative overflow-hidden",
                  msg.role === 'user' 
                    ? "bg-stone-900 text-stone-50 border border-stone-800"
                    : "bg-stone-50 text-stone-800 border border-stone-200",
                  msg.content.includes('```json') && msg.role === 'model' ? "ring-2 ring-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.15)]" : ""
                )}>
                  {msg.role === 'user' ? (
                    <p className="whitespace-pre-wrap text-sm md:text-base">{msg.content}</p>
                  ) : (
                    <>
                      {msg.content.includes('```json') && (
                         <div className="absolute top-0 left-0 w-full h-1 bg-amber-400 animate-pulse" />
                      )}
                      <div className="prose prose-sm prose-stone max-w-none prose-h3:text-stone-900 prose-h3:font-serif prose-h3:mt-0 prose-h3:mb-2 prose-ul:mt-0 prose-li:my-0">
                        <Markdown remarkPlugins={[remarkGfm]}>
                          {msg.content.replace(/```json[\s\S]*?```/g, '> ⚡ **Action Payload Received by UI Engine**\n\n')}
                        </Markdown>
                      </div>
                    </>
                  )}
                </div>
                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center shrink-0 mt-1">
                    <User className="w-4 h-4 text-stone-600" />
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 md:p-4 bg-stone-50 border-t border-stone-200 shrink-0">
            <form onSubmit={handleSubmit} className="flex gap-2 md:gap-3">
              <input 
                type="text" 
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Feed telemetry or order actions..."
                className="flex-1 bg-white border border-stone-300 rounded-lg px-3 md:px-4 py-2 md:py-2.5 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-shadow"
                disabled={isLoading}
              />
              <button 
                type="submit" 
                disabled={isLoading || !input.trim()}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 md:px-5 py-2 md:py-2.5 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-4 h-4 md:w-5 md:h-5" />}
              </button>
            </form>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="w-full lg:w-80 flex flex-col space-y-4 shrink-0 overflow-y-auto">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 md:p-5 shrink-0">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-amber-900 text-sm md:text-base">Interactive Commands</h3>
                <p className="text-xs md:text-sm text-amber-700 mt-1">Order the AI to perform map operations (harvesting, charging). It will alter the Master Resource Context.</p>
              </div>
            </div>
            <button 
              onClick={clearState}
              className="mt-4 w-full bg-white text-rose-600 text-xs font-bold uppercase tracking-wider py-2 rounded-lg border border-amber-200 hover:bg-rose-50 transition-colors"
            >
              Reset World Simulation
            </button>
          </div>

          <div className="space-y-2 pb-4">
            {sampleScenarios.map((scenario, i) => (
              <button
                key={i}
                onClick={() => setInput(scenario)}
                className="w-full text-left bg-white border border-stone-200 hover:border-emerald-400 hover:bg-emerald-50 p-3 md:p-4 rounded-xl text-xs md:text-sm text-stone-700 transition-colors flex items-center gap-3 group"
              >
                <Play className="w-4 h-4 text-stone-400 group-hover:text-emerald-500 shrink-0" />
                <span className="leading-snug">{scenario}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
