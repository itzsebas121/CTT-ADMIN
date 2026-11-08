import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";

export default function StepContents({
  contentsData,
  onContentChange,
  onTopicChange,
  onAddModule,
  onRemoveModule,
  onAddTopic,
  onRemoveTopic,
  validationErrors = {}
}) {
  return (
    <div className="space-y-4">
      {validationErrors.contents && (
        <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 text-red-700 dark:text-red-300 text-xs rounded-lg font-medium">
          {validationErrors.contents}
        </div>
      )}

      {/* Grid de 2 Columnas para los Módulos */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 items-start">
        {contentsData.map((module, moduleIndex) => (
          <div
            key={moduleIndex}
            className="rounded-xl border border-black/[0.08] dark:border-white/[0.08] bg-zinc-50/40 dark:bg-white/[0.02] p-4 space-y-3 shadow-2xs transition-colors"
          >
            {/* Header del Módulo */}
            <div className="flex items-center justify-between pb-2 border-b border-black/[0.06] dark:border-white/[0.08]">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-[#00345e] dark:bg-blue-600 text-white text-[11px] font-bold flex items-center justify-center">
                  {moduleIndex + 1}
                </span>
                <h3 className="text-xs font-semibold text-zinc-900 dark:text-white">
                  Módulo {moduleIndex + 1}
                </h3>
              </div>

              {contentsData.length > 1 && (
                <button
                  type="button"
                  onClick={() => onRemoveModule(moduleIndex)}
                  className="inline-flex items-center gap-1 px-2 py-0.5 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-md transition-colors cursor-pointer"
                >
                  <TrashIcon className="w-3.5 h-3.5" />
                  <span>Eliminar</span>
                </button>
              )}
            </div>

            {/* Input de Título del Módulo */}
            <div>
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Título del Módulo <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={module.title || ''}
                onChange={(e) => onContentChange(moduleIndex, 'title', e.target.value)}
                className="w-full bg-white dark:bg-[#121215] border border-black/[0.08] dark:border-white/[0.1] rounded-lg px-2.5 py-1.5 text-xs sm:text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 outline-none focus:border-[#00345e] dark:focus:border-blue-400 transition-colors"
                placeholder="Ej: Fundamentos y Arquitectura del Sistema"
              />
            </div>

            {/* Sub-bloque: Temas del Módulo */}
            <div className="rounded-lg border border-black/[0.06] dark:border-white/[0.06] bg-white/70 dark:bg-black/20 p-3 space-y-2">
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
                Temas y Lecciones <span className="text-red-500">*</span>
              </label>

              <div className="space-y-1.5">
                {(module.topics || []).map((topic, topicIndex) => (
                  <div key={topicIndex} className="flex items-center gap-1.5">
                    <span className="text-[11px] font-medium text-zinc-400 w-4 text-right shrink-0">
                      {topicIndex + 1}.
                    </span>
                    <input
                      type="text"
                      placeholder={`Tema ${topicIndex + 1}: Ej: Configuración del entorno`}
                      value={topic.title || ''}
                      onChange={(e) => onTopicChange(moduleIndex, topicIndex, 'title', e.target.value)}
                      className="flex-1 bg-white dark:bg-[#121215] border border-black/[0.08] dark:border-white/[0.1] rounded-lg px-2.5 py-1 text-xs text-zinc-900 dark:text-white placeholder:text-zinc-400 outline-none focus:border-[#00345e] dark:focus:border-blue-400 transition-colors"
                    />
                    {module.topics.length > 1 && (
                      <button
                        type="button"
                        onClick={() => onRemoveTopic(moduleIndex, topicIndex)}
                        className="p-1 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-md transition-colors cursor-pointer shrink-0"
                        title="Eliminar tema"
                      >
                        <TrashIcon className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => onAddTopic(moduleIndex)}
                className="mt-1 inline-flex items-center gap-1 px-2.5 py-1 bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-[#00345e] dark:text-blue-400 border border-black/[0.08] dark:border-white/[0.1] rounded-lg text-xs font-medium transition cursor-pointer shadow-2xs"
              >
                <PlusIcon className="w-3 h-3" />
                <span>Agregar Tema</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Botón para agregar módulo (Full Width, Notion Style) */}
      <button
        type="button"
        onClick={onAddModule}
        className="w-full py-2.5 px-4 border border-dashed border-[#00345e]/30 dark:border-blue-400/30 hover:border-[#00345e] dark:hover:border-blue-400 bg-[#00345e]/05 dark:bg-blue-500/05 hover:bg-[#00345e]/10 dark:hover:bg-blue-500/10 text-[#00345e] dark:text-blue-400 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
      >
        <PlusIcon className="w-3.5 h-3.5" />
        <span>Agregar Nuevo Módulo</span>
      </button>
    </div>
  );
}
