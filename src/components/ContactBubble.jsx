import React, { useState, useRef, useEffect } from "react";
import {
  motion as Motion,
  AnimatePresence,
  useMotionValue,
  animate,
} from "framer-motion";
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
  const [pos, setPos] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const buttonRef = useRef(null);
  // motion values for smooth clearing of transforms instead of remounting
  const x = useMotionValue(0);
  const y = useMotionValue(0);

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

    // ensure bubble resets on refresh: remove any previously stored key if present
    try {
      localStorage.removeItem("lovelis.contactBubble.pos");
    } catch (err) {
      void err;
    }

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

  // helper to clamp pointer-center into viewport and store as pos
  function handleDragEnd(e, info) {
    e.stopPropagation();
    const btn = buttonRef.current || e.target.closest("button") || e.target;
    const rect = btn.getBoundingClientRect();
    const padding = 8;
    const halfW = rect.width / 2;
    const halfH = rect.height / 2;
    const minX = padding + halfW;
    const maxX = Math.max(minX, window.innerWidth - padding - halfW);
    const minY = padding + halfH;
    const maxY = Math.max(minY, window.innerHeight - padding - halfH);

    const scrollX = window.scrollX || 0;
    const scrollY = window.scrollY || 0;
    const pointerX =
      info && info.point && typeof info.point.x === "number"
        ? info.point.x - scrollX
        : rect.left + halfW;
    const pointerY =
      info && info.point && typeof info.point.y === "number"
        ? info.point.y - scrollY
        : rect.top + halfH;

    const cx = Math.min(Math.max(minX, pointerX), maxX);
    const cy = Math.min(Math.max(minY, pointerY), maxY);

    // read current transforms so we can keep visual position steady
    const curX = x.get();
    const curY = y.get();
    const centerX = rect.left + halfW;
    const centerY = rect.top + halfH;

    // Update stored position to top-left (so we can keep translate via motion values)
    // store position as top-left corner to avoid needing CSS translate(-50%, -50%)
    setPos({ x: Math.round(cx - halfW), y: Math.round(cy - halfH) });

    // After we change left/top, adjust the motion values so the element doesn't jump visually.
    // The visual offset we need to apply equals the previous translate plus the difference
    // between the previous center and the new center.
    x.set(curX + (centerX - cx));
    y.set(curY + (centerY - cy));

    // animate the translation back to zero (smoothly clearing the drag transform)
    animate(x, 0, { type: "spring", stiffness: 600, damping: 40 });
    animate(y, 0, { type: "spring", stiffness: 600, damping: 40 });

    // prevent click after drag (short delay)
    setTimeout(() => setIsDragging(false), 120);
  }

  // No remount/correction logic: we smooth-cleared the transform with motion values instead.

  return (
    <div
      ref={rootRef}
      className={`fixed z-50 ${pos ? "" : "right-6 bottom-6"}`}
    >
      {/* portal for the fan buttons so they don't get clipped */}
      {open &&
        (() => {
          let fanAnchor = anchor;
          try {
            if (!fanAnchor && buttonRef.current) {
              const r = buttonRef.current.getBoundingClientRect();
              fanAnchor = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
            }
          } catch (err) {
            void err;
          }
          if (!fanAnchor || items.length === 0) return null;
          return createPortal(
            <div ref={portalRef} className="pointer-events-none">
              <AnimatePresence>
                {items.map((it, i) => {
                  const angleStart = 200;
                  const angleStep = 40;
                  const angle = ((angleStart + i * angleStep) * Math.PI) / 180;
                  const radius = 84;
                  const dx = Math.cos(angle) * radius;
                  const dy = Math.sin(angle) * radius;
                  const size = 48;
                  const left = fanAnchor.x + dx - size / 2;
                  const top = fanAnchor.y + dy - size / 2;
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
                      className="fixed z-50 w-12 h-12 rounded-full flex items-center justify-center text-white"
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
              </AnimatePresence>
            </div>,
            document.body
          );
        })()}

      {/* main draggable button */}
      <div className="flex items-end">
        <Motion.button
          drag
          dragMomentum={false}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={handleDragEnd}
          ref={buttonRef}
          onClick={(e) => {
            if (isDragging) {
              e.preventDefault();
              e.stopPropagation();
              return;
            }
            setOpen((v) => {
              const next = !v;
              if (next) {
                try {
                  const btn = buttonRef.current || rootRef.current;
                  if (btn) {
                    const r = btn.getBoundingClientRect();
                    setAnchor({
                      x: r.left + r.width / 2,
                      y: r.top + r.height / 2,
                    });
                  }
                } catch (err) {
                  void err;
                }
              } else {
                setAnchor(null);
              }
              return next;
            });
          }}
          whileTap={{ scale: 0.95 }}
          style={
            pos
              ? {
                  position: "fixed",
                  left: typeof pos.x === "number" ? `${pos.x}px` : pos.x,
                  top: typeof pos.y === "number" ? `${pos.y}px` : pos.y,
                  touchAction: "none",
                  x,
                  y,
                }
              : { touchAction: "none" }
          }
          // Attach motion values so the visual offset is animated back to zero
          // (these are read/animated in handleDragEnd)
          // eslint-disable-next-line react/style-prop-object
          // style will be merged; pass x and y via motion props below
          className="w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center shadow-xl bg-gradient-to-br from-indigo-600 to-indigo-500 text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-300 relative z-50"
          aria-expanded={open}
          aria-label={
            open ? "Cerrar opciones de contacto" : "Abrir opciones de contacto"
          }
        >
          <span
            className="absolute -inset-1 rounded-full border-4 border-white opacity-90"
            aria-hidden
          />
          <FaRegCommentDots
            className="w-5 h-5 md:w-6 md:h-6 relative"
            aria-hidden
          />
        </Motion.button>
      </div>
    </div>
  );
}
