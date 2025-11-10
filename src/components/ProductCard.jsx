import React, { useState, useContext, useRef, useEffect } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { INSTAGRAM_USER, WHATSAPP_NUMBER } from "../data/contactConfig";
import { ToastContext } from "./ToastProvider";

export default function ProductCard({ p, openImage }) {
  const imgs =
    p && p.images && p.images.length ? p.images : p && p.image ? [p.image] : [];

  const [loaded, setLoaded] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const optionsRef = useRef(null);
  const idRef = useRef("pc_" + Math.random().toString(36).slice(2, 9));
  const { showToast } = useContext(ToastContext);

  useEffect(() => {
    if (!showOptions) return;
    function onDoc(ev) {
      if (!optionsRef.current) return;
      if (!optionsRef.current.contains(ev.target)) setShowOptions(false);
    }
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, [showOptions]);

  // Close this popover when any other product card opens its popover
  useEffect(() => {
    function onOtherOpen(e) {
      try {
        const otherId = e && e.detail;
        if (!otherId) return;
        if (otherId !== idRef.current) {
          setShowOptions(false);
        }
      } catch (err) {
        void err;
      }
    }
    window.addEventListener("productcard:open", onOtherOpen);
    return () => window.removeEventListener("productcard:open", onOtherOpen);
  }, []);

  function consultInstagram(e) {
    if (e && e.stopPropagation) e.stopPropagation();
    var appUser = "instagram://user?username=" + INSTAGRAM_USER;
    var profileWeb = "https://www.instagram.com/" + INSTAGRAM_USER;
    try {
      window.location.href = appUser;
      showToast("Abriendo Instagram...");
    } catch (err) {
      void err;
    }
    setTimeout(function () {
      try {
        window.open(profileWeb, "_blank");
      } catch (err) {
        void err;
      }
    }, 700);
  }

  function consultWhatsApp(e) {
    if (e && e.stopPropagation) e.stopPropagation();
    var message =
      "Hola! Quisiera consultar por el producto: " +
      (p && p.name ? p.name : "");
    if (p && p.price) message += " - " + p.price;
    if (p && p.link) message += " - " + p.link;
    var encoded = encodeURIComponent(message);
    var waUrl = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encoded;
    try {
      window.open(waUrl, "_blank");
    } catch (err) {
      void err;
      showToast("No fue posible abrir WhatsApp");
    }
  }

  return (
    <div
      className="group relative bg-white rounded-2xl shadow-md hover:shadow-lg transition-all cursor-pointer w-full max-w-xs flex flex-col h-full focus:outline-none"
      role="button"
      tabIndex={0}
      onClick={function () {
        if (openImage && imgs.length) openImage(imgs, 0);
      }}
      onKeyDown={function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          if (openImage && imgs.length) openImage(imgs, 0);
        }
      }}
    >
      {imgs.length > 1 && (
        <>
          <div className="absolute top-3 right-3 z-20 bg-black/60 text-white text-xs px-2 py-1 rounded">
            {imgs.length} imágenes
          </div>
          <div className="absolute top-3 left-3 z-20 bg-white/90 text-gray-800 text-xs px-2 py-1 rounded">
            1/{imgs.length}
          </div>
        </>
      )}

      <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <span className="text-white text-sm font-medium bg-black/40 px-4 py-2 rounded">
          Ver
        </span>
      </div>

      <div className="w-full h-48 overflow-hidden bg-gray-100 relative rounded-t-2xl">
        {!loaded && (
          <div className="absolute inset-0 animate-pulse bg-gray-200" />
        )}
        {imgs[0] ? (
          <img
            src={imgs[0]}
            alt={(p && p.name) || "producto"}
            className="w-full h-48 object-cover rounded-t-2xl"
            onLoad={function () {
              setLoaded(true);
            }}
          />
        ) : (
          <div className="w-full h-48 flex items-center justify-center text-gray-400">
            Sin imagen
          </div>
        )}
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">
            {(p && p.name) || ""}
          </h3>
          {p && p.price && (
            <div className="text-sm text-gray-700 mt-1">{p.price}</div>
          )}
        </div>

        <div className="mt-4 flex items-center gap-3 relative">
          <button
            type="button"
            onClick={function (e) {
              e.stopPropagation();
              setShowOptions(function (s) {
                const next = !s;
                if (next) {
                  // announce that this card opened its popover so others close
                  try {
                    window.dispatchEvent(
                      new CustomEvent("productcard:open", {
                        detail: idRef.current,
                      })
                    );
                  } catch (err) {
                    void err;
                  }
                }
                return next;
              });
            }}
            aria-expanded={showOptions}
            className="inline-flex items-center gap-2 bg-pink-500 text-white px-3 py-2 rounded-full text-sm hover:bg-pink-600 transition focus:outline-none focus:ring-2 focus:ring-pink-300"
          >
            Consultar
          </button>

          <AnimatePresence>
            {showOptions && (
              <Motion.div
                ref={optionsRef}
                initial={{ opacity: 0, scale: 0.96, y: -6 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: -6 }}
                transition={{ duration: 0.12 }}
                className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-lg border border-black/10 z-50 overflow-hidden"
              >
                <button
                  type="button"
                  onClick={function (e) {
                    consultWhatsApp(e);
                    setShowOptions(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center gap-2"
                >
                  <img
                    src="/whatsapp-logo.png"
                    alt="WhatsApp"
                    className="w-5 h-5"
                  />
                  <div className="flex flex-col text-sm">
                    <span className="font-medium">WhatsApp</span>
                    <span className="text-xs text-gray-500">
                      Mensaje rápido
                    </span>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={function (e) {
                    consultInstagram(e);
                    setShowOptions(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center gap-2"
                >
                  <img
                    src="/instagram-logo.png"
                    alt="Instagram"
                    className="w-5 h-5"
                  />
                  <div className="flex flex-col text-sm">
                    <span className="font-medium">Instagram</span>
                    <span className="text-xs text-gray-500">Abrir perfil</span>
                  </div>
                </button>
              </Motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* toasts are handled globally by ToastProvider */}
    </div>
  );
}
