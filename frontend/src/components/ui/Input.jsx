import React from 'react'

export const Input = ({ 
  label, 
  value, 
  onChange, 
  placeholder = '', 
  type = 'text', 
  name, 
  required = false, 
  className = '',
  autoFocus = false,
  icon = null
}) => {
  return (
    <div className={`space-y-2 w-full text-left ${className}`}>
      {label && (
        <label className="text-[11px] font-bold uppercase tracking-widest text-[#6B7A8C] ml-1">
          {label}
        </label>
      )}
      <div className="relative group">
        {icon && (
          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[#6B7A8C] group-focus-within:text-[#5F9EA0] transition-colors pointer-events-none opacity-50">
            {icon}
          </div>
        )}
        <input
          autoFocus={autoFocus}
          type={type}
          name={name}
          required={required}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`
            w-full py-3 rounded-2xl border border-[#E7DDE5] focus:border-[#5F9EA0] outline-none transition-all text-sm text-[#243447] placeholder-[#6B7A8C]/30 bg-white
            ${icon ? 'pl-11 pr-5' : 'px-5'}
          `}
        />
      </div>
    </div>
  )
}

export const Textarea = ({ 
  label, 
  value, 
  onChange, 
  placeholder = '', 
  rows = 4, 
  name, 
  required = false, 
  className = '' 
}) => {
  return (
    <div className={`space-y-2 w-full text-left ${className}`}>
      {label && (
        <label className="text-[11px] font-bold uppercase tracking-widest text-[#6B7A8C] ml-1">
          {label}
        </label>
      )}
      <textarea
        name={name}
        required={required}
        rows={rows}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-5 py-4 rounded-2xl border border-[#E7DDE5] focus:border-[#5F9EA0] outline-none transition-all text-sm text-[#243447] placeholder-[#6B7A8C]/30 bg-white resize-none"
      />
    </div>
  )
}
