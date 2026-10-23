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
    <div className="space-y-8">
      <div>
        <p className="text-sm font-semibold text-primary">La ruta de aprendizaje</p>
        <h2 className="text-2xl font-bold text-slate-900 mt-1">Organiza el contenido</h2>
        <p className="text-sm text-slate-500 mt-2">Divide el curso en módulos estructurados y temas fáciles de recorrer.</p>
      </div>

      {validationErrors.contents && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
          {validationErrors.contents}
        </div>
      )}

      <div className="space-y-5">
        {contentsData.map((module, moduleIndex) => (
          <div key={moduleIndex} className="border border-slate-200 rounded-2xl p-5 bg-white shadow-xs">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-100">
              <h3 className="text-base font-bold text-slate-900">Módulo {moduleIndex + 1}</h3>
              {contentsData.length > 1 && (
                <button
                  type="button"
                  onClick={() => onRemoveModule(moduleIndex)}
                  className="px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg border border-red-200 transition cursor-pointer"
                >
                  Eliminar Módulo
                </button>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Título del Módulo <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={module.title || ''}
                  onChange={(e) => onContentChange(moduleIndex, 'title', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                  placeholder="Ej: Módulo 1: Fundamentos y Entorno de Desarrollo"
                />
              </div>

              <div className="bg-gray-50/70 rounded-xl p-4 border border-gray-200/80">
                <label className="block text-xs font-semibold text-gray-700 mb-3">
                  Temas del Módulo <span className="text-red-500">*</span>
                </label>
                {(module.topics || []).map((topic, topicIndex) => (
                  <div key={topicIndex} className="flex flex-col md:flex-row gap-2 mb-3 pl-3 border-l-4 border-primary">
                    <input
                      type="text"
                      placeholder={`Tema ${topicIndex + 1}: Título o lección`}
                      value={topic.title || ''}
                      onChange={(e) => onTopicChange(moduleIndex, topicIndex, 'title', e.target.value)}
                      className="flex-1 border border-gray-300 rounded-lg px-3.5 py-2 focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-xs"
                    />
                    {module.topics.length > 1 && (
                      <button
                        type="button"
                        onClick={() => onRemoveTopic(moduleIndex, topicIndex)}
                        className="px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg border border-red-200 transition self-end md:self-auto cursor-pointer"
                      >
                        Eliminar
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => onAddTopic(moduleIndex)}
                  className="px-3.5 py-1.5 bg-white hover:bg-gray-100 text-primary border border-primary/30 rounded-lg transition text-xs font-semibold shadow-xs cursor-pointer"
                >
                  + Agregar Tema
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={onAddModule}
        className="w-full px-6 py-3.5 bg-primary hover:bg-primary-hover text-white rounded-xl transition font-semibold shadow-xs cursor-pointer text-sm"
      >
        + Agregar Nuevo Módulo
      </button>
    </div>
  )
}
