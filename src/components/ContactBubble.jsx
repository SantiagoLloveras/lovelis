import React, { useState, useRef, useEffect } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { FaRegCommentDots } from "react-icons/fa";
import { SiWhatsapp, SiInstagram } from "react-icons/si";

export default function ContactBubble({
  whatsappNumber = "",
  instagramUser = "",
  message = "Hola! Quisiera consultar por este producto",
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const portalRef = useRef(null);
  const [anchor, setAnchor] = useState(null);

  useEffect(() => {
    function onDoc(e) {
      if (!rootRef.current) return;
      const insideRoot = rootRef.current.contains(e.target);
      const insidePortal =
        portalRef.current && portalRef.current.contains(e.target);
      if (!insideRoot && !insidePortal) setOpen(false);
    }
    document.addEventListener("pointerdown", onDoc);
    function onKey(e) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDoc);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  const encoded = encodeURIComponent(message || "Hola!");
  const waHref = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${encoded}`
    : null;
  const igWeb = instagramUser
    ? `https://www.instagram.com/${instagramUser}`
    : null;

  function openInstagram() {
    if (!instagramUser) return;
    const deep = `instagram://user?username=${instagramUser}`;
    try {
      window.location.href = deep;
    } catch (err) {
      void err;
    }
    setTimeout(() => {
      try {
        window.open(igWeb, "_blank");
      } catch (err) {
        void err;
      }
    }, 700);
    setOpen(false);
  }

  useEffect(() => {
    if (open && rootRef.current) {
      const r = rootRef.current.getBoundingClientRect();
      setAnchor({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
    }
    if (!open) setAnchor(null);
  }, [open]);

  const items = [
    waHref
      ? {
          key: "wa",
          onClick: () => {
            try {
              window.open(waHref, "_blank");
            } catch (err) {
              void err;
            }
            setOpen(false);
          },
        }
      : null,
    igWeb
      ? {
          key: "ig",
          onClick: () => openInstagram(),
        }
      : null,
  ].filter(Boolean);

  return (
    <div ref={rootRef} className="fixed right-6 bottom-6 z-50">
      <div className="flex items-end">
        {anchor &&
          createPortal(
            <div ref={portalRef} className="pointer-events-none">
              <AnimatePresence>
                {open && (
                  <>
                    {items.map((it, i) => {
                      const angleStart = 200; // degrees
                      const angleStep = 40; // degrees
                      const angle =
                        ((angleStart + i * angleStep) * Math.PI) / 180;
                      const radius = 84; // px
                      const dx = Math.cos(angle) * radius;
                      const dy = Math.sin(angle) * radius;
                      const size = 48;
                      const left = anchor.x + dx - size / 2;
                      const top = anchor.y + dy - size / 2;
                      return (
                        <Motion.button
                          key={it.key}
                          initial={{ opacity: 0, scale: 0.6 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.6 }}
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 20,
                            delay: i * 0.03,
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            it.onClick();
                          }}
                          aria-label={it.key}
                          className={`fixed z-50 w-12 h-12 rounded-full flex items-center justify-center text-white`}
                          style={{ left, top, pointerEvents: "auto" }}
                        >
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg p-1 ${
                              it.key === "wa" ? "bg-green-600" : "bg-pink-600"
                            }`}
                          >
                            {it.key === "wa" ? (
                              <SiWhatsapp
                                className="w-6 h-6 text-white"
                                aria-hidden
                              />
                            ) : (
                              <SiInstagram
                                className="w-6 h-6 text-white"
                                aria-hidden
                              />
                            )}
                          </div>
                        </Motion.button>
                      );
                    })}
                  </>
                )}
              </AnimatePresence>
            </div>,
            document.body
          )}

        <div className="relative w-20 h-20 flex items-center justify-center">
          <AnimatePresence>
            {open && (
              <Motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="absolute w-20 h-20 rounded-full flex items-center justify-center z-40 pointer-events-none"
              >
                <div className="w-20 h-20 rounded-full border-4 border-white shadow-lg" />
              </Motion.div>
            )}
          </AnimatePresence>

          <Motion.button
            onClick={() => setOpen((v) => !v)}
            whileTap={{ scale: 0.95 }}
            className="w-14 h-14 rounded-full flex items-center justify-center shadow-xl bg-gradient-to-br from-indigo-600 to-indigo-500 text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-300 relative z-50"
            aria-expanded={open}
            aria-label={
              open
                ? "Cerrar opciones de contacto"
                : "Abrir opciones de contacto"
            }
          >
            <FaRegCommentDots className="w-6 h-6" aria-hidden />
          </Motion.button>
        </div>
      </div>
    </div>
  );
}
