export default function StepContents({
  contentsData,
  onContentChange,
  onTopicChange,
  onAddModule,
  onRemoveModule,
  onAddTopic,
  onRemoveTopic
}) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Contenido del Curso</h2>
      
      <div className="space-y-4">
        {contentsData.map((module, moduleIndex) => (
          <div key={moduleIndex} className="border-2 border-gray-200 rounded-lg p-5 bg-gradient-to-r from-gray-50 to-white shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">📚 Módulo {moduleIndex + 1}</h3>
              <button
                onClick={() => onRemoveModule(moduleIndex)}
                className="rojo"
              >
                Eliminar Módulo
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Título del Módulo</label>
                  <input
                    type="text"
                    value={module.title}
                    onChange={(e) => onContentChange(moduleIndex, 'title', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#6C1313] focus:border-transparent"
                    placeholder="Ej: Introducción"
                  />
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <label className="block text-sm font-semibold text-gray-700 mb-3">Temas del Módulo</label>
                {module.topics.map((topic, topicIndex) => (
                  <div key={topicIndex} className="flex flex-col md:flex-row gap-2 mb-3 pl-4 border-l-4 border-[#6C1313]">
                    <input
                      type="text"
                      placeholder="Título del tema"
                      value={topic.title}
                      onChange={(e) => onTopicChange(moduleIndex, topicIndex, 'title', e.target.value)}
                      className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#6C1313] focus:border-transparent"
                    />
                    <button
                      onClick={() => onRemoveTopic(moduleIndex, topicIndex)}
                      className="rojo self-end md:self-auto"
                    >
                      Eliminar
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => onAddTopic(moduleIndex)}
                  className="px-4 py-2 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg transition font-medium"
                >
                  + Agregar Tema
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={onAddModule}
        className="w-full px-6 py-4 bg-[#6C1313] hover:bg-[#5a0f0f] text-white rounded-lg transition font-semibold shadow-lg"
      >
        + Agregar Nuevo Módulo
      </button>
    </div>
  )
}
