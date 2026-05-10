import { useEffect, useState } from 'react';

function toInputValue(field, value) {
  if (value === null || value === undefined) {
    if (field.type === 'checkbox') return false;
    return field.defaultValue ?? '';
  }
  if (field.type === 'date' && typeof value === 'string') {
    return value.slice(0, 10);
  }
  if (field.type === 'datetime-local' && typeof value === 'string') {
    return value.slice(0, 16);
  }
  return value;
}

export default function ModalForm({ title, fields, initialData, onClose, onSubmit }) {
  const [form, setForm] = useState({});

  useEffect(() => {
    const next = {};
    fields.forEach((field) => {
      next[field.name] = toInputValue(field, initialData?.[field.name]);
    });
    setForm(next);
  }, [fields, initialData]);

  const handleChange = (field, event) => {
    const value = field.type === 'checkbox' ? event.target.checked : event.target.value;
    setForm((prev) => ({ ...prev, [field.name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const payload = {};
    fields.forEach((field) => {
      let value = form[field.name];
      if (field.type === 'number' && value !== '') value = Number(value);
      if (field.type === 'checkbox') value = Boolean(value);
      payload[field.name] = value;
    });
    onSubmit(payload);
  };

  return (
    <div className="modal d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.45)' }}>
      <div className="modal-dialog modal-lg modal-dialog-scrollable">
        <div className="modal-content border-0 rounded-4">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="row g-3">
                {fields.map((field) => (
                  <div className={field.col || 'col-md-6'} key={field.name}>
                    {field.type === 'checkbox' ? (
                      <div className="form-check mt-4 pt-2">
                        <input
                          id={field.name}
                          className="form-check-input"
                          type="checkbox"
                          checked={!!form[field.name]}
                          onChange={(event) => handleChange(field, event)}
                        />
                        <label className="form-check-label" htmlFor={field.name}>
                          {field.label}
                        </label>
                      </div>
                    ) : (
                      <>
                        <label className="form-label fw-semibold">{field.label}</label>
                        {field.type === 'textarea' ? (
                          <textarea
                            className="form-control"
                            rows={field.rows || 3}
                            value={form[field.name] ?? ''}
                            onChange={(event) => handleChange(field, event)}
                            required={field.required}
                          ></textarea>
                        ) : field.type === 'select' ? (
                          <select
                            className="form-select"
                            value={form[field.name] ?? ''}
                            onChange={(event) => handleChange(field, event)}
                            required={field.required}
                          >
                            <option value="">Seleccione...</option>
                            {field.options.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            className="form-control"
                            type={field.type || 'text'}
                            value={form[field.name] ?? ''}
                            onChange={(event) => handleChange(field, event)}
                            required={field.required}
                            min={field.min}
                            max={field.max}
                            step={field.step}
                          />
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-outline-secondary" onClick={onClose}>Cancelar</button>
              <button type="submit" className="btn btn-primary">Guardar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
