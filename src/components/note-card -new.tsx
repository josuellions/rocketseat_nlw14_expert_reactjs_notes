import * as Dialog from "@radix-ui/react-dialog";

import { toast } from "sonner";

import { X } from "lucide-react";
import { ChangeEvent, FormEvent, useState } from "react";

interface NewNoteCardProps {
  onNoteCreated: (content: string) => void;
}

let speechRecognition: SpeechRecognition | null = null;

export function NoteCardNew({ onNoteCreated }: NewNoteCardProps) {
  const [content, setContent] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [shouldShowOnboarding, SetShouldShowOnboarding] = useState(true);

  function handleStartEditor() {
    SetShouldShowOnboarding(false);
  }

  function hangleContentChanged(event: ChangeEvent<HTMLTextAreaElement>) {
    setContent(event.target.value);

    if (event.target.value === "") {
      SetShouldShowOnboarding(true);
    }
  }

  function handleSaveNote(event: FormEvent) {
    event.preventDefault();

    if (content === "") {
      toast.warning("Nota deve conter texto!");
      return;
    }
    //console.log(content);
    onNoteCreated(content);

    setContent("");
    SetShouldShowOnboarding(true);

    toast.success("Nota criada com sucesso!");
  }

  function handlerStartRecording() {
    const isSpeechRecognitionAPIAvaliable =
      "SpeechRecognition" in window || "webkitSpeechRecognition" in window;

    if (!isSpeechRecognitionAPIAvaliable) {
      //alert("Infelizmente seu navegador não suporta a API de gravação!");

      toast.info("Seu navegador não suporta a API de gravação!");

      setTimeout(() => {
        toast.info("Utilizar a opção de escrever texto!");
      }, 1800);

      setIsRecording(false);

      return;
    }

    setIsRecording(true);
    SetShouldShowOnboarding(false);

    const speechRecognitionAPI =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    speechRecognition = new speechRecognitionAPI();

    speechRecognition.lang = "pt-BR";
    speechRecognition.continuous = true; //continua gravando até apertar botão parar
    speechRecognition.maxAlternatives = 1; //temperatura de sugestão palavras (retorna 1)
    speechRecognition.interimResults = true; //retorna em tempo de execução
    speechRecognition.onresult = (event) => {
      //console.log(event.results);
      const transcription = Array.from(event.results).reduce((text, result) => {
        return text.concat(result[0].transcript); //retorna toda palavra da gravação em texto
      }, "");

      setContent(transcription);
    };

    speechRecognition.onerror = (event) => {
      console.error(event);
    };

    speechRecognition.start();
  }

  function handlerStopRecording() {
    setIsRecording(false);

    if (speechRecognition !== null) {
      speechRecognition.stop();
    }
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger className="rounded-md flex flex-col  bg-slate-700 text-left p-5 gap-3 hover:ring-2 hover:ring-slate-600 focus-visible:right-2 focus-visible:ring-lime-400 outline-none">
        <span className="text-sm font-medium text-slate-200">
          Adicione nota
        </span>
        <p className="text-sm leading-6 text-slate-400">
          Grave uma nota em áudio que será convertida para texto automaticamente
        </p>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="inset-0 fixed bg-black/50" />
        <Dialog.Content className="fixed overflow-hidden inset-0 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[640px] md:h-[60vh] w-full bg-slate-700 md:rounded-md flex flex-col outline-none">
          <Dialog.Close className="absolute right-0 top-0 bg-slate-800 text-slate-400 p-1.5 rounded-sm hover:text-slate-100">
            <X className="size-5" />
          </Dialog.Close>
          <form className="flex-1 flex flex-col">
            <div className="flex flex-1 flex-col gap-3 p-5">
              <span className="text-sm font-medium text-slate-300">
                Adicione nota
              </span>
              {shouldShowOnboarding ? (
                <p className="text-sm leading-6 text-slate-400">
                  Comece{" "}
                  <button
                    type="button"
                    className="text-lime-400 hover:text-lime-600 hover:underline"
                    onClick={handlerStartRecording}
                  >
                    gravando uma nota{" "}
                  </button>{" "}
                  em áudio ou se preferir{" "}
                  <button
                    type="button"
                    className="text-lime-400 hover:text-lime-600 hover:underline"
                    onClick={() => handleStartEditor()}
                  >
                    utilize apenas texto.
                  </button>
                </p>
              ) : (
                <textarea
                  className="text-sm leading-6 text-slate-400 bg-transparent resize-none flex-1 outline-none"
                  placeholder="Digite seu texto"
                  onChange={hangleContentChanged}
                  value={content}
                  autoFocus
                />
              )}
            </div>
            {isRecording ? (
              <button
                type="button"
                onClick={handlerStopRecording}
                className="w-full flex items-center justify-center gap-2 bg-slate-900 py-4 text-center text-sm text-slate-300 outline-none font-medium hover:bg-slate-100"
              >
                <div className="size-3 rounded-full bg-red-500 animate-pulse" />
                Gravando! (clique p/ interromper)
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSaveNote}
                className="w-full bg-lime-400 py-4 text-center text-sm text-lime-950 outline-none font-medium hover:bg-lime-500"
              >
                Salvar nota
              </button>
            )}
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
