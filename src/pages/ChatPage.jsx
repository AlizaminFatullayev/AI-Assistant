import { useState, useRef, useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { sendMessage } from '../services/geminiService';

const WELCOME_MESSAGE = {
  id: 1,
  role: 'model',
  content:
    'Salam! Mən Zest & Flame restoranının AI yardımçısıyam. 🍽️\n\nMenyumuzdakı yeməklər, tərkiblər, allergenlər haqqında suallarınızı cavablandıra, sizə uyğun yeməyi tövsiyə edə bilərəm.\n\nNəyi bilmək istəyirsiniz?',
};

export default function ChatPage() {
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg = { id: Date.now(), role: 'user', content: text };
    const history = messages.slice(1); // exclude welcome message from history for Gemini
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const reply = await sendMessage(
        text,
        history.map((m) => ({ role: m.role, content: m.content }))
      );
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: 'model', content: reply },
      ]);
    } catch (err) {
      const isQuota = err.isQuota || err.status === 429;
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: 'model',
          content: isQuota
            ? '⚠️ Gündəlik AI sorğu limiti dolub. Zəhmət olmasa bir neçə dəqiqə sonra yenidən cəhd edin.'
            : 'Üzr istəyirəm, xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Quick suggestion chips
  const suggestions = [
    'Tövsiyə edin',
    'Allergenlər',
    'Ən ucuz yemək',
    'Vegetarian seçim',
  ];

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 flex flex-col min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-accent-dark">
        <div className="flex items-center p-4 justify-between max-w-2xl mx-auto w-full">
          <button
            onClick={() => navigate('/')}
            className="text-slate-900 dark:text-slate-100 flex size-10 items-center justify-center rounded-full hover:bg-primary/10 transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div className="flex flex-col items-center">
            <h1 className="text-lg font-bold leading-tight tracking-tight font-display">
              AI Yardımçı
            </h1>
            <div className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-green-500" />
              <span className="text-[10px] uppercase tracking-widest font-bold text-slate-500 dark:text-slate-400">
                Online
              </span>
            </div>
          </div>
          <div className="w-10" />
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto p-4 space-y-6 max-w-2xl mx-auto w-full pb-44">
        {messages.map((msg) =>
          msg.role === 'model' ? (
            <AIMessage key={msg.id} content={msg.content} />
          ) : (
            <UserMessage key={msg.id} content={msg.content} />
          )
        )}

        {loading && <TypingIndicator />}

        {/* Quick suggestions — only show after welcome message with no user messages */}
        {messages.length === 1 && !loading && (
          <div className="flex flex-wrap gap-2 justify-center mt-4">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => {
                  setInput(s);
                  // Small delay so state updates before sending
                  setTimeout(() => {
                    const text = s.trim();
                    if (!text) return;
                    const userMsg = { id: Date.now(), role: 'user', content: text };
                    setMessages((prev) => [...prev, userMsg]);
                    setInput('');
                    setLoading(true);
                    sendMessage(text, [])
                      .then((reply) => {
                        setMessages((prev) => [
                          ...prev,
                          { id: Date.now() + 1, role: 'model', content: reply },
                        ]);
                      })
                      .catch((err) => {
                        const isQuota = err.isQuota || err.status === 429;
                        setMessages((prev) => [
                          ...prev,
                          { id: Date.now() + 1, role: 'model', content: isQuota ? '⚠️ Gündəlik AI sorğu limiti dolub. Bir neçə dəqiqə sonra yenidən cəhd edin.' : 'Üzr istəyirəm, xəta baş verdi.' },
                        ]);
                      })
                      .finally(() => setLoading(false));
                  }, 0);
                }}
                className="text-sm px-4 py-2 rounded-full border border-primary/30 text-primary hover:bg-primary/10 transition-colors font-medium"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        <div ref={bottomRef} />
      </main>

      {/* Input + Nav bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-background-light dark:bg-background-dark/95 backdrop-blur-lg border-t border-slate-200 dark:border-accent-dark z-20">
        <div className="max-w-2xl mx-auto w-full px-4 pt-3 pb-2">
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-accent-dark rounded-full px-4 py-2 border border-slate-200 dark:border-slate-700">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Mesaj yazın..."
              className="flex-1 bg-transparent border-none focus:ring-0 focus:outline-none text-sm py-2 placeholder-slate-500 dark:placeholder-slate-400 text-slate-900 dark:text-slate-100"
              disabled={loading}
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="bg-primary text-white size-10 rounded-full flex items-center justify-center shadow-lg shadow-primary/30 hover:scale-105 active:scale-95 transition-transform disabled:opacity-50 disabled:scale-100"
            >
              <span className="material-symbols-outlined text-lg">send</span>
            </button>
          </div>
        </div>

        {/* Inline bottom nav */}
        <nav className="max-w-2xl mx-auto w-full px-4 py-2 flex">
          <NavLink to="/" end className={({ isActive }) => `flex flex-1 flex-col items-center gap-1 transition-colors ${isActive ? 'text-primary' : 'text-slate-500 dark:text-slate-400'}`}>
            {({ isActive }) => (<><span className={`material-symbols-outlined ${isActive ? 'active-icon' : ''}`}>home</span><span className="text-[10px] font-medium">Ana Səhifə</span></>)}
          </NavLink>
          <NavLink to="/categories" className={({ isActive }) => `flex flex-1 flex-col items-center gap-1 transition-colors ${isActive ? 'text-primary' : 'text-slate-500 dark:text-slate-400'}`}>
            {({ isActive }) => (<><span className={`material-symbols-outlined ${isActive ? 'active-icon' : ''}`}>grid_view</span><span className="text-[10px] font-medium">Kateqoriya</span></>)}
          </NavLink>
          <NavLink to="/chat" className={({ isActive }) => `flex flex-1 flex-col items-center gap-1 transition-colors ${isActive ? 'text-primary' : 'text-slate-500 dark:text-slate-400'}`}>
            {({ isActive }) => (<><span className={`material-symbols-outlined ${isActive ? 'active-icon' : ''}`}>smart_toy</span><span className="text-[10px] font-medium">AI Söhbət</span></>)}
          </NavLink>
        </nav>
      </div>
    </div>
  );
}

function AIMessage({ content }) {
  return (
    <div className="flex items-start gap-3">
      <div className="bg-primary/20 rounded-full p-2 flex items-center justify-center shrink-0 border border-primary/30">
        <span className="material-symbols-outlined text-primary text-xl">smart_toy</span>
      </div>
      <div className="flex flex-col gap-1.5 items-start">
        <p className="text-slate-500 dark:text-slate-400 text-xs font-medium px-1">AI Yardımçı</p>
        <p className="text-sm md:text-base font-normal leading-relaxed max-w-[85%] rounded-2xl rounded-tl-none px-4 py-3 bg-slate-200 dark:bg-accent-dark text-slate-900 dark:text-slate-100 shadow-sm whitespace-pre-wrap">
          {content}
        </p>
      </div>
    </div>
  );
}

function UserMessage({ content }) {
  return (
    <div className="flex items-start gap-3 justify-end">
      <div className="flex flex-col gap-1.5 items-end w-full">
        <p className="text-slate-500 dark:text-slate-400 text-xs font-medium px-1">Siz</p>
        <div className="relative flex justify-end w-full">
          <p className="text-sm md:text-base font-normal leading-relaxed max-w-[85%] rounded-2xl rounded-tr-none px-4 py-3 bg-primary text-white shadow-lg shadow-primary/20 whitespace-pre-wrap">
            {content}
          </p>
        </div>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-start gap-3">
      <div className="bg-primary/20 rounded-full p-2 flex items-center justify-center shrink-0 border border-primary/30">
        <span className="material-symbols-outlined text-primary text-xl">smart_toy</span>
      </div>
      <div className="flex flex-col gap-1.5 items-start">
        <p className="text-slate-500 dark:text-slate-400 text-xs font-medium px-1">AI Yardımçı</p>
        <div className="rounded-2xl rounded-tl-none px-5 py-4 bg-slate-200 dark:bg-accent-dark shadow-sm">
          <div className="flex gap-1.5 items-center">
            <div className="size-2 rounded-full bg-primary/60 animate-bounce [animation-delay:0ms]" />
            <div className="size-2 rounded-full bg-primary/60 animate-bounce [animation-delay:150ms]" />
            <div className="size-2 rounded-full bg-primary/60 animate-bounce [animation-delay:300ms]" />
          </div>
        </div>
      </div>
    </div>
  );
}
