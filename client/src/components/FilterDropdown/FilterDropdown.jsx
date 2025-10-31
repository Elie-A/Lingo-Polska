import React, { useRef, useState } from "react";
import { useOutsideClick } from "../../hooks/useOutsideClick";

const FilterDropdown = ({ options, selected, onChange, placeholder }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useOutsideClick(ref, () => setOpen(false));

    return (
        <div ref={ref} className="custom-select-wrapper">
            <button className="custom-select-button" onClick={() => setOpen(!open)}>
                {selected || placeholder} <span>{open ? "▲" : "▼"}</span>
            </button>
            {open && (
                <div className="custom-dropdown-list">
                    {options.map((opt) => (
                        <div
                            key={opt || "all"}
                            className={`custom-dropdown-item ${opt === selected ? "selected" : ""}`}
                            onClick={() => { onChange(opt); setOpen(false); }}
                        >
                            {opt || placeholder}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FilterDropdown;