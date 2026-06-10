import { AnimatePresence, motion } from "motion/react";
import { useState, useEffect } from "react";

type Props = { isHome?: boolean };

export default function GlobalLoader({ isHome = false }: Props) {
  const [show, setShow] = useState(() => {
    const introPlayed = sessionStorage.getItem("introPlayed") === "1";
    return !(isHome && !introPlayed);
  });

  useEffect(() => {
    if (!show) return;
    const done = () => setShow(false);
    if (document.readyState === "complete") done();
    else window.addEventListener("load", done, { once: true });
    return () => window.removeEventListener("load", done);
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-9999 grid place-items-center bg-base-100"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <span className="loading loading-spinner loading-lg text-primary" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
