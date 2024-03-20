import { ChangeEvent, useEffect, useState } from "react";
import logo from "../src/assets/logo-nlw-expert.svg";
import { NoteCard } from "./components/note-card";
import { NoteCardNew } from "./components/note-card -new";

interface NoteProps {
  id: string;
  date: Date;
  content: string;
}

export function App() {
  const nameLocalStorage = "notes-nlw14";
  const [search, setSearch] = useState("");
  const [filteredNotes, setFilteredNotes] = useState<NoteProps[]>(
    [] as NoteProps[]
  );
  const [notes, setNotes] = useState<NoteProps[]>([] as NoteProps[]);

  function onNoteCreated(content: string) {
    const newNote: NoteProps = {
      id: crypto.randomUUID(),
      date: new Date(),
      content,
    };
    const notesArray = [newNote, ...notes];

    setNotes(notesArray);

    localStorage.setItem(nameLocalStorage, JSON.stringify(notesArray));
  }

  function onNoteDeleted(id: string) {
    const notesArray = notes.filter((note) => {
      return note.id !== id;
    });

    setNotes(notesArray);
    localStorage.setItem(nameLocalStorage, JSON.stringify(notesArray));
  }

  function handleSearch(event: ChangeEvent<HTMLInputElement>) {
    const query = event.target.value;

    setSearch(query);
  }

  useEffect(() => {
    const getNotes = localStorage.getItem(nameLocalStorage);

    if (getNotes) {
      setNotes(JSON.parse(getNotes));
    }
  }, []);

  useEffect(() => {
    async function carregaNotes() {
      const filteredNotesSearch =
        (await search) !== ""
          ? notes.filter((note) =>
              note.content
                .toLocaleLowerCase()
                .includes(search.toLocaleLowerCase())
            )
          : notes;

      setFilteredNotes(filteredNotesSearch);
    }
    carregaNotes();
  }, [search, notes]);

  return (
    <div className="mx-auto max-w-6xl my-12 space-y-6 px-5 ">
      <img src={logo} title="Logo NLW Expert" alt="NLW Expert" />
      <form action="" className="w-full">
        <input
          type="text"
          onChange={handleSearch}
          placeholder="Busque e suas notas"
          className="w-full bg-transparent text-3xl font-semibold tracking-tight outline-none placeholder:text-slate-500"
        />
      </form>
      <div className="h-px bg-slate-700" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[250px]">
        <NoteCardNew onNoteCreated={onNoteCreated} />

        {filteredNotes.map((note: NoteProps) => (
          <NoteCard key={note.id} note={note} onNoteDeleted={onNoteDeleted} />
        ))}
      </div>
    </div>
  );
}
