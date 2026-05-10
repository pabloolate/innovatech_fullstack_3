import { useMemo, useState } from 'react';
import ModalForm from './ModalForm.jsx';

function formatValue(value) {
  if (value === null || value === undefined) return '—';
  if (typeof value === 'boolean') return value ? 'Sí' : 'No';
  if (typeof value === 'string' && value.includes('T')) return value.replace('T', ' ').slice(0, 16);
  return String(value);
}

export default function EntitySection({
  title,
  description,
  items,
  columns,
  fields,
  editFields,
  onRefresh,
  onCreate,
  onUpdate,
  onDelete,
  onActivate,
  onDeactivate,
  activeField = 'activo',
  customActions = [],
  emptyText = 'No hay registros todavía.',
}) {
  const [modalMode, setModalMode] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [filterText, setFilterText] = useState('');

  const filteredItems = useMemo(() => {
    if (!filterText.trim()) return items;
    const needle = filterText.toLowerCase();
    return items.filter((item) => JSON.stringify(item).toLowerCase().includes(needle));
  }, [items, filterText]);

  const openCreate = () => {
    setSelectedItem(null);
    setModalMode('create');
  };

  const openEdit = (item) => {
    setSelectedItem(item);
    setModalMode('edit');
  };

  const closeModal = () => {
    setSelectedItem(null);
    setModalMode(null);
  };

  const handleSubmit = async (payload) => {
    if (modalMode === 'create') {
      await onCreate(payload);
    } else if (modalMode === 'edit') {
      await onUpdate(selectedItem.id, payload);
    }
    closeModal();
    await onRefresh();
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`¿Seguro que quieres eliminar el registro ${item.id}?`)) return;
    await onDelete(item.id);
    await onRefresh();
  };

  const handleActivate = async (item) => {
    await onActivate(item.id);
    await onRefresh();
  };

  const handleDeactivate = async (item) => {
    await onDeactivate(item.id);
    await onRefresh();
  };

  return (
    <div className="card card-soft mb-4">
      <div className="card-body">
        <div className="d-flex flex-column flex-lg-row justify-content-between gap-3 mb-3">
          <div>
            <h4 className="mb-1">{title}</h4>
            <div className="small-muted">{description}</div>
          </div>
          <div className="d-flex flex-column flex-md-row gap-2">
            <input
              className="form-control"
              placeholder="Filtrar rápido"
              value={filterText}
              onChange={(event) => setFilterText(event.target.value)}
            />
            <button className="btn btn-outline-secondary" onClick={onRefresh}>Recargar</button>
            <button className="btn btn-primary" onClick={openCreate}>Crear</button>
          </div>
        </div>

        <div className="table-wrapper">
          <table className="table table-striped table-hover align-middle">
            <thead>
              <tr>
                {columns.map((column) => <th key={column.key}>{column.label}</th>)}
                <th style={{ minWidth: '280px' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 1} className="text-center py-4 text-muted">{emptyText}</td>
                </tr>
              ) : filteredItems.map((item) => (
                <tr key={item.id}>
                  {columns.map((column) => (
                    <td key={`${item.id}-${column.key}`}>{column.render ? column.render(item[column.key], item) : formatValue(item[column.key])}</td>
                  ))}
                  <td>
                    <div className="d-flex flex-wrap gap-2">
                      <button className="btn btn-sm btn-outline-primary" onClick={() => openEdit(item)}>Editar</button>
                      {onDelete ? <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(item)}>Eliminar</button> : null}
                      {onActivate && onDeactivate ? (
                        item[activeField]
                          ? <button className="btn btn-sm btn-outline-warning" onClick={() => handleDeactivate(item)}>Desactivar</button>
                          : <button className="btn btn-sm btn-outline-success" onClick={() => handleActivate(item)}>Activar</button>
                      ) : null}
                      {customActions.map((action) => (
                        <button key={action.label} className={`btn btn-sm ${action.className || 'btn-outline-secondary'}`} onClick={() => action.onClick(item)}>
                          {action.label}
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalMode ? (
        <ModalForm
          title={modalMode === 'create' ? `Crear ${title}` : `Editar ${title}`}
          fields={modalMode === 'edit' && editFields ? editFields : fields}
          initialData={selectedItem}
          onClose={closeModal}
          onSubmit={handleSubmit}
        />
      ) : null}
    </div>
  );
}
