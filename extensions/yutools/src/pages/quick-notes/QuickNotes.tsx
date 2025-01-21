import { useEffect, useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { markdown } from '@codemirror/lang-markdown';
import { oneDark } from '@codemirror/theme-one-dark';
import { marked } from 'marked';
import { PenLine, Eye, PanelLeftClose, PanelLeft, ArrowLeftToLine, ArrowRightToLine } from 'lucide-react';

import { ResizablePanelGroup } from '@/components/ui/resizable';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { predefinedThemes, type Theme } from '@/lib/themes';
import { defaultEditorSettings, type EditorSettings } from '@/lib/editor';
import { type Note } from './types';
import { Sidebar } from './sidebar';

function QuickNotes() {
  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem('notes');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [currentNoteId, setCurrentNoteId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [sidebarPosition, setSidebarPosition] = useState<'left' | 'right'>('right');
  
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme');
    return saved ? JSON.parse(saved) : predefinedThemes[0];
  });

  const [editorSettings, setEditorSettings] = useState<EditorSettings>(() => {
    const saved = localStorage.getItem('editorSettings');
    return saved ? JSON.parse(saved) : defaultEditorSettings;
  });

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('theme', JSON.stringify(theme));
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('editorSettings', JSON.stringify(editorSettings));
  }, [editorSettings]);

  const currentNote = notes.find((note) => note.id === currentNoteId);

  const createNewNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'Untitled Note',
      content: '# Untitled Note\n\nStart writing here...',
      lastModified: Date.now(),
    };
    setNotes([newNote, ...notes]);
    setCurrentNoteId(newNote.id);
  };

  const updateNote = (value: string) => {
    if (!currentNoteId) return;
    
    setNotes(notes.map((note) =>
      note.id === currentNoteId
        ? {
            ...note,
            content: value,
            lastModified: Date.now(),
            title: value.split('\n')[0].replace(/^#\s+/, ''),
          }
        : note
    ));
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter((note) => note.id !== id));
    if (currentNoteId === id) {
      setCurrentNoteId(notes[0]?.id || null);
    }
  };

  const getEditorTheme = () => {
    switch (editorSettings.theme) {
      case 'dark':
        return oneDark;
      case 'light':
        return [];
      case 'high-contrast':
        return oneDark;
      default:
        return oneDark;
    }
  };

  const toggleSidebarPosition = () => {
    setSidebarPosition(sidebarPosition === 'left' ? 'right' : 'left');
  };

  const renderEditor = () => (
    <div className="h-full flex flex-col">
      <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'edit' | 'preview')} className="flex-1 flex flex-col">
        <div className={cn("border-b px-4 py-2", theme.borderColor)}>
          <TabsList className={cn("backdrop-blur-sm flex items-center gap-2", theme.bgColor)}>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-blue-100 hover:text-blue-50 hover:bg-blue-800/50"
            >
              {isSidebarOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeft className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebarPosition}
              className="text-blue-100 hover:text-blue-50 hover:bg-blue-800/50"
            >
              {sidebarPosition === 'left' ? <ArrowRightToLine className="h-4 w-4" /> : <ArrowLeftToLine className="h-4 w-4" />}
            </Button>
            <TabsTrigger value="edit" className="data-[state=active]:bg-white/10">
              <PenLine className="h-4 w-4 mr-2" /> Edit
            </TabsTrigger>
            <TabsTrigger value="preview" className="data-[state=active]:bg-white/10">
              <Eye className="h-4 w-4 mr-2" /> Preview
            </TabsTrigger>
            <div className="flex-1" />
            <ThemeSwitcher
              currentTheme={theme}
              onThemeChange={setTheme}
              editorSettings={editorSettings}
              onEditorSettingsChange={setEditorSettings}
            />
          </TabsList>
        </div>

        <TabsContent value="edit" className="flex-1 p-0 m-0">
          {currentNote ? (
            <div className="h-full">
              <CodeMirror
                value={currentNote.content}
                height="90vh"
                extensions={[markdown()]}
                onChange={updateNote}
                theme={getEditorTheme()}
                style={{ fontSize: `${editorSettings.fontSize}px` }}
                basicSetup={{
                  lineNumbers: editorSettings.lineNumbers,
                  tabSize: editorSettings.tabSize,
                  // lineWrap: editorSettings.lineWrapping,
                }}
              />
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-blue-400">
              Select a note or create a new one
            </div>
          )}
        </TabsContent>

        <TabsContent value="preview" className="flex-1 p-0 m-0">
          <ScrollArea className="h-full">
            <div className="prose prose-invert max-w-none p-8">
              {currentNote ? (
                <div
                  dangerouslySetInnerHTML={{
                    __html: marked(currentNote.content),
                  }}
                />
              ) : (
                <div className="h-full flex items-center justify-center text-blue-400">
                  Select a note to preview
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );

  return (
    <div className={cn("h-screen bg-gradient-to-br", theme.from, theme.via, theme.to)}>
      <div className="container mx-auto h-full py-6">
        <div className={cn("h-full rounded-xl border backdrop-blur-sm shadow-2xl", theme.borderColor, theme.bgColor)}>
          <ResizablePanelGroup direction="horizontal" className="h-full rounded-xl">
            {isSidebarOpen ? (
              <Sidebar
                notes={notes}
                currentNoteId={currentNoteId}
                theme={theme}
                position={sidebarPosition}
                onNoteCreate={createNewNote}
                onNoteSelect={setCurrentNoteId}
                onNoteDelete={deleteNote}
              >
                {renderEditor()}
              </Sidebar>
            ) : (
              renderEditor()
            )}
          </ResizablePanelGroup>
        </div>
      </div>
    </div>
  );
}

export default QuickNotes;