import React from "react";

export default function Swatch({ setToolType }) {
  return (
    <div>
      <div className="row">
        <div className="col-md-12">
          <div>
            <button
              title="Pencil"
              onClick={() => {
                setToolType("pencil");
              }}
            >
              Pencil
            </button>
            <button
              title="Eraser"
              onClick={() => {
                setToolType("eraser");
              }}
            >
              Eraser
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
