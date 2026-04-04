export const Input = ({ 
  label, 
  placeholder, 
  value, 
  onChange, 
  type = 'text', 
  className = '', 
  name,
  required = false
}) => {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <span className="text-xs font-bold uppercase tracking-widest text-brand-blue/80 ml-1">
          {label}
        </span>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full bg-brand-warm border border-brand-border rounded-xl px-4 py-3 text-brand-dark placeholder-brand-muted/50 focus:outline-none focus:border-brand-blue/50 focus:ring-1 focus:ring-brand-blue/20 transition-all duration-200 shadow-sm"
      />
    </div>
  )
}

export const Textarea = ({ 
  label, 
  placeholder, 
  value, 
  onChange, 
  className = '', 
  name,
  required = false,
  rows = 4
}) => {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <span className="text-xs font-bold uppercase tracking-widest text-brand-blue/80 ml-1">
          {label}
        </span>
      )}
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        rows={rows}
        className="w-full bg-brand-warm border border-brand-border rounded-xl px-4 py-3 text-brand-dark placeholder-brand-muted/50 focus:outline-none focus:border-brand-blue/50 focus:ring-1 focus:ring-brand-blue/20 transition-all duration-200 resize-none md:max-h-60 shadow-sm"
      />
    </div>
  )
}
