import {
  BuildingOffice2Icon,
  PlusIcon,
  TrashIcon,
  BanknotesIcon,
  GlobeAltIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";

export default function StepSponsors({
  sponsors,
  onAddSponsor,
  onRemoveSponsor,
  onSponsorChange,
  availableSponsors,
  onOpenCreateSponsorModal,
  validationErrors = {},
}) {
  const categoryOptions = [
    { value: "platino", label: "Platino" },
    { value: "oro", label: "Oro" },
    { value: "plata", label: "Plata" },
    { value: "bronce", label: "Bronce" },
    { value: "colaborador", label: "Colaborador" },
  ];

  return (
    <div className="space-y-5">
      {/* Encabezado limpio y directo sin cápsulas decorativas */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white tracking-tight">
            Patrocinadores y Auspicios Institucionales
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Vincula empresas aliadas, universidades y organizaciones que respaldan el congreso.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <button
            type="button"
            onClick={onOpenCreateSponsorModal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 shadow-2xs transition-colors cursor-pointer"
          >
            <BuildingOffice2Icon className="w-3.5 h-3.5" />
            <span>Nueva Empresa</span>
          </button>

          <button
            type="button"
            onClick={onAddSponsor}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#00345e] hover:bg-[#002747] text-white shadow-2xs transition-colors cursor-pointer border-0"
          >
            <PlusIcon className="w-4 h-4 stroke-[2.5]" />
            <span>Asociar Patrocinador</span>
          </button>
        </div>
      </div>

      {/* Nota informativa */}
      <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-50/70 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-900/40 text-blue-800 dark:text-blue-300 text-xs">
        <InformationCircleIcon className="w-4 h-4 shrink-0 mt-0.5 text-blue-600 dark:text-blue-400" />
        <div className="leading-relaxed text-[11px] sm:text-xs">
          <span>
            Los patrocinadores aportan financiamiento y respaldo institucional. Cada empresa debe asignarse una sola vez por congreso.
          </span>
        </div>
      </div>

      {/* Lista Dinámica de Patrocinadores */}
      {sponsors && sponsors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {sponsors.map((spo, index) => {
            const selectedCompany = availableSponsors.find(
              (s) => Number(s.id_sponsor || s.id) === Number(spo.id_sponsor)
            );

            return (
              <div
                key={index}
                className="rounded-xl border border-black/[0.08] dark:border-white/[0.08] bg-zinc-50/60 dark:bg-white/[0.02] p-3.5 sm:p-4 space-y-3 shadow-2xs hover:border-black/[0.15] dark:hover:border-white/[0.15] transition-all"
              >
                {/* Cabecera de la tarjeta */}
                <div className="flex items-center justify-between pb-2 border-b border-black/[0.05] dark:border-white/[0.06]">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-md bg-[#00345e] text-white text-xs font-bold flex items-center justify-center shadow-xs">
                      {index + 1}
                    </span>
                    <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 truncate">
                      {selectedCompany ? selectedCompany.nombre : `Patrocinador #${index + 1}`}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onRemoveSponsor(index)}
                    className="p-1 rounded-md text-zinc-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                    title="Quitar patrocinador"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>

                {/* Selector de Empresa */}
                <div>
                  <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Empresa / Entidad Colaboradora <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={spo.id_sponsor || ""}
                    onChange={(e) => onSponsorChange(index, "id_sponsor", e.target.value)}
                    className="w-full h-9 px-3 rounded-lg border border-black/[0.08] dark:border-white/[0.08] text-xs bg-white dark:bg-[#121215] text-zinc-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#00345e] dark:focus:ring-blue-400 transition-all cursor-pointer"
                  >
                    <option value="">Selecciona una empresa del catálogo...</option>
                    {availableSponsors.map((item) => (
                      <option
                        key={item.id_sponsor || item.id}
                        value={item.id_sponsor || item.id}
                      >
                        {item.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Detalle visual de la empresa seleccionada */}
                {selectedCompany && (
                  <div className="flex items-center gap-2.5 p-2 rounded-lg bg-white dark:bg-[#121215] border border-black/[0.04] dark:border-white/[0.04]">
                    {selectedCompany.logo_url && (
                      <img
                        src={selectedCompany.logo_url}
                        alt={selectedCompany.nombre}
                        className="w-7 h-7 object-contain rounded bg-zinc-100 dark:bg-zinc-800 p-0.5 shrink-0"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-zinc-900 dark:text-white truncate">
                        {selectedCompany.nombre}
                      </p>
                      {selectedCompany.sitio_web && (
                        <a
                          href={selectedCompany.sitio_web}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[10px] text-blue-600 dark:text-blue-400 hover:underline truncate"
                        >
                          <GlobeAltIcon className="w-2.5 h-2.5" />
                          <span className="truncate">{selectedCompany.sitio_web}</span>
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* Categoría y Aporte en 2 Columnas */}
                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  <div>
                    <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                      Categoría
                    </label>
                    <select
                      value={String(spo.categoria || "oro").toLowerCase()}
                      onChange={(e) => onSponsorChange(index, "categoria", e.target.value)}
                      className="w-full h-8 px-2.5 rounded-lg border border-black/[0.08] dark:border-white/[0.08] text-xs bg-white dark:bg-[#121215] text-zinc-900 dark:text-white capitalize focus:outline-none focus:ring-1 focus:ring-[#00345e] dark:focus:ring-blue-400 cursor-pointer"
                    >
                      {categoryOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                      Aporte ($ USD)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min={0}
                        step="50"
                        value={spo.aporte ?? 0}
                        onChange={(e) => onSponsorChange(index, "aporte", e.target.value)}
                        className="w-full h-8 pl-7 pr-2 rounded-lg border border-black/[0.08] dark:border-white/[0.08] text-xs bg-white dark:bg-[#121215] text-zinc-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#00345e] dark:focus:ring-blue-400"
                      />
                      <BanknotesIcon className="w-3.5 h-3.5 text-zinc-400 absolute left-2 top-2" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Estado Vacío Limpio */
        <div className="text-center py-10 px-4 rounded-xl border border-dashed border-black/[0.12] dark:border-white/[0.12] bg-zinc-50/40 dark:bg-white/[0.01]">
          <BuildingOffice2Icon className="w-10 h-10 text-zinc-300 dark:text-zinc-600 mx-auto mb-2" />
          <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
            Sin patrocinadores asociados
          </h3>
          <p className="text-xs text-zinc-400 max-w-md mx-auto mt-1 mb-4">
            Puedes vincular empresas colaboradoras existentes o crear una nueva empresa directamente en el catálogo.
          </p>
          <div className="flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={onOpenCreateSponsorModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 shadow-2xs transition-colors cursor-pointer"
            >
              <BuildingOffice2Icon className="w-3.5 h-3.5" />
              <span>Registrar Empresa</span>
            </button>
            <button
              type="button"
              onClick={onAddSponsor}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#00345e] hover:bg-[#002747] text-white shadow-2xs transition-colors cursor-pointer border-0"
            >
              <PlusIcon className="w-4 h-4 stroke-[2.5]" />
              <span>Asociar Patrocinador</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

